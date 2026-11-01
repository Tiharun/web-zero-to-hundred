// 치지직 세션 소켓 에뮬레이터 (조사 문서 부록 C.2 기반, socket.io@2.5.0 = EIO=3). 실제 치지직이 아니다.
// 실행: node emulator.cjs [포트] [상황]   (포트를 0으로 주면 빈 포트를 고른다)
// 연결되면 SYSTEM(connected)을 보낸 뒤, 상황에 따라:
//   donations (기본) 0.5초·0.8초 뒤 DONATION 두 번. 첫 번째는 JSON "문자열"+payAmount 문자열, 두 번째는 "객체"+숫자
//   revoked          0.3초 뒤 SYSTEM(revoked): 권한 회수
//   kick             0.3초 뒤 서버가 연결을 끊는다
//   malformed        깨진 JSON, int 범위를 넘는 금액, 그리고 정상 DONATION 하나
// 실제 치지직이 어느 형태로 보내는지는 확인하지 못했으므로, 수신기가 여러 형태를 모두 견디는지 검사한다.
const http = require('http');
const socketIo = require('socket.io');

const port = Number(process.argv[2] ?? 5099);
const scenario = process.argv[3] ?? 'donations';

const server = http.createServer();
const io = socketIo(server, { transports: ['websocket', 'polling'] });

const donation = {
  donationType: 'CHAT',
  channelId: 'c1',
  donatorChannelId: 'd1',
  donatorNickname: '테스터',
  payAmount: '1000',
  donationText: '안녕 #TEST',
  emojis: {},
};

io.on('connection', (socket) => {
  // 받은 auth 값과 프로토콜 버전을 출력한다 (테스트가 이 줄을 읽는다)
  console.log(`CONNECTED auth=${socket.handshake.query.auth} EIO=${socket.handshake.query.EIO}`);
  socket.on('disconnect', (reason) => console.log(`DISCONNECTED ${reason}`));
  socket.emit('SYSTEM', JSON.stringify({ type: 'connected', data: { sessionKey: 'sess-123' } }));

  if (scenario === 'donations') {
    setTimeout(() => socket.emit('DONATION', JSON.stringify(donation)), 500);
    setTimeout(() => socket.emit('DONATION', { ...donation, payAmount: 2500 }), 800);
  } else if (scenario === 'revoked') {
    setTimeout(() => socket.emit('SYSTEM', JSON.stringify({ type: 'revoked', data: { eventType: 'DONATION', channelId: 'c1' } })), 300);
  } else if (scenario === 'kick') {
    setTimeout(() => socket.disconnect(true), 300);
  } else if (scenario === 'malformed') {
    setTimeout(() => socket.emit('DONATION', '{이건 JSON이 아니다'), 300);
    setTimeout(() => socket.emit('DONATION', { ...donation, payAmount: '99999999999' }), 400);
    setTimeout(() => socket.emit('DONATION', JSON.stringify({ ...donation, payAmount: '3000' })), 500);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`LISTENING ${server.address().port}`);
});
