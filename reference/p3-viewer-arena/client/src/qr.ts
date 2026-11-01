// QR 코드: 휴대폰 카메라로 찍으면 참가 주소(play.html?room=ABCD)가 열려요.
// qrcode-generator 라이브러리가 "어느 칸이 검은색인지"를 계산하고, 그리기는 Canvas 2D로 직접 해요.

import qrcode from 'qrcode-generator';

const QUIET_ZONE = 4; // QR 둘레의 흰 여백(칸 수). 표준이 4칸을 권해요.

export function drawQr(canvas: HTMLCanvasElement, text: string, size: number): void {
  const qr = qrcode(0, 'M'); // 0 = 크기 자동, 'M' = 약 15%가 가려져도 읽혀요
  qr.addData(text);
  qr.make();

  const count = qr.getModuleCount(); // 한 변의 칸 수(예: 29)
  const cells = count + QUIET_ZONE * 2;
  const cell = Math.max(1, Math.floor(size / cells)); // 칸 하나의 픽셀 크기(정수여야 선명해요)
  canvas.width = cells * cell;
  canvas.height = cells * cell;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#ffffff'; // 투명 배경 위에서도 읽히도록 흰 바탕을 먼저 칠해요
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000000';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect((col + QUIET_ZONE) * cell, (row + QUIET_ZONE) * cell, cell, cell);
      }
    }
  }
}
