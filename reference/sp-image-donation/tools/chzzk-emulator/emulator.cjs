// 치지직 세션 소켓 에뮬레이터 (조사 문서 부록 C.2 기반, socket.io@2.5.0 = EIO=3)
// 실행: node emulator.cjs [포트]   (포트를 0으로 주면 빈 포트를 고른다)
// 연결되면 SYSTEM(connected)을 보내고, 0.5초·0.8초 뒤 DONATION을 두 번 보낸다.
//  - 첫 번째: 페이로드가 JSON "문자열", payAmount도 문자열
//  - 두 번째: 페이로드가 "객체", payAmount는 숫자
// 실제 치지직이 어느 형태로 보내는지는 확인하지 못했으므로, 수신기가 두 형태를 모두 처리하는지 검사한다.
const http = require('http');
const socketIo = require('socket.io');

const port = Number(process.argv[2] ?? 5099);
const message = process.argv[3] ?? '안녕 #TEST';

const server = http.createServer();
const io = socketIo(server, { transports: ['websocket', 'polling'] });

io.on('connection', (socket) => {
  // 받은 auth 값과 프로토콜 버전을 출력한다 (테스트가 이 줄을 읽는다)
  console.log(`CONNECTED auth=${socket.handshake.query.auth} EIO=${socket.handshake.query.EIO}`);
  socket.emit('SYSTEM', JSON.stringify({ type: 'connected', data: { sessionKey: 'sess-123' } }));

  const donation = {
    donationType: 'CHAT',
    channelId: 'c1',
    donatorChannelId: 'd1',
    donatorNickname: '테스터',
    payAmount: '1000',
    donationText: message,
    emojis: {},
  };
  setTimeout(() => socket.emit('DONATION', JSON.stringify(donation)), 500);
  setTimeout(() => socket.emit('DONATION', { ...donation, payAmount: 2500 }), 800);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`LISTENING ${server.address().port}`);
});
