/*
 * "Try it" for the RPC method reference (styles/rpc-try-it.css).
 *
 * The Fumadocs docs had an interactive request panel on every RPC method page
 * (components/request-client.tsx at 023c6d918): pick devnet, testnet or
 * mainnet-beta, edit the request, Send, read the live response. This brings it
 * back. The docs app loads this script on every docs page
 * (components/docs/docs-scripts.tsx).
 *
 * Public Solana RPC endpoints allow CORS, so this panel calls them straight
 * from the reader's browser (no proxy, so readers do not share one IP against
 * the public RPC rate limits).
 *
 * Which pages: /developers/docs/rpc/http/<method> and /developers/docs/rpc/websocket/<method>Subscribe
 * (and their locale copies, /<locale>/developers/docs/rpc/...). Same set as the old site:
 * 53 HTTP methods and the 9 subscriptions (unsubscribe pages need a live
 * subscription id, as before). No marker is needed: the request is read from
 * the page's own <RequestExample>, which the docs render server-side with
 * every tab in the DOM (hidden or not):
 *   - HTTP: the `bash cURL` fence, `curl <url> ... -d '<json>'`;
 *   - WebSocket: the `json WebSocket` fence.
 * The request must be a JSON-RPC object whose "method" (lower-cased) is the
 * page slug. docs-tooling `verify` ("RPC Try it") checks that every method
 * page keeps that contract (src/verify/rpc-try-it.ts), so a page that would
 * silently lose its panel fails CI.
 *
 * UI: a bar under the page header (verb, URL, "Try it"), which opens a native modal <dialog> (focus trap and Esc for
 * free) with the network select, the editable request, Send (Ctrl/Cmd+Enter)
 * and the response with status, time and size. HTTP methods POST once;
 * subscriptions open a WebSocket, show the confirmation and stream
 * notifications until Stop, the dialog closes, MAX_NOTIFICATIONS arrive or
 * WS_TIMEOUT_MS passes. Responses are re-indented as text, never through
 * JSON.parse/stringify, so u64 values above 2^53 keep every digit.
 *
 * Without JavaScript nothing changes: the static request/response examples
 * are all there is, as before.
 * FRAGILE: relies on #header (inserts the bar after it) and on code blocks
 * being <pre> elements. If #header is missing the bar goes before #content.
 */
(function () {
  if (window.__solRpcTryIt) return;
  window.__solRpcTryIt = true;

  var SERVERS = [
    {
      id: "devnet",
      label: "Devnet",
      http: "https://api.devnet.solana.com",
      ws: "wss://api.devnet.solana.com",
    },
    {
      id: "testnet",
      label: "Testnet",
      http: "https://api.testnet.solana.com",
      ws: "wss://api.testnet.solana.com",
    },
    {
      id: "mainnet-beta",
      label: "Mainnet beta",
      http: "https://api.mainnet-beta.solana.com",
      ws: "wss://api.mainnet-beta.solana.com",
    },
  ];
  var STORE_KEY = "sol-rpc-try-it-server";
  var HTTP_TIMEOUT_MS = 30000;
  var WS_TIMEOUT_MS = 60000;
  var MAX_NOTIFICATIONS = 10;
  var MAX_SHOWN_CHARS = 400000;
  var PAGE_RE =
    /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?developers\/docs\/rpc\/(http|websocket)\/([a-z0-9]+)\/?$/i;

  var PLAY =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4.5 2.6v10.8a.6.6 0 0 0 .92.5l8.3-5.4a.6.6 0 0 0 0-1L5.42 2.1a.6.6 0 0 0-.92.5z"/></svg>';
  var CLOSE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"/></svg>';

  // ---------------------------------------------------------------------
  // Page detection and the example request
  // ---------------------------------------------------------------------

  function pageInfo(pathname) {
    var m = PAGE_RE.exec(pathname);
    if (!m) return null;
    var kind = m[1].toLowerCase() === "websocket" ? "ws" : "http";
    var slug = m[2].toLowerCase();
    if (kind === "ws" && !/subscribe$/.test(slug)) return null;
    if (kind === "ws" && /unsubscribe$/.test(slug)) return null;
    return { kind: kind, slug: slug, path: pathname };
  }

  function dedent(text) {
    var lines = text.replace(/\s+$/, "").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    var min = Infinity;
    lines.forEach(function (l) {
      if (!l.trim()) return;
      var n = /^ */.exec(l)[0].length;
      if (n < min) min = n;
    });
    if (!isFinite(min)) min = 0;
    return lines
      .map(function (l) {
        return l.slice(min);
      })
      .join("\n");
  }

  // `curl <url> -s -X POST -H "..." -d '<json>'` -> "<json>"
  function curlBody(text) {
    if (!/^\s*curl\s/.test(text)) return null;
    var i = text.indexOf("-d '");
    var j = text.lastIndexOf("'");
    if (i < 0 || j <= i + 4) return null;
    return text.slice(i + 4, j);
  }

  // The example request in one code block's text, or null. `kind` is "http"
  // (a cURL command) or "ws" (a bare JSON message); `slug` is the page slug.
  function requestFromText(kind, slug, text) {
    var raw = kind === "http" ? curlBody(text) : text;
    if (!raw || raw.trim().charAt(0) !== "{") return null;
    var obj;
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
    if (
      obj &&
      obj.jsonrpc === "2.0" &&
      typeof obj.method === "string" &&
      obj.method.toLowerCase() === slug &&
      "id" in obj &&
      !("result" in obj)
    )
      return { method: obj.method, body: dedent(raw) };
    return null;
  }

  function findRequest(info) {
    var pres = document.querySelectorAll("pre");
    for (var k = 0; k < pres.length; k++) {
      var req = requestFromText(
        info.kind,
        info.slug,
        pres[k].textContent || "",
      );
      if (req) return req;
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // Formatting
  // ---------------------------------------------------------------------

  // Re-indents JSON text with 2 spaces without parsing numbers (u64-safe).
  // Returns the input unchanged if it is not balanced JSON-ish text.
  function prettyJson(src) {
    var out = [];
    var depth = 0;
    var inStr = false;
    var esc = false;
    var pad = function (n) {
      return "\n" + new Array(n + 1).join("  ");
    };
    for (var i = 0; i < src.length; i++) {
      var c = src.charAt(i);
      if (inStr) {
        out.push(c);
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === " " || c === "\n" || c === "\r" || c === "\t") continue;
      if (c === '"') {
        inStr = true;
        out.push(c);
      } else if (c === "{" || c === "[") {
        // Keep empty {} / [] on one line.
        var next = src.slice(i + 1).match(/^\s*([\]}])/);
        if (next) {
          out.push(c + next[1]);
          i += next[0].length;
        } else {
          depth++;
          out.push(c + pad(depth));
        }
      } else if (c === "}" || c === "]") {
        depth = Math.max(0, depth - 1);
        out.push(pad(depth) + c);
      } else if (c === ",") {
        out.push("," + pad(depth));
      } else if (c === ":") {
        out.push(": ");
      } else out.push(c);
    }
    if (inStr || depth !== 0) return src;
    return out.join("");
  }

  function bytes(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1024 / 1024).toFixed(1) + " MB";
  }

  function rpcError(text) {
    try {
      var obj = JSON.parse(text);
      if (obj && obj.error) return obj.error;
    } catch {
      /* not JSON */
    }
    return null;
  }

  function methodOf(payload) {
    try {
      var obj = JSON.parse(payload);
      return obj && typeof obj.method === "string" ? obj.method : "";
    } catch {
      return "";
    }
  }

  /**
   * A short explanation under responses that are correct but would puzzle a
   * reader: methods public endpoints turn off, airdrop limits, the example's
   * slot falling out of range, and empty results for example addresses.
   */
  // Public endpoints answer methods they turn off (getLargestAccounts,
  // getTokenLargestAccounts, getTokenAccountsByDelegate, ...) with HTTP 429
  // "Too many requests for a specific RPC call", which is not a rate limit
  // that waiting clears.
  function disabledOnPublic(text) {
    var err = rpcError(text);
    return !!(err && /specific RPC call/i.test(String(err.message || "")));
  }

  function responseNote(method, text, httpStatus, srv) {
    var m = method.toLowerCase();
    var err = rpcError(text);
    if (m === "requestairdrop" && (err || httpStatus === 429))
      return "\n\nPublic airdrops are rate limited and often refused. Get devnet or testnet SOL from https://faucet.solana.com instead.";
    if (disabledOnPublic(text))
      return (
        "\n\n" +
        method +
        " is disabled on public RPC endpoints because it is expensive to serve. Try it against an RPC provider, or a local validator or Surfpool."
      );
    if (m === "getslotleaders" && err)
      return "\n\nThe example's start slot is outside the range this node serves. Put a recent slot (from getSlot) as the first parameter and send again.";
    if (err || httpStatus !== 200) return "";
    try {
      var r = JSON.parse(text).result;
      var v = r && typeof r === "object" && "value" in r ? r.value : r;
      if (v === null || (Array.isArray(v) && v.length === 0))
        return (
          "\n\nA valid, empty result: the example's address or parameters have no matching data on " +
          srv.label +
          ". Replace them with your own and send again."
        );
    } catch {
      /* not JSON */
    }
    return "";
  }

  // api.mainnet-beta.solana.com answers browser requests (HTTP and
  // WebSocket) only from allowlisted origins such as https://solana.com, and
  // returns 403 "Access forbidden" to any other page (localhost, preview
  // deployments). Devnet and testnet accept any origin.
  function originNote(srv) {
    if (srv.id !== "mainnet-beta") return "";
    if (/(^|\.)solana\.com$/.test(location.hostname)) return "";
    return (
      "\n\nMainnet beta only accepts browser requests from solana.com, and this page is served from " +
      location.origin +
      ". Use devnet or testnet here, or open the page on solana.com."
    );
  }

  function serverById(id) {
    for (var i = 0; i < SERVERS.length; i++)
      if (SERVERS[i].id === id) return SERVERS[i];
    return SERVERS[0];
  }

  function savedServer() {
    try {
      return serverById(localStorage.getItem(STORE_KEY) || "devnet");
    } catch {
      return SERVERS[0];
    }
  }

  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs)
      for (var k in attrs)
        if (Object.prototype.hasOwnProperty.call(attrs, k))
          el.setAttribute(k, attrs[k]);
    if (html != null) el.innerHTML = html;
    return el;
  }

  // ---------------------------------------------------------------------
  // The bar under the page header
  // ---------------------------------------------------------------------

  var current = null; // { info, req, bar, dialog }

  function buildBar(info, req) {
    var server = savedServer();
    var bar = h("div", {
      class: "sol-rpc-bar not-prose",
      "data-sol-rpc-path": info.path,
    });
    var verb = h("span", { class: "sol-rpc-verb" });
    verb.textContent = info.kind === "ws" ? "WSS" : "POST";
    verb.setAttribute("data-kind", info.kind);
    var url = h("code", { class: "sol-rpc-url" });
    url.textContent = info.kind === "ws" ? server.ws : server.http;
    var name = h("span", { class: "sol-rpc-method" });
    name.textContent = req.method;
    var btn = h(
      "button",
      { type: "button", class: "sol-rpc-open", "aria-haspopup": "dialog" },
      "<span>Try it</span>" + PLAY,
    );
    btn.setAttribute(
      "aria-label",
      "Try " + req.method + " against a live cluster",
    );
    btn.addEventListener("click", function () {
      openDialog(btn);
    });
    var where = h("span", { class: "sol-rpc-where" });
    where.appendChild(url);
    where.appendChild(name);
    bar.appendChild(verb);
    bar.appendChild(where);
    bar.appendChild(btn);
    return bar;
  }

  function refreshBarUrl() {
    if (!current) return;
    var server = savedServer();
    var url = current.bar.querySelector(".sol-rpc-url");
    if (url)
      url.textContent = current.info.kind === "ws" ? server.ws : server.http;
  }

  // ---------------------------------------------------------------------
  // The dialog
  // ---------------------------------------------------------------------

  var uid = 0;

  function buildDialog(info, req) {
    uid++;
    var ids = {
      title: "sol-rpc-title-" + uid,
      server: "sol-rpc-server-" + uid,
      body: "sol-rpc-body-" + uid,
      out: "sol-rpc-out-" + uid,
      hint: "sol-rpc-hint-" + uid,
    };
    var isWs = info.kind === "ws";
    var dlg = h("dialog", {
      class: "sol-rpc-dlg",
      "aria-labelledby": ids.title,
    });
    var options = SERVERS.map(function (s) {
      return '<option value="' + s.id + '">' + s.label + "</option>";
    }).join("");
    dlg.innerHTML =
      '<div class="sol-rpc-dlg-inner">' +
      '<div class="sol-rpc-head">' +
      '<h2 class="sol-rpc-title" id="' +
      ids.title +
      '"><span class="sol-rpc-verb" data-kind="' +
      info.kind +
      '">' +
      (isWs ? "WSS" : "POST") +
      '</span><span class="sol-rpc-title-text"></span></h2>' +
      '<button type="button" class="sol-rpc-x" aria-label="Close">' +
      CLOSE +
      "</button></div>" +
      '<div class="sol-rpc-grid">' +
      '<div class="sol-rpc-col">' +
      '<div class="sol-rpc-controls">' +
      '<label class="sol-rpc-label" for="' +
      ids.server +
      '">Network</label>' +
      '<div class="sol-rpc-row">' +
      '<select class="sol-rpc-select" id="' +
      ids.server +
      '">' +
      options +
      "</select>" +
      '<button type="button" class="sol-rpc-send">' +
      PLAY +
      "<span>" +
      (isWs ? "Subscribe" : "Send request") +
      "</span></button></div>" +
      '<code class="sol-rpc-endpoint"></code></div>' +
      '<div class="sol-rpc-label-row"><label class="sol-rpc-label" for="' +
      ids.body +
      '">Request</label>' +
      '<button type="button" class="sol-rpc-reset">Reset</button></div>' +
      '<textarea class="sol-rpc-body" id="' +
      ids.body +
      '" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="' +
      ids.hint +
      '"></textarea>' +
      '<p class="sol-rpc-hint" id="' +
      ids.hint +
      '">' +
      (isWs
        ? "Sent as the first message on a WebSocket. Notifications stream in until you stop, close this dialog, " +
          MAX_NOTIFICATIONS +
          " arrive or " +
          WS_TIMEOUT_MS / 1000 +
          " s pass."
        : "Sent from your browser as a JSON-RPC POST.") +
      " Public endpoints are rate limited. Press Ctrl+Enter or ⌘+Enter to send.</p>" +
      "</div>" +
      '<div class="sol-rpc-col sol-rpc-col-out">' +
      '<div class="sol-rpc-label-row"><span class="sol-rpc-label">Response</span>' +
      '<span class="sol-rpc-status" role="status" aria-live="polite" data-tone="idle">Not sent yet</span></div>' +
      '<pre class="sol-rpc-out" id="' +
      ids.out +
      '" tabindex="0" aria-label="Response"></pre>' +
      "</div></div></div>";

    dlg.querySelector(".sol-rpc-title-text").textContent = req.method;
    var select = dlg.querySelector(".sol-rpc-select");
    var send = dlg.querySelector(".sol-rpc-send");
    var sendLabel = send.querySelector("span");
    var body = dlg.querySelector(".sol-rpc-body");
    var endpoint = dlg.querySelector(".sol-rpc-endpoint");
    var status = dlg.querySelector(".sol-rpc-status");
    var out = dlg.querySelector(".sol-rpc-out");
    var reset = dlg.querySelector(".sol-rpc-reset");

    body.value = req.body;
    body.rows = Math.min(18, Math.max(6, req.body.split("\n").length + 1));
    select.value = savedServer().id;

    function server() {
      return serverById(select.value);
    }
    function showEndpoint() {
      endpoint.textContent = isWs ? server().ws : server().http;
    }
    showEndpoint();

    function setStatus(tone, text) {
      status.setAttribute("data-tone", tone);
      status.textContent = text;
    }
    function showText(text) {
      if (text.length > MAX_SHOWN_CHARS)
        text =
          text.slice(0, MAX_SHOWN_CHARS) +
          "\n\n… truncated: showing the first " +
          bytes(MAX_SHOWN_CHARS) +
          ".";
      out.textContent = text;
      out.scrollTop = 0;
    }
    function parseBody() {
      try {
        JSON.parse(body.value);
        return body.value;
      } catch (e) {
        setStatus("error", "Invalid JSON in the request");
        showText(
          "The request is not valid JSON, so nothing was sent.\n\n" +
            String(e && e.message ? e.message : e),
        );
        body.setAttribute("aria-invalid", "true");
        body.focus();
        return null;
      }
    }

    select.addEventListener("change", function () {
      try {
        localStorage.setItem(STORE_KEY, select.value);
      } catch {
        /* private mode */
      }
      showEndpoint();
      refreshBarUrl();
    });
    reset.addEventListener("click", function () {
      body.value = req.body;
      body.removeAttribute("aria-invalid");
      body.focus();
    });
    body.addEventListener("input", function () {
      body.removeAttribute("aria-invalid");
    });
    body.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        send.click();
      }
    });

    // --- HTTP ---------------------------------------------------------
    var busy = false;
    function sendHttp() {
      if (busy) return;
      var payload = parseBody();
      if (payload == null) return;
      var url = server().http;
      var ctrl =
        typeof AbortController === "function" ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (ctrl) ctrl.abort();
      }, HTTP_TIMEOUT_MS);
      busy = true;
      send.setAttribute("aria-busy", "true");
      // aria-disabled, not disabled: a disabled button drops keyboard focus.
      send.setAttribute("aria-disabled", "true");
      sendLabel.textContent = "Sending…";
      setStatus("busy", "Sending to " + server().label + "…");
      var t0 = performance.now();
      var httpStatus = 0;
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        signal: ctrl ? ctrl.signal : undefined,
      })
        .then(function (res) {
          httpStatus = res.status;
          return res.text().then(function (text) {
            return { res: res, text: text };
          });
        })
        .then(function (r) {
          var ms = Math.round(performance.now() - t0);
          var size = bytes(new Blob([r.text]).size);
          var err = rpcError(r.text);
          var head =
            r.res.status + (r.res.statusText ? " " + r.res.statusText : "");
          if (!r.res.ok)
            setStatus(
              "error",
              "HTTP " +
                head +
                " · " +
                ms +
                " ms" +
                (disabledOnPublic(r.text)
                  ? " · disabled on public RPC endpoints"
                  : r.res.status === 429
                    ? " · rate limited, wait a few seconds"
                    : ""),
            );
          else if (err)
            setStatus(
              "warn",
              "HTTP " +
                head +
                " · JSON-RPC error " +
                err.code +
                " · " +
                ms +
                " ms · " +
                size,
            );
          else setStatus("ok", "HTTP " + head + " · " + ms + " ms · " + size);
          showText(
            (r.text ? prettyJson(r.text) : "(empty response body)") +
              (r.res.status === 403 ? originNote(server()) : "") +
              responseNote(methodOf(payload), r.text, r.res.status, server()),
          );
        })
        .catch(function (e) {
          var ms = Math.round(performance.now() - t0);
          var aborted = e && e.name === "AbortError";
          setStatus(
            "error",
            (aborted ? "Timed out" : "Network error") + " · " + ms + " ms",
          );
          showText(
            aborted
              ? "No response from " +
                  url +
                  " within " +
                  HTTP_TIMEOUT_MS / 1000 +
                  " s."
              : "The request to " +
                  url +
                  " failed" +
                  (httpStatus ? " (HTTP " + httpStatus + ")" : "") +
                  ": " +
                  String(e && e.message ? e.message : e) +
                  "\n\nThe public endpoint may be rate limiting you or unreachable from your network. Try again in a few seconds or pick another network." +
                  originNote(server()),
          );
        })
        .then(function () {
          clearTimeout(timer);
          busy = false;
          send.removeAttribute("aria-disabled");
          send.removeAttribute("aria-busy");
          sendLabel.textContent = "Send request";
        });
    }

    // --- WebSocket ----------------------------------------------------
    var sock = null;
    var wsTimer = null;
    var subId = null;
    var count = 0;
    var log = [];
    function wsRender() {
      showText(log.join("\n\n"));
      out.scrollTop = out.scrollHeight;
    }
    function wsStop(reason) {
      if (!sock) return;
      var s = sock;
      sock = null;
      clearTimeout(wsTimer);
      try {
        if (s.readyState === 1 && subId != null)
          s.send(
            JSON.stringify({
              jsonrpc: "2.0",
              id: 2,
              method: req.method.replace(/Subscribe$/, "Unsubscribe"),
              params: [subId],
            }),
          );
        s.close(1000);
      } catch {
        /* already closed */
      }
      send.classList.remove("is-stop");
      sendLabel.textContent = "Subscribe";
      if (reason)
        setStatus(
          status.getAttribute("data-tone") === "error" ? "error" : "idle",
          reason,
        );
    }
    function wsStart() {
      if (sock) {
        wsStop(
          "Stopped · " + count + " notification" + (count === 1 ? "" : "s"),
        );
        return;
      }
      var payload = parseBody();
      if (payload == null) return;
      var srv = server();
      var t0 = performance.now();
      subId = null;
      count = 0;
      log = [];
      showText("");
      setStatus("busy", "Connecting to " + srv.ws + "…");
      send.classList.add("is-stop");
      sendLabel.textContent = "Stop";
      var s;
      try {
        s = new WebSocket(srv.ws);
      } catch (e) {
        setStatus("error", "Could not open a WebSocket");
        showText(String(e && e.message ? e.message : e));
        send.classList.remove("is-stop");
        sendLabel.textContent = "Subscribe";
        return;
      }
      sock = s;
      wsTimer = setTimeout(function () {
        wsStop(
          "Stopped after " +
            WS_TIMEOUT_MS / 1000 +
            " s · " +
            count +
            " notification" +
            (count === 1 ? "" : "s"),
        );
      }, WS_TIMEOUT_MS);
      s.onopen = function () {
        if (sock !== s) return;
        setStatus("busy", "Connected · subscribing…");
        s.send(payload);
      };
      s.onmessage = function (ev) {
        if (sock !== s) return;
        var ms = Math.round(performance.now() - t0);
        var text = String(ev.data);
        var err = rpcError(text);
        var obj = null;
        try {
          obj = JSON.parse(text);
        } catch {
          /* keep raw */
        }
        if (err) {
          log.push("// +" + ms + " ms · error\n" + prettyJson(text));
          wsRender();
          setStatus("warn", "JSON-RPC error " + err.code + " · " + ms + " ms");
          wsStop();
          return;
        }
        if (obj && "id" in obj && "result" in obj && subId == null) {
          subId = obj.result;
          log.push("// +" + ms + " ms · subscribed\n" + prettyJson(text));
          setStatus(
            "ok",
            "Subscribed · id " + subId + " · waiting for notifications…",
          );
        } else {
          count++;
          log.push(
            "// +" +
              ms +
              " ms · notification " +
              count +
              "\n" +
              prettyJson(text),
          );
          setStatus(
            "ok",
            "Subscribed · " +
              count +
              " notification" +
              (count === 1 ? "" : "s"),
          );
        }
        wsRender();
        if (count >= MAX_NOTIFICATIONS)
          wsStop("Stopped after " + count + " notifications");
      };
      s.onerror = function () {
        if (sock !== s) return;
        setStatus("error", "WebSocket error");
        log.push(
          "// The connection to " +
            srv.ws +
            " failed. The public endpoint may be rate limiting you or unreachable from your network." +
            originNote(srv).replace(/\n\n/, "\n// "),
        );
        wsRender();
      };
      s.onclose = function (ev) {
        if (sock !== s) return;
        sock = null;
        clearTimeout(wsTimer);
        send.classList.remove("is-stop");
        sendLabel.textContent = "Subscribe";
        if (status.getAttribute("data-tone") !== "error")
          setStatus(
            "idle",
            "Connection closed (" +
              ev.code +
              ") · " +
              count +
              " notification" +
              (count === 1 ? "" : "s"),
          );
      };
    }

    send.addEventListener("click", isWs ? wsStart : sendHttp);
    dlg.querySelector(".sol-rpc-x").addEventListener("click", function () {
      dlg.close();
    });
    // Click on the backdrop closes.
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", function () {
      if (isWs) wsStop("Stopped · dialog closed");
      document.documentElement.classList.remove("sol-rpc-open");
      var opener = dlg.__solOpener;
      if (opener && document.contains(opener))
        opener.focus({ preventScroll: true });
    });
    dlg.__solStop = function () {
      if (isWs) wsStop();
    };
    return dlg;
  }

  function openDialog(opener) {
    if (!current) return;
    if (!current.dialog) {
      current.dialog = buildDialog(current.info, current.req);
      document.body.appendChild(current.dialog);
    }
    var dlg = current.dialog;
    dlg.__solOpener = opener;
    var select = dlg.querySelector(".sol-rpc-select");
    if (select.value !== savedServer().id) {
      select.value = savedServer().id;
      select.dispatchEvent(new Event("change"));
    }
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    document.documentElement.classList.add("sol-rpc-open");
    dlg.querySelector(".sol-rpc-body").focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------
  // Mount / unmount (survives the docs' client-side navigation)
  // ---------------------------------------------------------------------

  function teardown() {
    if (!current) return;
    if (current.dialog) {
      current.dialog.__solStop();
      if (current.dialog.open) current.dialog.close();
      current.dialog.remove();
    }
    if (current.bar.parentNode) current.bar.parentNode.removeChild(current.bar);
    current = null;
  }

  function scan() {
    var info = pageInfo(location.pathname);
    if (current && (!info || current.info.path !== info.path)) teardown();
    if (!info) return;
    if (current && document.contains(current.bar)) return;
    var header = document.getElementById("header");
    var content = document.getElementById("content");
    if (!header && !content) return;
    var req = current ? current.req : findRequest(info);
    if (!req) return;
    var bar = current ? current.bar : buildBar(info, req);
    if (header) header.insertAdjacentElement("afterend", bar);
    else content.insertAdjacentElement("beforebegin", bar);
    if (!current) current = { info: info, req: req, bar: bar, dialog: null };
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      scan();
    });
  }

  function start() {
    scan();
    if (typeof MutationObserver === "function")
      new MutationObserver(schedule).observe(document.body, {
        childList: true,
        subtree: true,
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();

  window.solRpcTryIt = {
    refresh: scan,
    servers: SERVERS,
    // For docs-tooling's tests (test/rpc-try-it.test.ts), which run this file
    // in a VM against every RPC page's example.
    _test: {
      pageInfo: pageInfo,
      curlBody: curlBody,
      requestFromText: requestFromText,
      prettyJson: prettyJson,
    },
  };
})();
