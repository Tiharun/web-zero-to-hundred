// ==========================================================
// contents.js - 영상 목록 페이지
// data/videos.json을 불러와서(fetch) 카드로 그리고,
// 카테고리 버튼과 검색창으로 걸러서 보여 줘요.
// ==========================================================

// 카테고리 코드 → 화면에 보여 줄 이름, 썸네일 그림 (Day 19: 객체)
const categoryNames = { game: '게임', talk: '토크', music: '음악' };
const thumbnails = {
  game: 'images/thumb-game.svg',
  talk: 'images/thumb-talk.svg',
  music: 'images/thumb-music.svg',
};

// 화면의 요소들을 미리 찾아 둬요 (Day 20)
const listElement = document.querySelector('#video-list');
const filterBox = document.querySelector('#category-filters');
const searchInput = document.querySelector('#search');
const countElement = document.querySelector('#result-count');
const emptyMessage = document.querySelector('#empty-message');
const loadStatus = document.querySelector('#load-status');
const loadError = document.querySelector('#load-error');

// 지금 상태: 전체 영상, 선택한 카테고리, 검색어
let allVideos = [];
let selectedCategory = 'all';
let searchText = '';

// 태그 하나를 만들고 클래스와 글자를 넣어 주는 도우미 함수 (Day 18)
function createElementWithText(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text; // textContent는 글자 그대로 넣어서 안전해요
  return element;
}

// 영상 데이터 하나로 카드 하나를 만들어요 (Day 20)
function createCard(video) {
  const card = document.createElement('article');
  card.className = 'card';

  const image = document.createElement('img');
  image.src = thumbnails[video.category];
  image.alt = categoryNames[video.category] + ' 영상 썸네일';
  image.width = 320;
  image.height = 180;
  image.loading = 'lazy';

  const body = document.createElement('div');
  body.className = 'card-body';

  const badge = createElementWithText('span', 'badge', categoryNames[video.category]);

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = 'https://www.youtube.com/watch?v=' + video.youtubeId;
  link.target = '_blank'; // 새 탭에서 열어요
  link.rel = 'noopener noreferrer';
  link.textContent = video.title;
  title.appendChild(link);

  const date = document.createElement('time');
  date.dateTime = video.date;
  date.textContent = video.date;

  body.appendChild(badge);
  body.appendChild(title);
  body.appendChild(date);
  card.appendChild(image);
  card.appendChild(body);
  return card;
}

// 카테고리와 검색어에 맞는 영상만 골라요 (Day 19: filter)
function getVisibleVideos() {
  return allVideos.filter(function (video) {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });
}

// 화면을 다시 그려요: 목록을 비우고 → 카드를 하나씩 붙이고 → 개수를 알려 줘요
function render() {
  const videos = getVisibleVideos();

  listElement.textContent = ''; // 안의 내용을 모두 비워요
  videos.forEach(function (video) {
    listElement.appendChild(createCard(video));
  });

  countElement.textContent = '영상 ' + videos.length + '개';
  emptyMessage.hidden = videos.length > 0;
}

// 카테고리 버튼: 버튼 4개가 아니라 감싸는 상자에만 이벤트를 달아요 (이벤트 위임, Day 21)
filterBox.addEventListener('click', function (event) {
  const button = event.target.closest('button'); // 클릭한 곳에서 가장 가까운 button
  if (!button) {
    return;
  }

  selectedCategory = button.dataset.category; // data-category 값 (all, game, talk, music)

  // 눌린 버튼만 aria-pressed="true"로 표시해요
  filterBox.querySelectorAll('button').forEach(function (item) {
    item.setAttribute('aria-pressed', String(item === button));
  });

  render();
});

// 검색창: 글자를 입력할 때마다 바로 걸러요 (Day 23)
searchInput.addEventListener('input', function () {
  searchText = searchInput.value.trim().toLowerCase();
  render();
});

// data/videos.json 불러오기 (Day 25: async/await, 오류 처리)
async function loadVideos() {
  try {
    const response = await fetch('data/videos.json');
    if (!response.ok) {
      throw new Error('서버 응답 코드: ' + response.status); // 404 같은 오류도 실패로 다뤄요
    }
    allVideos = await response.json(); // JSON 글자를 배열로 바꿔요
    loadStatus.hidden = true;
    render();
  } catch (error) {
    // file://로 열었거나 파일 경로가 틀리면 여기로 와요
    console.error('videos.json을 불러오지 못했어요:', error);
    loadStatus.hidden = true;
    loadError.hidden = false;
    loadError.textContent =
      '영상 목록을 불러오지 못했어요. 파일을 더블클릭해서 열었다면 VS Code의 Live Preview나 GitHub Pages 주소로 열어 보세요.';
  }
}

loadVideos();
