const app = document.querySelector("#app");
const wishes = [
  [
    "Sinh nhật vui vẻ, Desmond!",
    "Chúc bạn tuổi mới có thật nhiều ngày rực rỡ, những người thương ở bên và đủ can đảm để theo đuổi điều mình thích. Mong mỗi lần mở chiếc điện thoại này, bạn lại thấy một lý do để mỉm cười.",
  ],
  [
    "Mọi điều dịu dàng đều dành cho bạn.",
    "Chúc những điều ước nhỏ dần thành hiện thực, những chuyến đi luôn đầy niềm vui và những ngày bình thường cũng trở nên đặc biệt. Hôm nay cứ ăn bánh, nhận yêu thương và là chính mình nhé!",
  ],
];
const artworks = [
  {
    src: "assets/fan-art-birthday.png",
    title: "Một chiếc bánh dành cho bạn",
    description: "Một người bạn nhỏ, một chiếc bánh và thật nhiều yêu thương.",
    alt: "Tranh anime màu nước: nhân vật tóc đen áo xanh sage cầm bánh sinh nhật, bên cạnh chú mèo màu kem.",
  },
  {
    src: "assets/fan-art-starlight.png",
    title: "Điều ước dưới bầu trời sao",
    description: "Mong tuổi mới của bạn lấp lánh như bầu trời này.",
    alt: "Tranh anime màu nước: nhân vật tóc đen và chú mèo ngồi trên đồi, ngắm trăng và sao băng.",
  },
];
let page = 0,
  art = 0,
  current = "home";
function title(t) {
  return `<div class="app-title"><button data-app="home" aria-label="Về trang chủ">‹</button><b>${t}</b><span>✦</span></div>`;
}
function draw() {
  if (current === "home")
    app.innerHTML = `<div class="home-time">09:41</div><div class="home-date">Hôm nay · Một ngày thật đặc biệt</div><div class="widget"><small>A NOTE FOR YOU</small>Your little<br>birthday universe. ✳</div><div class="apps"><button data-app="wishes"><i>♡</i>Lời chúc</button><button data-app="art"><i>▧</i>Fan art</button><button data-app="gift"><i>✧</i>Bất ngờ</button></div>`;
  if (current === "wishes")
    app.innerHTML =
      title("Lời chúc") +
      `<div class="letter"><span class="number">DEAR DESMOND / 0${page + 1}</span><h2>${wishes[page][0]}</h2><p>${wishes[page][1]}</p><span style="font-size:11px;color:#c8806e">With love ♡</span></div><div class="pager"><button data-step="-1" aria-label="Lời chúc trước">←</button><span>${page + 1} / ${wishes.length}</span><button data-step="1" aria-label="Lời chúc tiếp">→</button></div><div class="demo">Lời chúc mẫu · Có thể vuốt để chuyển</div>`;
  if (current === "art") {
    const image = artworks[art];
    app.innerHTML =
      title("Fan art") +
      `<figure class="art-figure"><div class="artwork"><img src="${image.src}" alt="${image.alt}" width="1024" height="1536" decoding="async"></div><figcaption><strong>${image.title}</strong><p>${image.description}</p><small>Fan art mẫu · Tạo bằng AI</small></figcaption></figure><div class="pager"><button data-art="-1" aria-label="Tranh trước">←</button><span>${art + 1} / ${artworks.length}</span><button data-art="1" aria-label="Tranh tiếp">→</button></div>`;
  }
  if (current === "gift")
    app.innerHTML =
      title("Bất ngờ") +
      `<div class="gift"><button id="celebrate" aria-label="Mở bất ngờ sinh nhật">🎂</button><p>Make a wish.</p><span class="caption">Chạm vào bánh để ăn mừng!</span></div>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.app) {
    current = b.dataset.app;
    draw();
  }
  if (b.dataset.step) {
    page = (page + Number(b.dataset.step) + wishes.length) % wishes.length;
    draw();
  }
  if (b.dataset.art) {
    art = (art + Number(b.dataset.art) + artworks.length) % artworks.length;
    draw();
  }
  if (b.id === "celebrate") {
    for (let i = 0; i < 55; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = ["#ef826e", "#7e9e83", "#dfba72"][i % 3];
      c.style.animationDelay = Math.random() * 0.7 + "s";
      document.body.append(c);
      setTimeout(() => c.remove(), 4000);
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
    if (swiped) {
      event.preventDefault();
      event.stopPropagation();
      swiped = false;
    }
  },
  true,
);
const viewer = document.querySelector("#viewer");
document.querySelector("#model").onclick = () => viewer.showModal();
document.querySelector("#close").onclick = () => viewer.close();
// Preload both gallery images so switching apps does not reveal an empty frame.
artworks.forEach((artwork) => {
  const image = new Image();
  image.src = artwork.src;
});
draw();
