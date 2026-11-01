// 글 상세 (#/board/7): 본문 + (작성자·관리자에게만) 수정·삭제 버튼 (Day 31)
import * as api from '../api.ts';
import type { Params } from '../router.ts';
import { errorMessage, formatKstDateTime, setStatus } from '../ui.ts';

export async function renderPostDetail(view: HTMLElement, params: Params): Promise<void> {
  const id = Number(params.id);

  view.innerHTML = `
    <p><a href="#/board">← 목록으로</a></p>
    <p class="status" role="status">불러오는 중...</p>
    <article class="post" hidden>
      <h1 id="post-title"></h1>
      <p class="muted" id="post-meta"></p>
      <div class="post-body" id="post-body"></div>
      <p class="actions" id="post-actions" hidden>
        <a class="button secondary" id="edit-link">수정</a>
        <button type="button" class="button danger" id="delete-button">삭제</button>
      </p>
    </article>
  `;
  const status = view.querySelector<HTMLElement>('.status')!;

  try {
    const post = await api.getPost(id);

    // 글쓴이가 쓴 제목·본문은 모두 textContent로 넣어요. <script>를 써도 글자로만 보여요 (XSS 방지, Day 34)
    view.querySelector('#post-title')!.textContent = post.title;
    const edited = post.updatedAt === null ? '' : ' (수정됨)';
    view.querySelector('#post-meta')!.textContent =
      `${post.authorName} · ${formatKstDateTime(post.createdAt)}${edited}`;
    view.querySelector('#post-body')!.textContent = post.body; // 줄바꿈은 CSS(white-space: pre-wrap)로 보여요

    // 버튼을 숨기는 건 화면의 친절일 뿐이에요. 남의 글을 고치려 하면 서버가 403으로 막아요
    if (post.canEdit) {
      view.querySelector<HTMLElement>('#post-actions')!.hidden = false;
      view.querySelector<HTMLAnchorElement>('#edit-link')!.href = `#/board/${post.id}/edit`;
      view.querySelector('#delete-button')!.addEventListener('click', async () => {
        if (!confirm('이 글을 지울까요? 지운 글은 되돌릴 수 없어요.')) {
          return;
        }
        try {
          await api.deletePost(post.id);
          location.hash = '#/board';
        } catch (error) {
          setStatus(status, errorMessage(error), true);
        }
      });
    }

    view.querySelector<HTMLElement>('.post')!.hidden = false;
    setStatus(status, '');
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}
