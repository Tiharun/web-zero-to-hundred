// 팬 게시판 목록 (#/board, #/board?page=2) (Day 31)
import * as api from '../api.ts';
import { getCurrentUser } from '../auth.ts';
import type { Params } from '../router.ts';
import type { PostListItem } from '../types.ts';
import { createElementWithText, createLink, errorMessage, formatKstDate, setStatus } from '../ui.ts';

export async function renderBoard(view: HTMLElement, _params: Params, query: URLSearchParams): Promise<void> {
  // ?page= 값이 없거나 이상하면 1쪽
  let page = Number(query.get('page') ?? '1');
  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  view.innerHTML = `
    <div class="page-head">
      <h1>팬 게시판</h1>
      <a class="button" id="write-link" href="#/board/new">글쓰기</a>
    </div>
    <p class="status" role="status">불러오는 중...</p>
    <ul class="item-list post-list" id="post-list"></ul>
    <nav class="pagination" aria-label="페이지 이동">
      <a class="button secondary" id="prev-page" hidden>← 이전</a>
      <span id="page-label"></span>
      <a class="button secondary" id="next-page" hidden>다음 →</a>
    </nav>
  `;
  const status = view.querySelector<HTMLElement>('.status')!;
  const list = view.querySelector<HTMLUListElement>('#post-list')!;

  // 로그인하지 않았으면 글쓰기 대신 로그인으로 보내요
  if (getCurrentUser() === null) {
    const writeLink = view.querySelector<HTMLAnchorElement>('#write-link')!;
    writeLink.href = '#/login';
    writeLink.textContent = '로그인하고 글쓰기';
  }

  try {
    const result = await api.getPosts(page);
    list.append(...result.items.map(createPostRow));

    const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
    const prev = view.querySelector<HTMLAnchorElement>('#prev-page')!;
    const next = view.querySelector<HTMLAnchorElement>('#next-page')!;
    if (page > 1) {
      prev.href = `#/board?page=${page - 1}`;
      prev.hidden = false;
    }
    if (page < totalPages) {
      next.href = `#/board?page=${page + 1}`;
      next.hidden = false;
    }
    view.querySelector('#page-label')!.textContent = `${page} / ${totalPages}쪽`;

    setStatus(status, result.total === 0 ? '아직 글이 없어요. 첫 글을 써 보세요!' : `글 ${result.total}개`);
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}

function createPostRow(post: PostListItem): HTMLLIElement {
  const row = document.createElement('li');
  row.append(
    createLink(`#/board/${post.id}`, post.title, 'post-title'),
    createElementWithText('span', 'muted', `${post.authorName} · ${formatKstDate(post.createdAt)}`),
  );
  return row;
}
