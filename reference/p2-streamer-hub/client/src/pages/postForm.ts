// 글쓰기 (#/board/new)와 글 고치기 (#/board/7/edit)를 함께 맡는 화면 (Day 31)
import * as api from '../api.ts';
import { getCurrentUser } from '../auth.ts';
import type { Params } from '../router.ts';
import { errorMessage, setStatus } from '../ui.ts';

export async function renderPostForm(view: HTMLElement, params: Params): Promise<void> {
  // 주소에 :id가 있으면(#/board/7/edit) 고치기, 없으면(#/board/new) 새 글
  const isEdit = 'id' in params;
  const id = Number(params.id);

  if (getCurrentUser() === null) {
    view.innerHTML = '<h1>글쓰기</h1><p>글을 쓰려면 먼저 <a href="#/login">로그인</a>해 주세요.</p>';
    return;
  }

  view.innerHTML = `
    <h1 id="form-heading">글쓰기</h1>
    <form class="form" id="post-form">
      <label for="post-title">제목</label>
      <input id="post-title" required maxlength="100">
      <label for="post-body">내용</label>
      <textarea id="post-body" required maxlength="5000" rows="10"></textarea>
      <p class="actions">
        <button type="submit" class="button">올리기</button>
        <a class="button secondary" id="cancel-link" href="#/board">취소</a>
      </p>
      <p class="status" role="status"></p>
    </form>
  `;
  const form = view.querySelector<HTMLFormElement>('#post-form')!;
  const titleInput = view.querySelector<HTMLInputElement>('#post-title')!;
  const bodyInput = view.querySelector<HTMLTextAreaElement>('#post-body')!;
  const submitButton = form.querySelector('button')!;
  const status = form.querySelector<HTMLElement>('.status')!;

  if (isEdit) {
    view.querySelector('#form-heading')!.textContent = '글 고치기';
    submitButton.textContent = '고친 글 저장';
    view.querySelector<HTMLAnchorElement>('#cancel-link')!.href = `#/board/${id}`;
    try {
      const post = await api.getPost(id);
      if (!post.canEdit) {
        setStatus(status, '내가 쓴 글만 고칠 수 있어요.', true);
        submitButton.disabled = true;
        return;
      }
      titleInput.value = post.title; // 입력칸에는 value로 넣어요 (HTML로 해석되지 않아요)
      bodyInput.value = post.body;
    } catch (error) {
      setStatus(status, errorMessage(error), true);
      submitButton.disabled = true;
      return;
    }
  }

  // required·maxlength는 브라우저가 먼저 검사해요. 서버도 같은 규칙으로 한 번 더 검사해요
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // 페이지가 새로 고쳐지지 않게
    const input = { title: titleInput.value.trim(), body: bodyInput.value };

    submitButton.disabled = true; // 두 번 눌러도 한 번만 보내요
    setStatus(status, '저장하는 중...');
    try {
      if (isEdit) {
        await api.updatePost(id, input);
        location.hash = `#/board/${id}`;
      } else {
        const created = await api.createPost(input);
        location.hash = `#/board/${created.id}`;
      }
    } catch (error) {
      setStatus(status, errorMessage(error), true);
      submitButton.disabled = false;
    }
  });
}
