import { artworks, moderatorWishes, wishes } from "./content.js";

const app = document.querySelector("#app");
let page = 0,
  modPage = 0,
  art = 0,
  current = "home";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character],
  );
}

function title(text) {
  return `<div class="app-title"><button data-app="home" aria-label="Về trang chủ">‹</button><b>${text}</b><span>✦</span></div>`;
}

function drawWish(wish, index, list, stepAttribute, titleText, description) {
  return (
    `<div class="wish-view">${title(titleText)}<article class="letter wish-letter" tabindex="0" aria-label="Nội dung lời chúc"><span class="number">${String(index + 1).padStart(2, "0")} / ${list.length} · ${escapeHtml(titleText.toUpperCase())}</span><h2>Gửi anh Híu,</h2><p>${escapeHtml(wish.text)}</p><span class="wish-from">Thân mến, <strong>${escapeHtml(wish.from)}</strong> ♡</span></article><div class="pager"><button ${stepAttribute}="-1" aria-label="Lời chúc trước">←</button><span>${index + 1} / ${list.length}</span><button ${stepAttribute}="1" aria-label="Lời chúc tiếp">→</button></div><div class="demo">${description} · Cuộn trong khung để đọc hết</div></div>`
  );
}

function nextBirthday(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const local = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const year = Number(local.year);
  const month = Number(local.month);
  const day = Number(local.day);
  const isBirthday = month === 10 && day === 28;
  const birthdayYear = isBirthday || month < 10 || (month === 10 && day < 28)
    ? year
    : year + 1;
  return {
    age: birthdayYear - 1999,
    isBirthday,
    timestamp: Date.UTC(birthdayYear, 9, 28) - 7 * 60 * 60 * 1000,
  };
}

function vietnamTime(now) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

function updateTime() {
  const now = new Date();
  const time = vietnamTime(now);
  document.querySelector("#status-time").textContent = time;
  document.querySelector("#cover-clock").textContent = time;
  const homeClock = document.querySelector("#home-clock");
  if (homeClock) homeClock.textContent = time;

  const birthday = nextBirthday(now);
  const age = document.querySelector("#birthday-age");
  if (age) age.textContent = String(birthday.age);
  const countdown = document.querySelector("#birthday-countdown");
  if (!countdown) return;
  if (birthday.isBirthday) {
    countdown.textContent = `Hôm nay sinh nhật anh Híu rồi — tuổi ${birthday.age} thật rực rỡ nhé! ♡`;
    return;
  }
  const remaining = Math.max(0, birthday.timestamp - now.getTime());
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  countdown.textContent = days
    ? `Còn ${days} ngày nữa là anh Híu đón tuổi ${birthday.age}!`
    : `Còn ${hours} tiếng ${minutes} phút nữa là anh Híu đón tuổi ${birthday.age}!`;
}

function draw() {
  if (current === "home")
    app.innerHTML = `<div class="home-time" id="home-clock">--:--</div><div class="home-date">28 THÁNG 10 · MỪNG SINH NHẬT ANH HÍU</div><div class="widget"><small>ANH HÍU · TUỔI <span id="birthday-age">27</span></small><div>Thêm một vũ trụ. ✳</div><p id="birthday-countdown" aria-live="polite"></p></div><div class="apps"><button data-app="wishes"><i>♡</i>Lời chúc</button><button data-app="mod-wishes"><i>✦</i>Lời chúc modders</button><button data-app="art"><i>▧</i>Fan art</button><button data-app="gift"><i>✧</i>Bất ngờ</button></div>`;

  if (current === "wishes") {
    app.innerHTML = drawWish(
      wishes[page],
      page,
      wishes,
      "data-step",
      "Lời chúc",
      `${wishes.length} lời nhắn từ cộng đồng`,
    );
  }

  if (current === "mod-wishes")
    app.innerHTML = drawWish(
      moderatorWishes[modPage],
      modPage,
      moderatorWishes,
      "data-mod-step",
      "Lời chúc modders",
      `${moderatorWishes.length} lời nhắn từ các modders`,
    );

  if (current === "art") {
    const image = artworks[art];
    const media =
      image.type === "video"
        ? `<video class="art-media" controls playsinline preload="none" aria-label="${escapeHtml(image.alt)}"><source src="${escapeHtml(image.src)}" type="video/mp4">Trình duyệt không hỗ trợ phát video.</video>`
        : `<img class="art-media" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async">`;
    app.innerHTML =
      title("Fan art") +
      `<figure class="art-figure"><div class="artwork">${media}</div><figcaption><strong>${escapeHtml(image.title)}</strong><p>Gửi tặng anh Híu bởi <span class="artist">${escapeHtml(image.artist)}</span> ♡</p></figcaption></figure><div class="pager"><button data-art="-1" aria-label="Tranh trước">←</button><span>${art + 1} / ${artworks.length}</span><button data-art="1" aria-label="Tranh tiếp">→</button></div>`;
  }

  if (current === "gift")
    app.innerHTML =
      title("Bất ngờ") +
      `<div class="gift"><button id="celebrate" aria-label="Mở bất ngờ sinh nhật">🎂</button><p>Make a wish.</p><span class="caption">Chạm vào bánh để ăn mừng!</span></div>`;

  const homeClock = document.querySelector("#home-clock");
  if (homeClock) homeClock.textContent = vietnamTime(new Date());
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.app) {
    current = button.dataset.app;
    draw();
  }
  if (button.dataset.step) {
    page = (page + Number(button.dataset.step) + wishes.length) % wishes.length;
    draw();
  }
  if (button.dataset.modStep) {
    modPage =
      (modPage + Number(button.dataset.modStep) + moderatorWishes.length) %
      moderatorWishes.length;
    draw();
  }
  if (button.dataset.art) {
    art = (art + Number(button.dataset.art) + artworks.length) % artworks.length;
    draw();
  }
  if (button.id === "celebrate") {
    for (let i = 0; i < 55; i++) {
      const confetti = document.createElement("i");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.background = ["#ef826e", "#7e9e83", "#dfba72"][i % 3];
      confetti.style.animationDelay = Math.random() * 0.7 + "s";
      document.body.append(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }
  }
});

let swipe = null,
  swiped = false;
app.addEventListener("pointerdown", (event) => {
  swipe = event.clientX;
  swiped = false;
});
app.addEventListener("pointerup", (event) => {
  if (swipe === null) return;
  const delta = event.clientX - swipe;
  swipe = null;
  if (Math.abs(delta) <= 45) return;
  if (current === "wishes") {
    page = (page + (delta < 0 ? 1 : -1) + wishes.length) % wishes.length;
    swiped = true;
    draw();
  }
  if (current === "mod-wishes") {
    modPage =
      (modPage + (delta < 0 ? 1 : -1) + moderatorWishes.length) %
      moderatorWishes.length;
    swiped = true;
    draw();
  }
  if (current === "art") {
    art = (art + (delta < 0 ? 1 : -1) + artworks.length) % artworks.length;
    swiped = true;
    draw();
  }
});
app.addEventListener("pointercancel", () => (swipe = null));
app.addEventListener(
  "click",
  (event) => {
    if (!swiped) return;
    event.preventDefault();
    event.stopPropagation();
    swiped = false;
  },
  true,
);

const viewer = document.querySelector("#viewer");
document.querySelector("#model").onclick = () => viewer.showModal();
document.querySelector("#close").onclick = () => viewer.close();

const tutorial = document.querySelector("#tutorial");
const tutorialOpen = document.querySelector("#tutorial-open");
const tutorialClose = () => tutorial.close();
document.querySelector("#tutorial-close").addEventListener("click", tutorialClose);
document.querySelector("#tutorial-done").addEventListener("click", tutorialClose);
tutorialOpen.addEventListener("click", () => tutorial.showModal());
tutorial.addEventListener("close", () => {
  localStorage.setItem("birthday-tutorial-seen", "true");
});
if (localStorage.getItem("birthday-tutorial-seen") !== "true")
  tutorial.showModal();

draw();
updateTime();
setInterval(updateTime, 30_000);
