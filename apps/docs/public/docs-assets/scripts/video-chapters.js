/*
 * In-page video playback for the video tutorials (2026-10-16), restoring what
 * the old docs did with VideoWithChapters and VideoModalTrigger. The docs
 * app loads this script on every docs page (components/docs/docs-scripts.tsx).
 *
 * The markup is written by the convert transforms
 * (packages/docs-tooling/src/convert/transforms/video-guides.ts and
 * video-poster.ts):
 * - `a.sol-yt[data-video=<id>]` (every embedded video): a poster thumbnail
 *   with a play button. A click swaps it for the youtube-nocookie player with
 *   autoplay, in place (`data-list` plays the playlist instead).
 * - `.sol-chapters[data-video=<id>]` around a list of `youtu.be/<id>?t=<s>`
 *   links: a click starts (or seeks) the player for <id> on the same page at
 *   that second, scrolls it into view and marks the chapter as current.
 * - `.sol-video-modal` around cards that link to YouTube (and any other card
 *   linking to a single YouTube video): a click opens the video in an
 *   autoplaying <dialog>. Closing it (button, Escape, backdrop) removes the
 *   iframe, which stops playback.
 * Without JavaScript, or with a modifier key / middle click, every link is a
 * plain YouTube link that opens at the same timestamp. Styles:
 * styles/video.css.
 */
(function () {
  if (window.__solVideoChapters) return;
  window.__solVideoChapters = true;

  var EMBED = "https://www.youtube-nocookie.com/embed/";
  var HOSTS =
    /^(?:www\.|m\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)$/;
  var ID = /^[\w-]{11}$/;

  /** { id, start } for a single-video YouTube URL, else null. */
  function parse(href) {
    var url;
    try {
      url = new URL(href, location.href);
    } catch {
      return null;
    }
    if (!HOSTS.test(url.hostname)) return null;
    var parts = url.pathname.split("/").filter(Boolean);
    var id =
      url.hostname === "youtu.be"
        ? parts[0]
        : parts[0] === "watch"
          ? url.searchParams.get("v")
          : parts[0] === "embed" || parts[0] === "shorts"
            ? parts[1]
            : null;
    if (!id || !ID.test(id)) return null;
    var t = url.searchParams.get("t") || url.searchParams.get("start") || "";
    var start = 0;
    if (/^\d+$/.test(t)) start = Number(t);
    else if (t) {
      var unit = function (u) {
        var m = t.match(new RegExp("(\\d+)" + u));
        return m ? Number(m[1]) : 0;
      };
      start = unit("h") * 3600 + unit("m") * 60 + unit("s");
    }
    return { id: id, start: start };
  }

  function src(id, start) {
    return (
      EMBED +
      id +
      "?autoplay=1&rel=0&modestbranding=1" +
      (start ? "&start=" + start : "")
    );
  }

  var ALLOW =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share";

  function playerFor(id) {
    var frames = document.querySelectorAll("iframe[src]");
    for (var i = 0; i < frames.length; i++) {
      var v = parse(frames[i].getAttribute("src"));
      if (v && v.id === id) return frames[i];
    }
    return null;
  }

  function posterFor(id) {
    var posters = document.querySelectorAll(
      "a.sol-yt[data-video]:not([hidden])",
    );
    for (var i = 0; i < posters.length; i++)
      if (posters[i].getAttribute("data-video") === id) return posters[i];
    return null;
  }

  /** Replace a poster with the autoplaying player; returns the iframe. */
  function play(poster, start) {
    var id = poster.getAttribute("data-video");
    var list = poster.getAttribute("data-list");
    var iframe = document.createElement("iframe");
    iframe.src = list
      ? EMBED +
        "videoseries?list=" +
        encodeURIComponent(list) +
        "&autoplay=1&rel=0&modestbranding=1"
      : src(id, start);
    iframe.title = poster.getAttribute("aria-label") || "Video";
    iframe.allow = ALLOW;
    iframe.setAttribute("allowfullscreen", "");
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    var box = document.createElement("div");
    box.className = "sol-yt sol-yt-frame";
    box.setAttribute("data-video", id);
    box.appendChild(iframe);
    // Hide the poster rather than remove it: the page's React tree owns it.
    poster.hidden = true;
    poster.after(box);
    iframe.focus({ preventScroll: true });
    return iframe;
  }

  function seek(list, link, video) {
    var id = list.getAttribute("data-video") || video.id;
    var frame = playerFor(id);
    if (frame) {
      var allow = frame.getAttribute("allow") || "";
      if (!/\bautoplay\b/.test(allow))
        frame.setAttribute("allow", (allow ? allow + "; " : "") + "autoplay");
      frame.setAttribute("src", src(video.id, video.start));
    } else {
      var poster = posterFor(id);
      if (!poster) return false; // no player on the page: open YouTube
      frame = play(poster, video.start);
    }
    var current = list.querySelectorAll('a[aria-current="true"]');
    for (var i = 0; i < current.length; i++)
      current[i].removeAttribute("aria-current");
    link.setAttribute("aria-current", "true");
    var r = frame.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight)
      frame.scrollIntoView({ behavior: "smooth", block: "center" });
    return true;
  }

  var dialog;
  var opener;
  function close() {
    if (dialog && dialog.open) dialog.close();
  }
  function ensureDialog() {
    if (dialog && document.body.contains(dialog)) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "sol-video-dialog";
    dialog.setAttribute("aria-label", "Video player");
    var button = document.createElement("button");
    button.type = "button";
    button.className = "sol-video-dialog-close";
    button.setAttribute("aria-label", "Close video");
    button.textContent = "×";
    button.addEventListener("click", close);
    var frame = document.createElement("div");
    frame.className = "sol-video-dialog-frame";
    dialog.appendChild(button);
    dialog.appendChild(frame);
    // A click on the backdrop (the dialog box itself, outside the player)
    // closes it.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) close();
    });
    dialog.addEventListener("close", function () {
      frame.textContent = ""; // removes the iframe: playback stops
      if (opener && document.body.contains(opener))
        opener.focus({ preventScroll: true });
      opener = null;
    });
    document.body.appendChild(dialog);
    return dialog;
  }

  function openModal(link, video) {
    if (typeof HTMLDialogElement !== "function") return false;
    var d = ensureDialog();
    var card = link.closest(".card") || link;
    var title =
      (card.querySelector("h2, h3, [class*='title']") || card).textContent ||
      "Video";
    title = title.trim().split("\n")[0];
    var iframe = document.createElement("iframe");
    iframe.src = src(video.id, video.start);
    iframe.title = title;
    iframe.allow =
      "autoplay; encrypted-media; picture-in-picture; fullscreen; web-share";
    iframe.setAttribute("allowfullscreen", "");
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    var box = d.querySelector(".sol-video-dialog-frame");
    box.textContent = "";
    box.appendChild(iframe);
    d.setAttribute("aria-label", title);
    // Back to the focusable card on close (its inner <a> is tabindex=-1).
    opener = card;
    d.showModal();
    return true;
  }

  document.addEventListener(
    "click",
    function (e) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      var link = e.target.closest && e.target.closest("a[href]");
      // A click anywhere on a docs card (.card) means its link.
      if (!link) link = cardLink(e.target);
      if (!link) return;
      if (link.classList.contains("sol-yt")) {
        var v = parse(link.getAttribute("href"));
        if (!v && !link.getAttribute("data-list")) return;
        play(link, v ? v.start : 0);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      var list = link.closest(".sol-chapters");
      var grid =
        list ||
        link.closest(".sol-video-modal") ||
        (link.closest("#content-area") &&
          (link.classList.contains("card") || link.closest(".card")));
      if (!list && !grid) return;
      var video = parse(link.getAttribute("href"));
      if (!video) return;
      var handled = list ? seek(list, link, video) : openModal(link, video);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  /** The single YouTube link of the docs card around `el`, if any. */
  function cardLink(el) {
    var card = el && el.closest && el.closest(".card");
    if (!card) return null;
    if (!card.closest(".sol-video-modal") && !card.closest("#content-area"))
      return null;
    var a = card.querySelector("a[href]");
    return a && parse(a.getAttribute("href")) ? a : null;
  }

  // Keyboard: Enter or Space on a focused video card opens the same modal
  // (the card's own link would open YouTube in a new tab).
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var t = e.target;
      if (!t || !t.classList || !t.classList.contains("card")) return;
      var link = cardLink(t);
      if (!link) return;
      var video = parse(link.getAttribute("href"));
      if (video && openModal(link, video)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  // Posters ship the always-present 480x360 thumbnail; use the sharp
  // maxresdefault one when the video has it (YouTube answers a missing one
  // with a 120x90 placeholder).
  function upgrade(img) {
    if (img.__solUp) return;
    img.__solUp = true;
    var m = /\/vi\/([\w-]{11})\/hqdefault\.jpg$/.exec(img.src);
    if (!m) return;
    var hi = new Image();
    hi.onload = function () {
      if (hi.naturalWidth > 200) img.src = hi.src;
    };
    hi.src = "https://i.ytimg.com/vi/" + m[1] + "/maxresdefault.jpg";
  }
  var queued = false;
  function scan() {
    queued = false;
    var imgs = document.querySelectorAll("a.sol-yt img");
    for (var i = 0; i < imgs.length; i++) upgrade(imgs[i]);
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(scan);
  }
  queue();
  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
