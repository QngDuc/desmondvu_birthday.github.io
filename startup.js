const opening = document.querySelector("#opening");
const video = document.querySelector("#opening-video");
const playButton = document.querySelector("#play-intro");
const skipButton = document.querySelector("#skip-intro");
const actions = document.querySelector("#opening-actions");
const gift = document.querySelector("#gift-reveal");
const giftButton = document.querySelector("#gift-open");
const openingStatus = document.querySelector("#opening-status");
const birthdaySite = document.querySelector("#birthday-site");
const siteStatus = document.querySelector("#site-status");
let videoStarted = false;
let giftReady = false;
let websiteStarted = false;

async function playIntro() {
  if (videoStarted || giftReady) return;
  videoStarted = true;
  playButton.hidden = true;
  video.hidden = false;
  openingStatus.textContent = "Đang tải video…";
  video.src = video.dataset.src;
  video.load();

  try {
    await video.play();
  } catch (error) {
    console.error("Không phát được video lời chúc:", error);
    videoStarted = false;
    video.hidden = true;
    playButton.hidden = false;
    playButton.textContent = "Thử phát lại video";
    openingStatus.textContent =
      "Video chưa phát được. Hãy thử lại hoặc bỏ qua để mở hộp quà.";
  }
}

function revealGift() {
  if (giftReady) return;
  giftReady = true;
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.hidden = true;
  actions.hidden = true;
  gift.hidden = false;
  openingStatus.textContent = "";
}

async function openWebsite() {
  if (!giftReady || websiteStarted) return;
  websiteStarted = true;
  opening.hidden = true;
  birthdaySite.hidden = false;
  siteStatus.textContent = "Đang mở món quà…";

  try {
    await Promise.all([
      import("./app.js"),
      import("./focus.js"),
      import("./phone-scene.js"),
    ]);
    siteStatus.textContent = "";
  } catch (error) {
    console.error("Không khởi chạy được trang sinh nhật:", error);
    siteStatus.textContent =
      "Chưa thể mở đầy đủ món quà. Hãy tải lại trang và thử lại.";
  }
}

playButton.addEventListener("click", playIntro);
skipButton.addEventListener("click", revealGift);
video.addEventListener("ended", revealGift);
video.addEventListener("error", () => {
  if (giftReady) return;
  videoStarted = false;
  video.hidden = true;
  playButton.hidden = false;
  playButton.textContent = "Thử phát lại video";
  openingStatus.textContent =
    "Không tải được video. Hãy thử lại hoặc bỏ qua để mở hộp quà.";
});
giftButton.addEventListener("click", openWebsite);
