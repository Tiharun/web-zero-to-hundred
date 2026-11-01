//! 통합 테스트: 진짜 서버를 빈 포트에 띄우고, 봇 클라이언트(tokio-tungstenite)로 접속한다.
//! DB 없이 돈다(DATABASE_URL이 없을 때와 같은 상태).
//! 실행: cargo test -p server --test ws_flow

use std::net::SocketAddr;
use std::path::Path;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use game_core::protocol::{
    ClientMsg, ErrorCode, MAX_INPUTS_PER_SEC, PROTOCOL_VERSION, Phase, ServerMsg,
};
use server::app::{AppState, router};
use tokio::net::{TcpListener, TcpStream};
use tokio::time::{sleep, timeout};
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::{MaybeTlsStream, WebSocketStream, connect_async};

type Ws = WebSocketStream<MaybeTlsStream<TcpStream>>;

// ---------- 도우미 ----------

/// 서버를 127.0.0.1의 빈 포트(0 = 운영체제가 골라 줌)에 띄우고 주소를 돌려준다.
async fn start_server() -> SocketAddr {
    start_server_with_idle(AppState::new(None).idle_timeout).await
}

/// 무응답 제한 시간을 바꿔서 서버를 띄운다(끊김 테스트용).
async fn start_server_with_idle(idle_timeout: Duration) -> SocketAddr {
    let mut state = AppState::new(None);
    state.idle_timeout = idle_timeout;
    let app = router(state, Path::new("no-static-files-in-tests"));
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    addr
}

async fn create_room(addr: SocketAddr) -> String {
    let response = reqwest::Client::new()
        .post(format!("http://{addr}/api/rooms"))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), 201);
    let body: serde_json::Value = response.json().await.unwrap();
    body["code"].as_str().unwrap().to_string()
}

async fn connect(addr: SocketAddr, code: &str, role: &str) -> Ws {
    let (ws, _response) = connect_async(format!("ws://{addr}/ws/{code}?role={role}"))
        .await
        .unwrap();
    ws
}

async fn send(ws: &mut Ws, msg: &ClientMsg) {
    let text = serde_json::to_string(msg).unwrap();
    ws.send(Message::text(text)).await.unwrap();
}

/// 다음 서버 메시지. 3초 안에 안 오거나 연결이 끊기면 None.
async fn recv(ws: &mut Ws) -> Option<ServerMsg> {
    loop {
        match timeout(Duration::from_secs(3), ws.next()).await {
            Ok(Some(Ok(Message::Text(text)))) => return Some(serde_json::from_str(&text).unwrap()),
            Ok(Some(Ok(_))) => continue, // ping·pong 프레임 같은 것은 건너뛴다
            _ => return None,
        }
    }
}

/// 조건에 맞는 메시지가 올 때까지 기다린다(최대 5초). 스냅샷이 계속 오므로 사이 메시지는 버린다.
async fn recv_until(ws: &mut Ws, wanted: impl Fn(&ServerMsg) -> bool) -> ServerMsg {
    let wait = async {
        loop {
            let msg = recv(ws)
                .await
                .expect("연결이 끊기기 전에 메시지가 와야 해요");
            if wanted(&msg) {
                return msg;
            }
        }
    };
    timeout(Duration::from_secs(5), wait)
        .await
        .expect("5초 안에 원하는 메시지가 와야 해요")
}

/// 플레이어로 접속해서 join을 보내고 welcome을 받는다.
async fn join(addr: SocketAddr, code: &str, name: &str) -> (Ws, u32) {
    let mut ws = connect(addr, code, "player").await;
    send(
        &mut ws,
        &ClientMsg::Join {
            name: name.to_string(),
        },
    )
    .await;
    match recv(&mut ws).await {
        Some(ServerMsg::Welcome { id, room, protocol }) => {
            assert_eq!(room, code);
            assert_eq!(protocol, PROTOCOL_VERSION);
            (ws, id)
        }
        other => panic!("welcome이 와야 해요: {other:?}"),
    }
}

async fn room_info(addr: SocketAddr, code: &str) -> serde_json::Value {
    reqwest::get(format!("http://{addr}/api/rooms/{code}"))
        .await
        .unwrap()
        .json()
        .await
        .unwrap()
}

/// 0.8초 동안 온 오류를 센다: (rate_limited 개수, bad_message 개수)
async fn count_errors(ws: &mut Ws) -> (usize, usize) {
    let mut rate_limited = 0;
    let mut bad_message = 0;
    let collect = async {
        while let Some(msg) = recv(ws).await {
            match msg {
                ServerMsg::Error {
                    code: ErrorCode::RateLimited,
                    ..
                } => rate_limited += 1,
                ServerMsg::Error {
                    code: ErrorCode::BadMessage,
                    ..
                } => bad_message += 1,
                ServerMsg::Error { code, message } => panic!("다른 오류: {code:?} {message}"),
                _ => {}
            }
        }
    };
    let _ = timeout(Duration::from_millis(800), collect).await;
    (rate_limited, bad_message)
}

fn is_snapshot_with(players: usize) -> impl Fn(&ServerMsg) -> bool {
    move |msg| matches!(msg, ServerMsg::Snapshot(s) if s.players.len() == players)
}

// ---------- 테스트 ----------

#[tokio::test]
async fn create_room_join_two_players_receive_snapshots() {
    let addr = start_server().await;
    let code = create_room(addr).await;
    assert_eq!(code.len(), 4);
    assert!(code.chars().all(|c| c.is_ascii_uppercase()), "{code}");

    let (mut a, id_a) = join(addr, &code, "철수").await;
    let (mut b, id_b) = join(addr, &code, "영희").await;
    assert_ne!(id_a, id_b);

    for ws in [&mut a, &mut b] {
        let ServerMsg::Snapshot(snapshot) = recv_until(ws, is_snapshot_with(2)).await else {
            unreachable!()
        };
        let mut names: Vec<_> = snapshot.players.iter().map(|p| p.name.as_str()).collect();
        names.sort();
        assert_eq!(names, ["영희", "철수"]);
        assert_eq!(snapshot.phase, Phase::Waiting);
    }

    // HTTP로 본 방 상태도 같다
    let info: serde_json::Value = reqwest::get(format!("http://{addr}/api/rooms/{code}"))
        .await
        .unwrap()
        .json()
        .await
        .unwrap();
    assert_eq!(
        info,
        serde_json::json!({ "code": code, "players": 2, "phase": "waiting" })
    );

    // 입력을 보내면 서버에서 실제로 움직인다(오른쪽으로 속도가 생긴다)
    send(
        &mut a,
        &ClientMsg::Input {
            seq: 1,
            dx: 1.0,
            dy: 0.0,
        },
    )
    .await;
    recv_until(&mut b, |msg| match msg {
        ServerMsg::Snapshot(s) => s.players.iter().any(|p| p.id == id_a && p.vx > 50.0),
        _ => false,
    })
    .await;

    // 한 명이 나가면 스냅샷에서 빠진다
    a.close(None).await.unwrap();
    recv_until(&mut b, is_snapshot_with(1)).await;
}

#[tokio::test]
async fn oversized_message_closes_or_errors() {
    let addr = start_server().await;
    let code = create_room(addr).await;
    let (mut ws, _id) = join(addr, &code, "큰손").await;

    let big = format!(r#"{{"t":"ping","ts":1,"pad":"{}"}}"#, "x".repeat(2000));
    assert!(big.len() > 1024);
    ws.send(Message::text(big)).await.unwrap();

    // 서버는 error를 보내거나 연결을 닫아야 한다. 스냅샷만 계속 오면 실패다.
    let outcome = timeout(Duration::from_secs(3), async {
        loop {
            match ws.next().await {
                Some(Ok(Message::Text(text))) => {
                    if let Ok(ServerMsg::Error { .. }) = serde_json::from_str(&text) {
                        return "error";
                    }
                }
                Some(Ok(Message::Close(_))) | Some(Err(_)) | None => return "closed",
                Some(Ok(_)) => {}
            }
        }
    })
    .await;
    assert!(outcome.is_ok(), "3초 안에 오류나 연결 종료가 와야 해요");
}

#[tokio::test]
async fn input_flood_is_throttled() {
    let addr = start_server().await;
    let code = create_room(addr).await;
    let (mut ws, _id) = join(addr, &code, "연타왕").await;

    // 한꺼번에 100개 → 1초에 30개를 넘은 것은 버리고, 1초 창마다 한 번만 알려 준다
    for seq in 1..=100 {
        let input = ClientMsg::Input {
            seq,
            dx: 1.0,
            dy: 0.0,
        };
        send(&mut ws, &input).await;
    }

    let (rate_limited, bad_message) = count_errors(&mut ws).await;
    assert_eq!(bad_message, 0);
    // 보내는 데 1초가 넘게 걸리면 창이 두 번 바뀔 수 있어서 1~2번을 허용한다(넘친 70개마다 보내지는 않는다).
    assert!(
        (1..=2).contains(&rate_limited),
        "rate_limited 오류 {rate_limited}번"
    );

    // 연결은 그대로 살아 있다
    recv_until(&mut ws, |msg| matches!(msg, ServerMsg::Snapshot(_))).await;
}

#[tokio::test]
async fn binary_frames_count_toward_the_rate_limit() {
    let addr = start_server().await;
    let code = create_room(addr).await;
    let (mut ws, _id) = join(addr, &code, "바이너리").await;

    // 바이너리 프레임도 빈도 제한에 들어간다(제한을 피해 오류 답장만 잔뜩 받아 내지 못하게).
    for _ in 0..100 {
        ws.send(Message::binary(vec![1, 2, 3])).await.unwrap();
    }

    let (rate_limited, bad_message) = count_errors(&mut ws).await;
    assert!(rate_limited >= 1, "rate_limited가 와야 해요");
    assert!(
        bad_message <= 2 * MAX_INPUTS_PER_SEC as usize,
        "bad_message 답장 {bad_message}개: 제한 안쪽의 메시지에만 답해야 해요"
    );
}

#[tokio::test]
async fn silent_client_is_removed_but_pinging_client_stays() {
    // 테스트가 오래 걸리지 않게 무응답 제한을 0.5초로 줄인 서버
    let addr = start_server_with_idle(Duration::from_millis(500)).await;
    let code = create_room(addr).await;
    let (mut silent, _) = join(addr, &code, "잠수").await;
    let (mut talker, _) = join(addr, &code, "수다").await;

    // talker는 0.15초마다 ping(심장 박동)을 보내고, silent는 아무것도 보내지 않는다
    for i in 0..8 {
        send(&mut talker, &ClientMsg::Ping { ts: f64::from(i) }).await;
        sleep(Duration::from_millis(150)).await;
    }

    let info = room_info(addr, &code).await;
    assert_eq!(
        info["players"], 1,
        "말없는 플레이어는 빠지고 ping을 보낸 플레이어는 남는다"
    );

    // 서버가 silent의 연결을 닫았다(남은 메시지를 다 읽으면 스트림이 끝난다)
    let drained = timeout(Duration::from_secs(2), async {
        while let Some(Ok(_)) = silent.next().await {}
    })
    .await;
    assert!(drained.is_ok(), "서버가 연결을 닫아야 해요");
}

#[tokio::test]
async fn duplicate_nickname_in_room_is_rejected() {
    let addr = start_server().await;
    let code = create_room(addr).await;
    let (_first, _) = join(addr, &code, "철수").await;

    let mut second = connect(addr, &code, "player").await;
    send(
        &mut second,
        &ClientMsg::Join {
            name: "철수".to_string(),
        },
    )
    .await;
    match recv(&mut second).await {
        Some(ServerMsg::Error {
            code: ErrorCode::NameTaken,
            ..
        }) => {}
        other => panic!("name_taken 오류가 와야 해요: {other:?}"),
    }
    assert!(recv(&mut second).await.is_none(), "그다음 연결이 닫힌다");
    assert_eq!(room_info(addr, &code).await["players"], 1);
}

#[tokio::test]
async fn host_role_receives_snapshots_without_player() {
    let addr = start_server().await;
    let code = create_room(addr).await;
    let mut host = connect(addr, &code, "host").await;

    match recv(&mut host).await {
        Some(ServerMsg::Welcome { id: 0, room, .. }) => assert_eq!(room, code),
        other => panic!("관전 화면은 id 0으로 welcome을 받아요: {other:?}"),
    }
    let ServerMsg::Snapshot(snapshot) =
        recv_until(&mut host, |m| matches!(m, ServerMsg::Snapshot(_))).await
    else {
        unreachable!()
    };
    assert!(snapshot.players.is_empty());
    assert_eq!(snapshot.phase, Phase::Waiting);

    send(&mut host, &ClientMsg::Ping { ts: 1.5 }).await;
    recv_until(
        &mut host,
        |m| matches!(m, ServerMsg::Pong { ts } if *ts == 1.5),
    )
    .await;
}

#[tokio::test]
async fn bad_name_and_unknown_room_are_rejected() {
    let addr = start_server().await;
    let code = create_room(addr).await;

    let mut ws = connect(addr, &code, "player").await;
    send(
        &mut ws,
        &ClientMsg::Join {
            name: "ADMIN".to_string(),
        },
    )
    .await;
    match recv(&mut ws).await {
        Some(ServerMsg::Error {
            code: ErrorCode::BadName,
            ..
        }) => {}
        other => panic!("bad_name 오류가 와야 해요: {other:?}"),
    }
    assert!(recv(&mut ws).await.is_none(), "그다음 연결이 닫힌다");

    let unknown = connect_async(format!("ws://{addr}/ws/ZZZZ?role=player")).await;
    assert!(unknown.is_err(), "없는 방은 업그레이드 전에 404");
}

#[tokio::test]
async fn http_routes_without_database() {
    let addr = start_server().await;

    let health = reqwest::get(format!("http://{addr}/healthz"))
        .await
        .unwrap();
    assert_eq!(health.status(), 200);
    assert_eq!(health.text().await.unwrap(), "ok");

    let missing = reqwest::get(format!("http://{addr}/api/rooms/ZZZZ"))
        .await
        .unwrap();
    assert_eq!(missing.status(), 404);
    let body: serde_json::Value = missing.json().await.unwrap();
    assert_eq!(body["code"], "room_not_found");

    let board: serde_json::Value =
        reqwest::get(format!("http://{addr}/api/leaderboard?period=day"))
            .await
            .unwrap()
            .json()
            .await
            .unwrap();
    assert_eq!(
        board,
        serde_json::json!({ "enabled": false, "period": "day", "entries": [] })
    );
}
