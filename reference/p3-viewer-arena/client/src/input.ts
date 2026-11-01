// 입력: 키보드(WASD·방향키)와 화면 조이스틱(터치·마우스)을 같은 모양 { dx, dy }로 만들어요.
// 각 함수는 "지금 방향을 읽는 함수"를 돌려줘요. 게임 루프가 필요할 때마다 불러요.

export interface Direction {
  dx: number;
  dy: number;
}

export const STILL: Direction = { dx: 0, dy: 0 };

/** 길이가 1보다 길면 1로 줄여요(대각선이 더 빨라지지 않게). 서버도 같은 검사를 해요. */
export function clampLength(dir: Direction): Direction {
  const length = Math.hypot(dir.dx, dir.dy);
  return length > 1 ? { dx: dir.dx / length, dy: dir.dy / length } : dir;
}

/** 소수 둘째 자리까지만(메시지가 짧아지고, 아주 작은 흔들림은 무시돼요) */
export function round2(dir: Direction): Direction {
  return { dx: Math.round(dir.dx * 100) / 100, dy: Math.round(dir.dy * 100) / 100 };
}

export function keyboard(target: Window = window): () => Direction {
  const down = new Set<string>();
  target.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement) return; // 닉네임을 쓰는 중이면 조작키로 보지 않아요
    if (event.code.startsWith('Arrow')) event.preventDefault(); // 방향키로 페이지가 스크롤되지 않게
    down.add(event.code);
  });
  target.addEventListener('keyup', (event) => down.delete(event.code));
  target.addEventListener('blur', () => down.clear()); // 창을 벗어나면 눌린 키를 잊어요

  const pressed = (...codes: string[]) => (codes.some((code) => down.has(code)) ? 1 : 0);
  return () =>
    clampLength({
      dx: pressed('ArrowRight', 'KeyD') - pressed('ArrowLeft', 'KeyA'),
      dy: pressed('ArrowDown', 'KeyS') - pressed('ArrowUp', 'KeyW'),
    });
}

/**
 * 가상 조이스틱: 받침(base)을 누른 채 끌면, 가운데에서 끈 만큼 방향과 세기가 정해져요.
 * Pointer Events 하나로 터치·마우스·펜을 모두 받아요.
 */
export function joystick(base: HTMLElement, knob: HTMLElement): () => Direction {
  let current = STILL;
  let activePointer: number | null = null;

  function update(event: PointerEvent): void {
    const rect = base.getBoundingClientRect();
    const radius = rect.width / 2;
    current = clampLength({
      dx: (event.clientX - (rect.left + radius)) / radius,
      dy: (event.clientY - (rect.top + rect.height / 2)) / radius,
    });
    knob.style.transform = `translate(${current.dx * radius * 0.5}px, ${current.dy * radius * 0.5}px)`;
  }

  function release(event: PointerEvent): void {
    if (event.pointerId !== activePointer) return;
    activePointer = null;
    current = STILL;
    knob.style.transform = '';
  }

  base.addEventListener('pointerdown', (event) => {
    activePointer = event.pointerId;
    base.setPointerCapture(event.pointerId); // 손가락이 받침 밖으로 나가도 계속 받아요
    update(event);
  });
  base.addEventListener('pointermove', (event) => {
    if (event.pointerId === activePointer) update(event);
  });
  base.addEventListener('pointerup', release);
  base.addEventListener('pointercancel', release);

  return () => current;
}

/** 여러 입력 중 움직이고 있는 첫 번째 것을 써요. */
export function firstActive(...sources: Array<() => Direction>): () => Direction {
  return () => {
    for (const read of sources) {
      const dir = read();
      if (dir.dx !== 0 || dir.dy !== 0) return dir;
    }
    return STILL;
  };
}
