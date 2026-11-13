// 검색 결과 행의 모델(views/results.js): 위치·이유·태그, 잠긴 결과, 빈 검색어의 바로 가기, 문구. DOM 없이 계산만 본다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress } from '../../textbook/src/app/progress.js';
import { emptyText, hintText, resultModel, shortcutModels } from '../../textbook/src/app/views/results.js';

const cur = {
  projects: [
    { id: 'p1', title: '첫 월드', order: 1, track: 'main', days: [{ id: 'p1-d1', num: 1, title: '첫 Day' }, { id: 'p1-d2', num: 2, title: '둘째 Day', ready: false }] },
    { id: 'p2', title: '둘째 월드', order: 2, track: 'main', requires: ['p1'], days: [{ id: 'p2-d1', num: 1, title: '잠긴 Day' }] },
  ],
  pages: [
    { id: 'start', title: '시작하기', meta: '교재 쓰는 법, 공부 원칙, 준비물' },
    { id: 'secret', title: '비밀 페이지', requires: ['p2'] },
  ],
};
const ctx = (completed = []) => ({ cur, prog: { ...emptyProgress(), completed: Object.fromEntries(completed.map((id) => [id, '2026-11-13T00:00:00.000Z'])) } });
const day = (id, project, snippet = '…본문…') => ({ id, kind: 'day', project, title: 'T', snippet });

test('resultModel: a day result has where, tag and the snippet as why', () => {
  assert.deepEqual(resultModel(ctx(), day('p1-d1', 'p1')), {
    id: 'p1-d1', href: '#/day/p1-d1', where: 'P1 Day 1', title: 'T', why: '…본문…', tag: '오늘', locked: false,
  });
});

test('resultModel: a locked day shows only the title and why it is locked', () => {
  const m = resultModel(ctx(), day('p2-d1', 'p2', null));
  assert.equal(m.locked, true);
  assert.equal(m.tag, '잠김');
  assert.equal(m.why, '‘첫 월드’ 프로젝트를 끝내면 열려요.');
  assert.equal(m.where, 'P2 Day 1');
});

test('resultModel: done and draft days are tagged, pages are 부록', () => {
  assert.equal(resultModel(ctx(['p1-d1']), day('p1-d1', 'p1')).tag, '완료');
  assert.equal(resultModel(ctx(['p1-d1']), day('p1-d2', 'p1')).tag, '오늘', '다음 Day 는 준비 중이어도 오늘이다(사이드바와 같은 순서)');
  assert.equal(resultModel(ctx(), day('p1-d2', 'p1')).tag, '준비 중');
  const page = resultModel(ctx(), { id: 'start', kind: 'page', project: null, title: '시작하기', snippet: '…' });
  assert.deepEqual([page.where, page.tag, page.href, page.locked], ['부록', '', '#/page/start', false]);
  const secret = resultModel(ctx(), { id: 'secret', kind: 'page', project: null, title: '비밀 페이지', snippet: null });
  assert.deepEqual([secret.tag, secret.why, secret.locked], ['잠김', '‘둘째 월드’ 프로젝트를 끝내면 열려요.', true]);
});

test('shortcutModels: today first, then every page; none for today when all done', () => {
  const first = shortcutModels(ctx());
  assert.deepEqual(first.map((m) => m.id), ['p1-d1', 'start', 'secret']);
  assert.deepEqual(first.map((m) => m.why), ['오늘의 퀘스트', '교재 쓰는 법, 공부 원칙, 준비물', '‘둘째 월드’ 프로젝트를 끝내면 열려요.']);
  assert.deepEqual(first.map((m) => m.tag), ['오늘', '', '잠김']);
  const done = shortcutModels(ctx(['p1-d1', 'p1-d2', 'p2-d1']));
  assert.deepEqual(done.map((m) => m.id), ['start', 'secret']);
  assert.equal(done[1].locked, false);
  assert.equal(done[1].why, '');
});

test('hintText and emptyText', () => {
  assert.equal(hintText('', 0), '바로 가기');
  assert.equal(hintText('  ', 0), '바로 가기');
  assert.equal(hintText('a', 3), '찾은 곳 3개');
  assert.equal(hintText('a', 0), '');
  assert.equal(emptyText(' zz '), '‘zz’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.');
});
