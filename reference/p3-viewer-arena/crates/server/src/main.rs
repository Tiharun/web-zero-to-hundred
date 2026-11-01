//! 서버 실행 파일: 설정 읽기 → (있으면) DB 연결 → 라우터 → 듣기 → 종료 신호까지 실행.
//! 실행: cargo run -p server   (릴리스: cargo run -p server --release)

use std::net::{IpAddr, SocketAddr, UdpSocket};

use server::app::{AppState, router};
use server::config::Config;
use server::db;
use tokio::net::TcpListener;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    // .env 파일이 있으면 그 값을 환경 변수로 읽는다(없어도 괜찮다).
    dotenvy::dotenv().ok();

    // 로그: RUST_LOG로 자세함을 바꾼다. 기본은 info. 예) PowerShell: $env:RUST_LOG="debug"
    let filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    tracing_subscriber::fmt().with_env_filter(filter).init();

    // 실제 일은 run이 하고, main은 오류를 사람이 읽기 좋게 보여 준 뒤 종료 코드 1로 끝낸다.
    if let Err(message) = run().await {
        tracing::error!("{message}");
        std::process::exit(1);
    }
}

async fn run() -> Result<(), String> {
    let config = Config::from_env()?;

    let db = match &config.database_url {
        Some(url) => {
            // 주소에는 비밀번호가 들어 있으니 로그에 그대로 찍지 않는다.
            let pool = db::connect(url).await.map_err(|e| {
                format!("PostgreSQL에 연결하지 못했어요({e}). DB가 켜져 있는지, DATABASE_URL이 맞는지 확인하세요.")
            })?;
            tracing::info!("PostgreSQL에 연결했어요. 랭킹이 켜졌어요.");
            Some(pool)
        }
        None => {
            tracing::warn!("DATABASE_URL이 없어서 랭킹을 꺼요. 게임은 그대로 할 수 있어요.");
            None
        }
    };

    if !config.static_dir.join("index.html").exists() {
        tracing::warn!(
            "{}에 index.html이 없어요. client 폴더에서 npm run build를 먼저 실행하세요.",
            config.static_dir.display()
        );
    }

    let app = router(AppState::new(db), &config.static_dir);
    let addr = SocketAddr::new(config.host, config.port);
    let listener = TcpListener::bind(addr).await.map_err(|e| {
        format!("{addr}에서 연결을 기다리지 못했어요({e}). 다른 프로그램이 이 포트를 쓰고 있으면 PORT를 바꿔 보세요.")
    })?;
    tracing::info!("서버 시작: http://{addr}");
    if config.host.is_unspecified() {
        if let Some(ip) = lan_ip() {
            tracing::info!("같은 Wi-Fi의 휴대폰에서는: http://{ip}:{}", config.port);
        }
    } else if config.host.is_loopback() {
        tracing::info!("지금은 이 PC에서만 접속돼요. 휴대폰으로 참가하려면 HOST=0.0.0.0");
    }

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .map_err(|e| format!("서버 오류: {e}"))?;
    tracing::info!("서버를 종료했어요.");
    Ok(())
}

/// Ctrl+C(Windows·macOS·Linux) 또는 SIGTERM(`docker stop`)이 올 때까지 기다린다.
async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("Ctrl+C 처리기를 설치하지 못했어요");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("SIGTERM 처리기를 설치하지 못했어요")
            .recv()
            .await;
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>(); // Windows에는 SIGTERM이 없다

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    tracing::info!("종료 신호를 받았어요.");
}

/// 이 PC의 LAN 주소(예: 192.168.0.10)를 알아낸다.
/// UDP 소켓의 connect는 패킷을 보내지 않고 "어느 랜카드로 나갈지"만 정한다.
fn lan_ip() -> Option<IpAddr> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    Some(socket.local_addr().ok()?.ip())
}
