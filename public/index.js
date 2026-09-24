"use strict";
const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");
const frame = document.getElementById("uv-frame");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

async function launch(url) {
  error.textContent = "";
  errorCode.textContent = "";
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }
  const target = search(url, searchEngine.value);
  const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
  if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  }
  frame.src = __uv$config.prefix + __uv$config.encodeUrl(target);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  launch(address.value).catch(() => {});
});

document.getElementById("btn-tiktok").addEventListener("click", () => {
  address.value = "https://www.tiktok.com/";
  launch(address.value).catch(() => {});
});

// about:blank cloak - hides URL from shoulder-surfers / basic tab scanners
document.getElementById("btn-blank").addEventListener("click", () => {
  const w = window.open("about:blank", "_blank");
  if (!w) return;
  w.document.write(`<iframe src="${location.href}" style="border:0;width:100vw;height:100vh;margin:0" allow="fullscreen; autoplay; encrypted-media"></iframe>`);
  w.document.close();
});

// Auto-load TikTok on first visit
window.addEventListener("load", () => {
  launch("https://www.tiktok.com/").catch(() => {});
});
