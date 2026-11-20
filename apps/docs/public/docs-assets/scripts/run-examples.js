/*
 * Run button for recorded example output.
 *
 * Generated snippets (apps/docs/snippets/examples/**, built by
 * packages/docs-tooling) render each recorded output as
 *
 *   <div class="sol-run" data-run="<block id>" data-tab="Kit" [data-runner="generate-keypair"]>
 *     <div class="sol-run-bar"><button class="sol-run-btn">Run</button><span class="sol-run-note">…</span></div>
 *     <div class="sol-run-out"> …recorded output code block… </div>
 *     [<pre class="sol-run-live"></pre>]
 *   </div>
 *
 * Without JavaScript the output is simply visible and the button is hidden
 * (styles/run.css). This script only enhances: it marks <html data-sol-run>
 * so the CSS hides outputs and shows the Run buttons, then reveals an output
 * after a short "Running" state (500 ms, none under prefers-reduced-motion).
 * Nothing is executed against a network.
 *
 * Terminal panels (.sol-term, src/lib/terminal.ts in packages/docs-tooling:
 * the job-path examples and demos) are server-rendered with the complete
 * output. This script turns each into a run: the screen starts with the
 * prompt only, Run shows a pending status, then streams the output lines back
 * in (a pause after each prompt while the transaction or request is in
 * flight, then the lines it printed, fast), shows the step's result badges,
 * the total time of the run, and offers Next step / Run all / Run again.
 * Values shortened with a middle ellipsis copy their full text on click (or
 * Enter/Space). Under prefers-reduced-motion every step appears at once and
 * the footer shows just "Done" (no total time).
 *
 * Both only set attributes (and text on empty slots), never add or remove
 * elements, and re-apply their state when React re-creates the markup.
 *
 * The docs app loads this script on every docs page
 * (components/docs/docs-scripts.tsx) and the docs navigate client-side, so
 * all handling is delegated from `document`; no per-element setup is needed.
 * It is a plain script that cannot import npm packages, hence the inline
 * base58.
 */
(function () {
  if (window.__solRunExamples) return;
  window.__solRunExamples = true;

  var MIN_RUN_MS = 500;
  document.documentElement.setAttribute("data-sol-run", "");

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // React may re-create the snippet DOM (tab remounts, navigation), which
  // drops attributes this script set, so state is kept by key and re-applied:
  // key = path | id attribute | tab | nth occurrence on the page.
  function keyed(selector, idAttr) {
    var els = document.querySelectorAll(selector);
    var seen = {};
    var list = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var id =
        (el.getAttribute(idAttr) || "") +
        "|" +
        (el.getAttribute("data-tab") || "");
      var n = seen[id] || 0;
      seen[id] = n + 1;
      list.push({ el: el, key: location.pathname + "|" + id + "|" + n });
    }
    return list;
  }
  function keyOf(selector, idAttr, el) {
    var list = keyed(selector, idAttr);
    for (var i = 0; i < list.length; i++)
      if (list[i].el === el) return list[i].key;
    return "";
  }
  function byKey(selector, idAttr, key) {
    var list = keyed(selector, idAttr);
    for (var i = 0; i < list.length; i++)
      if (list[i].key === key) return list[i].el;
    return null;
  }

  // ---------------------------------------------------------------------
  // Browser runners: produce fresh output instead of the recorded sample.
  // ---------------------------------------------------------------------
  var B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  function base58(bytes) {
    var n = 0n;
    for (var i = 0; i < bytes.length; i++) n = n * 256n + BigInt(bytes[i]);
    var out = "";
    for (; n > 0n; n /= 58n) out = B58[Number(n % 58n)] + out;
    for (var k = 0; k < bytes.length && bytes[k] === 0; k++) out = "1" + out;
    return out;
  }

  async function generateKeyPair() {
    var subtle = window.crypto.subtle;
    if (!subtle) throw new Error("WebCrypto unavailable"); // insecure context
    var kp = await subtle.generateKey({ name: "Ed25519" }, true, [
      "sign",
      "verify",
    ]);
    var pub = new Uint8Array(await subtle.exportKey("raw", kp.publicKey));
    return { address: base58(pub) };
  }

  var RUNNERS = {
    // cookbook/wallets/create-keypair: every run prints a new address, so
    // generate a real Ed25519 key pair in the browser. Formats match what each
    // flavour prints (see the recorded .output.txt files).
    "generate-keypair": async function (tab) {
      var k = await generateKeyPair();
      if (tab === "Kit") return "address:  " + k.address; // console.log("address: ", x)
      return "address: " + k.address;
    },
  };

  // ---------------------------------------------------------------------
  // Run button
  // ---------------------------------------------------------------------
  var BOX = ".sol-run";
  var finished = {}; // key -> finished run
  // Button semantics: it discloses the output region it controls.
  var outIds = 0;
  function ensureAria(box) {
    var button = box.querySelector(".sol-run-btn");
    var out = box.querySelector(".sol-run-out");
    if (!button || !out) return;
    var n = ++outIds;
    if (!out.id) out.id = "sol-run-out-" + n;
    var controls = out.id;
    // Browser runners show fresh output in .sol-run-live instead.
    var live = box.querySelector(".sol-run-live");
    if (live) {
      if (!live.id) live.id = "sol-run-live-" + n;
      controls += " " + live.id;
    }
    if (button.getAttribute("aria-controls") !== controls)
      button.setAttribute("aria-controls", controls);
    if (!button.hasAttribute("aria-expanded"))
      button.setAttribute("aria-expanded", "false");
  }

  function applyDone(box, record) {
    var button = box.querySelector(".sol-run-btn");
    var live = box.querySelector(".sol-run-live");
    if (record.live && live) {
      if (live.textContent !== record.live) live.textContent = record.live;
      box.setAttribute("data-live", "");
    } else {
      box.removeAttribute("data-live");
    }
    var out = box.querySelector(".sol-run-out");
    if (out) out.setAttribute("aria-live", "polite");
    box.setAttribute("data-state", "done");
    box.removeAttribute("aria-busy");
    if (button) {
      button.removeAttribute("aria-disabled");
      button.textContent = record.runner ? "Run again" : "Run";
      button.setAttribute("aria-expanded", "true");
    }
  }

  function run(box, button) {
    if (box.getAttribute("data-state") === "running") return;
    var key = keyOf(BOX, "data-run", box);
    box.setAttribute("data-state", "running");
    box.setAttribute("aria-busy", "true");
    ensureAria(box);
    // aria-disabled, not disabled: a disabled button drops keyboard focus.
    button.setAttribute("aria-disabled", "true");
    button.textContent = "Running\u2026";

    var delay = new Promise(function (resolve) {
      setTimeout(resolve, reducedMotion() ? 0 : MIN_RUN_MS);
    });
    var runnerId = box.getAttribute("data-runner") || "";
    var runner = RUNNERS[runnerId];
    var fresh = runner
      ? runner(box.getAttribute("data-tab") || "").catch(function () {
          return null; // e.g. no Ed25519 in this browser: show the recorded sample
        })
      : Promise.resolve(null);

    Promise.all([fresh, delay]).then(function (results) {
      var record = { live: results[0], runner: !!runner };
      finished[key] = record;
      var target = box.isConnected ? box : byKey(BOX, "data-run", key);
      if (target) applyDone(target, record);
    });
  }

  // ---------------------------------------------------------------------
  // Terminal panels (.sol-term)
  // ---------------------------------------------------------------------
  var terms = {}; // key -> run state
  var gen = 0; // bumps on every reset so stale timers stop

  var TERM = ".sol-term:not([data-norun])";
  function termKey(root) {
    return keyOf(TERM, "data-term", root);
  }
  function termRoot(key) {
    return byKey(TERM, "data-term", key);
  }

  /** UI strings: every panel carries them (data-l-*, terminal.ts). */
  function label(root, name) {
    return root.getAttribute("data-l-" + name) || "";
  }
  function setAttr(el, name, value) {
    if (!el) return;
    if (value === null) {
      if (el.hasAttribute(name)) el.removeAttribute(name);
    } else if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  }
  function setText(el, value) {
    if (el && el.textContent !== value) el.textContent = value;
  }
  function seconds(ms) {
    return (Math.max(ms, 100) / 1000).toFixed(1) + " s";
  }

  function stepsOf(root) {
    return root.querySelectorAll(".sol-term-step");
  }
  function rowsOf(step) {
    return step.querySelectorAll(".sol-term-row");
  }
  /** Rows shown before a step runs: its heading and first prompt. */
  function leadOf(step) {
    var rows = rowsOf(step);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].classList.contains("sol-term-cmd")) return i + 1;
      if (!rows[i].classList.contains("sol-term-note")) return i;
    }
    return rows.length;
  }

  function freshState(root) {
    return {
      total: stepsOf(root).length,
      done: 0, // completed steps
      cur: -1, // running step
      shown: 0, // rows shown in the running step
      all: false,
      status: "",
      durs: [],
      t0: 0,
      confirming: false, // the running step's status reached "Confirming…"
    };
  }

  /** Make shortened values copyable from the keyboard (idempotent). */
  function enhanceValues(root) {
    var hs = root.querySelectorAll(".sol-h");
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      var short = h.querySelector(".sol-h-s");
      setAttr(h, "tabindex", "0");
      setAttr(h, "role", "button");
      setAttr(
        h,
        "aria-label",
        "Copy " + (short ? short.textContent : h.getAttribute("title")),
      );
    }
  }

  function applyTerm(root, st) {
    var multi = st.total > 1;
    // Run all: the pause between two steps still counts as running.
    var running = st.cur >= 0 || !!st.chain;
    var finished = st.done >= st.total;
    var state = running
      ? "running"
      : finished
        ? "done"
        : st.done > 0
          ? "paused"
          : "idle";
    setAttr(root, "data-state", state);
    setAttr(root, "data-progress", String(st.done));
    setAttr(root, "aria-busy", running ? "true" : null);

    var steps = stepsOf(root);
    var next = st.cur >= 0 ? st.cur : st.done;
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var rows = rowsOf(step);
      var show =
        i < st.done
          ? rows.length
          : i === next
            ? st.cur >= 0
              ? st.shown
              : leadOf(step)
            : 0;
      var caret = i === next && !finished ? show - 1 : -1;
      for (var r = 0; r < rows.length; r++) {
        setAttr(rows[r], "data-on", r < show ? "" : null);
        setAttr(rows[r], "data-caret", r === caret ? "" : null);
      }
      setAttr(step, "data-on", show > 0 || i === next ? "" : null);
      setAttr(step, "data-done", i < st.done ? "" : null);
    }

    var plan = root.querySelectorAll(".sol-term-plan > li");
    for (var p = 0; p < plan.length; p++)
      setAttr(
        plan[p],
        "data-state",
        p < st.done
          ? "done"
          : p === next
            ? running
              ? "running"
              : "current"
            : "todo",
      );

    var run = root.querySelector('.sol-term-btn[data-act="run"]');
    var all = root.querySelector('.sol-term-btn[data-act="all"]');
    if (run) {
      setText(
        run,
        running
          ? label(root, "running")
          : finished
            ? label(root, "again")
            : st.done > 0
              ? label(root, "next")
              : multi
                ? label(root, "run-step") + " 1"
                : label(root, "run"),
      );
      setAttr(run, "aria-disabled", running ? "true" : null);
    }
    if (all) setAttr(all, "hidden", finished || running ? "" : null);

    var status = root.querySelector(".sol-term-status");
    setText(status, st.status);
    setAttr(status, "data-busy", running ? "" : null);
    enhanceValues(root);
  }

  function announce(root, text) {
    setText(root.querySelector(".sol-term-sr"), text);
  }

  function badgesText(step) {
    var out = [];
    var bs = step.querySelectorAll(".sol-term-badge");
    for (var i = 0; i < bs.length; i++) out.push(bs[i].textContent);
    return out.join(", ");
  }

  /**
   * Pause before revealing a row. The wait sits where the real program waits:
   * after a prompt, until the call returns its first line (a transaction
   * being sent and confirmed, an HTTP round trip). The lines a call prints
   * after that come out together, so they are fast. Under a second for a
   * one-transaction step.
   */
  function delayFor(step, rows, index) {
    var row = rows[index];
    var jitter = ((index * 37) % 100) / 100; // deterministic, 0..1
    if (row.classList.contains("sol-term-cmd")) return 180 + jitter * 120;
    if (row.classList.contains("sol-term-note")) return 100;
    if (!isSlow(rows, index)) return 35 + jitter * 50;
    var kind = step.getAttribute("data-pending") || "call";
    if (kind === "tx") return 380 + jitter * 120;
    if (kind === "http") return 300 + jitter * 150;
    return 140 + jitter * 100;
  }
  /** Is the wait before this row a call in flight (not local printing)? */
  function isSlow(rows, index) {
    var row = rows[index];
    if (!row || row.classList.contains("sol-term-cmd")) return false;
    if (row.classList.contains("sol-term-note")) return false;
    var prev = rows[index - 1];
    return (
      !prev ||
      prev.classList.contains("sol-term-cmd") ||
      prev.classList.contains("sol-term-note")
    );
  }
  /**
   * Status while a step runs. It only moves forward: a transaction step says
   * "Sending transaction…", then "Confirming…" from halfway through the first
   * wait to the end of the step.
   */
  function pendingText(root, step, st) {
    var kind = step.getAttribute("data-pending") || "call";
    return label(root, kind === "tx" && st.confirming ? "confirming" : kind);
  }

  function scrollScreen(root) {
    var screen = root.querySelector(".sol-term-screen");
    if (screen && screen.scrollHeight > screen.clientHeight)
      screen.scrollTop = screen.scrollHeight;
  }

  function finishStep(key, st, root, i) {
    var steps = stepsOf(root);
    st.durs[i] = Date.now() - st.t0;
    st.confirming = false;
    st.done = i + 1;
    st.cur = -1;
    var finished = st.done >= st.total;
    var step = steps[i];
    var summary = step ? badgesText(step) : "";
    var multi = st.total > 1;
    // Under reduced motion the output appears at once, so a sub-second total
    // for several transactions would read as fake: show just "Done".
    st.status = finished
      ? reducedMotion()
        ? label(root, "done")
        : label(root, "done") +
          " · " +
          seconds(
            st.durs.reduce(function (sum, d) {
              return sum + (d || 0);
            }, 0),
          )
      : label(root, "step") +
        " " +
        st.done +
        "/" +
        st.total +
        " · " +
        label(root, "done");
    applyTerm(root, st);
    announce(
      root,
      (multi ? label(root, "step") + " " + st.done + ": " : "") +
        (summary || label(root, "done")),
    );
    scrollScreen(root);
    if (!finished && st.all) {
      st.chain = true;
      applyTerm(root, st);
      var g = gen;
      setTimeout(
        function () {
          if (g !== gen) return;
          st.chain = false;
          startStep(key, st.done);
        },
        reducedMotion() ? 0 : 450,
      );
    }
  }

  function startStep(key, i) {
    var st = terms[key];
    var root = termRoot(key);
    if (!st || !root) return;
    var step = stepsOf(root)[i];
    if (!step) return;
    var rows = rowsOf(step);
    st.cur = i;
    st.t0 = Date.now();
    st.shown = leadOf(step);
    st.confirming = false;
    st.status = pendingText(root, step, st);
    applyTerm(root, st);
    announce(root, st.status);

    if (reducedMotion()) {
      st.shown = rows.length;
      finishStep(key, st, root, i);
      return;
    }
    var g = gen;
    (function tick() {
      if (g !== gen) return;
      var r = termRoot(key);
      if (!r) return; // navigated away
      var s = stepsOf(r)[i];
      var rs = rowsOf(s);
      if (st.shown >= rs.length) {
        setTimeout(function () {
          if (g !== gen) return;
          var r2 = termRoot(key);
          if (r2) finishStep(key, st, r2, i);
        }, 150);
        return;
      }
      var wait = delayFor(s, rs, st.shown);
      st.status = pendingText(r, s, st);
      setText(r.querySelector(".sol-term-status"), st.status);
      if (
        isSlow(rs, st.shown) &&
        !st.confirming &&
        s.getAttribute("data-pending") === "tx"
      )
        // Sent; the rest of the wait is the confirmation.
        setTimeout(function () {
          if (g !== gen || st.cur !== i) return;
          st.confirming = true;
          st.status = pendingText(r, s, st);
          var r4 = termRoot(key);
          if (r4) setText(r4.querySelector(".sol-term-status"), st.status);
        }, wait / 2);
      setTimeout(function () {
        if (g !== gen) return;
        st.shown++;
        var r3 = termRoot(key);
        if (!r3) return;
        applyTerm(r3, st);
        scrollScreen(r3);
        tick();
      }, wait);
    })();
  }

  function termAction(root, act, button) {
    var key = termKey(root);
    if (!key) return;
    var st = terms[key] || (terms[key] = freshState(root));
    if (act === "copy") return copyOutput(root, button);
    if (st.cur >= 0 || st.chain) return; // already running
    if (st.done >= st.total) {
      // Run again: back to the empty prompt, then run step 1.
      gen++;
      st = terms[key] = freshState(root);
      st.all = act === "all";
      applyTerm(root, st);
      root.querySelector(".sol-term-screen").scrollTop = 0;
      startStep(key, 0);
      return;
    }
    st.all = act === "all";
    if (act === "all" && button && document.activeElement === button) {
      // The Run all button hides while running; keep focus on the panel.
      var run = root.querySelector('.sol-term-btn[data-act="run"]');
      if (run) run.focus();
    }
    startStep(key, st.done);
  }

  // Copy: full values (title) instead of the shortened ones.
  function plainText(node) {
    var out = "";
    for (var c = node.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) out += c.nodeValue;
      else if (c.nodeType === 1) {
        if (c.classList.contains("sol-h-s")) continue;
        if (c.classList.contains("sol-h")) out += c.getAttribute("title") || "";
        else out += plainText(c);
      }
    }
    return out;
  }
  function screenText(root) {
    var rows = root.querySelectorAll(
      ".sol-term-screen .sol-term-cmd, .sol-term-screen .sol-term-ln",
    );
    var lines = [];
    for (var i = 0; i < rows.length; i++) {
      var ind = Number(rows[i].getAttribute("data-indent") || 0);
      lines.push(new Array(ind + 1).join(" ") + plainText(rows[i]));
    }
    return lines.join("\n");
  }
  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(text);
    return Promise.reject(new Error("no clipboard"));
  }
  function flash(el, root) {
    setAttr(el, "data-copied", label(root, "copied"));
    clearTimeout(el.__solCopied);
    el.__solCopied = setTimeout(function () {
      el.removeAttribute("data-copied");
    }, 1400);
  }
  function copyOutput(root, button) {
    writeClipboard(screenText(root)).then(
      function () {
        flash(button, root);
        announce(root, label(root, "copied"));
      },
      function () {},
    );
  }
  function copyValue(h) {
    var root = h.closest(".sol-term");
    writeClipboard(h.getAttribute("title") || "").then(
      function () {
        if (root) {
          flash(h, root);
          announce(root, label(root, "copied"));
        }
      },
      function () {},
    );
  }

  var pending = false;
  function reapply() {
    pending = false;
    var list = keyed(TERM, "data-term");
    for (var i = 0; i < list.length; i++)
      applyTerm(list[i].el, terms[list[i].key] || freshState(list[i].el));
    list = keyed(BOX, "data-run");
    for (var j = 0; j < list.length; j++) {
      var box = list[j].el;
      ensureAria(box);
      if (box.hasAttribute("data-state")) continue;
      var record = finished[list[j].key];
      if (record) applyDone(box, record);
    }
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(reapply);
  }
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return;
    var h = target.closest(".sol-term .sol-h");
    if (h) {
      copyValue(h);
      return;
    }
    var act = target.closest(".sol-term [data-act]");
    if (act) {
      var root = act.closest(".sol-term");
      if (root && !root.hasAttribute("data-norun")) {
        event.preventDefault();
        if (act.getAttribute("aria-disabled") !== "true")
          termAction(root, act.getAttribute("data-act"), act);
      }
      return;
    }
    var button = target.closest(".sol-run-btn");
    if (!button) return;
    var box = button.closest(".sol-run");
    if (!box) return;
    event.preventDefault();
    run(box, button);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var target = event.target;
    if (!target || typeof target.closest !== "function") return;
    var h = target.closest(".sol-term .sol-h");
    if (!h) return;
    event.preventDefault();
    copyValue(h);
  });
})();
