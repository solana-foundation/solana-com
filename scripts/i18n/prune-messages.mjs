#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const messagesRoot = path.join(repoRoot, "packages/i18n/messages");

const appConfig = {
  media: {
    inherits: ["web"],
    removePaths: [
      "footer.solana.break",
      "universities.hackathon.timeline.events.registration.date",
      "universities.hackathon.timeline.events.kickoff.date",
      "universities.hackathon.timeline.events.building.date",
      "universities.hackathon.timeline.events.submission.date",
      "universities.hackathon.timeline.events.winners.date",
      "universities.hackathon.timeline.events.winners.description",
      "universities.hackathon.prizes.part2Description",
      "icm.hero.stats.2.value",
      "icm.hero.stats.2.label",
      "consumer.hero.stats.3.value",
      "consumer.hero.stats.3.label",
    ],
  },
  accelerate: {
    inherits: [],
    removePaths: [
      "accelerate.miami.getInvolved.press",
      "accelerate.miami.nav.agenda",
      "accelerate.eventDetails.ticketsLabel",
      "accelerate.eventDetails.ticketsValue",
      "accelerate.miami.eventDetails.ticketsLabel",
      "accelerate.miami.eventDetails.ticketsValue",
      "accelerate.gettingThere.viewDetailsHere",
      "accelerate.gettingThere.nomadzValue",
      "accelerate.gettingThere.nomadzSubValue",
      "accelerate.gettingThere.nomadzLink",
    ],
  },
  web: {
    inherits: [],
    removePaths: ["breakpoint", "environment", "format", "podcast"],
  },
};

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override;
  }

  const result = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function deletePath(target, dottedPath) {
  const parts = dottedPath.split(".");
  const last = parts.pop();
  if (!last) return;

  let current = target;
  for (const part of parts) {
    if (!isPlainObject(current?.[part])) {
      return;
    }
    current = current[part];
  }

  if (isPlainObject(current)) {
    delete current[last];
  }
}

function pruneEmpty(value) {
  if (Array.isArray(value)) {
    const next = value.map(pruneEmpty);
    return next;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const next = {};
  for (const [key, child] of Object.entries(value)) {
    const prunedChild = pruneEmpty(child);
    if (isPlainObject(prunedChild) && Object.keys(prunedChild).length === 0) {
      continue;
    }
    next[key] = prunedChild;
  }

  return next;
}

function dedupeAgainstBase(local, base) {
  if (!isPlainObject(local) || !isPlainObject(base)) {
    return JSON.stringify(local) === JSON.stringify(base) ? undefined : local;
  }

  const next = {};

  for (const [key, localValue] of Object.entries(local)) {
    const dedupedValue = dedupeAgainstBase(localValue, base[key]);

    if (dedupedValue !== undefined) {
      next[key] = dedupedValue;
    }
  }

  return Object.keys(next).length > 0 ? next : undefined;
}

function getLocales(app) {
  const appDir = path.join(messagesRoot, app);
  return readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function loadInheritedMessages(app, locale) {
  return appConfig[app].inherits.reduce((acc, inheritedApp) => {
    const inheritedPath = path.join(
      messagesRoot,
      inheritedApp,
      locale,
      "common.json",
    );

    if (!existsSync(inheritedPath)) {
      return acc;
    }

    return deepMerge(acc, loadJson(inheritedPath));
  }, {});
}

for (const app of Object.keys(appConfig)) {
  for (const locale of getLocales(app)) {
    const filePath = path.join(messagesRoot, app, locale, "common.json");
    const local = loadJson(filePath);

    for (const dottedPath of appConfig[app].removePaths) {
      deletePath(local, dottedPath);
    }

    const base = loadInheritedMessages(app, locale);
    const deduped = dedupeAgainstBase(pruneEmpty(local), base) ?? {};

    writeFileSync(filePath, `${JSON.stringify(deduped, null, 2)}\n`);
  }
}
