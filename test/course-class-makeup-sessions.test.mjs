import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { installLocalStorageStub, startViteModuleLoader } from "../test-support/vite-test-server.mjs";

installLocalStorageStub();

let utils;
let axiosClient;
let courseClassApi;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    utils: "/src/features/courseClass/utils/makeupSessions.js",
    axiosClient: "/src/core/api/axiosClient.js",
    courseClassApi: "/src/core/api/courseClassApi.js",
  });
  utils = loader.modules.utils;
  axiosClient = loader.modules.axiosClient.default;
  courseClassApi = loader.modules.courseClassApi.courseClassApi;
});

after(async () => {
  await loader?.close();
});

// ---------------------------------------------------------------------------
// Week arithmetic
// ---------------------------------------------------------------------------
test("getWeekStart returns the Monday of the week for every weekday, including Sunday", () => {
  // 12/10/2026 is a Monday.
  assert.equal(utils.getWeekStart(new Date(2026, 9, 12)), "2026-10-12");
  assert.equal(utils.getWeekStart(new Date(2026, 9, 14, 23, 59)), "2026-10-12");
  assert.equal(utils.getWeekStart(new Date(2026, 9, 18)), "2026-10-12");
  assert.equal(utils.getWeekStart(new Date(2026, 9, 19)), "2026-10-19");
});

test("getWeekStart crosses month and year boundaries", () => {
  assert.equal(utils.getWeekStart(new Date(2026, 10, 1)), "2026-10-26"); // Sunday 1/11/2026
  assert.equal(utils.getWeekStart(new Date(2027, 0, 1)), "2026-12-28"); // Friday 1/1/2027
});

test("shiftWeek moves by whole weeks and keeps the result a Monday across month, year and leap boundaries", () => {
  assert.equal(utils.shiftWeek("2026-10-12", 1), "2026-10-19");
  assert.equal(utils.shiftWeek("2026-10-12", -1), "2026-10-05");
  assert.equal(utils.shiftWeek("2026-10-26", 1), "2026-11-02");
  assert.equal(utils.shiftWeek("2026-12-28", 1), "2027-01-04");
  assert.equal(utils.shiftWeek("2028-02-28", 1), "2028-03-06"); // 2028 is a leap year
  assert.equal(utils.shiftWeek("2026-10-12", 0), "2026-10-12");
});

test("shiftWeek leaves an invalid week start untouched", () => {
  assert.equal(utils.shiftWeek("not-a-date", 1), "not-a-date");
});

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
test("formatWeekRange shows Monday to Sunday with the year of the Sunday", () => {
  assert.equal(utils.formatWeekRange("2026-10-12"), "12/10 – 18/10/2026");
  assert.equal(utils.formatWeekRange("2026-12-28"), "28/12 – 03/01/2027");
  assert.equal(utils.formatWeekRange(""), "");
});

test("formatSessionDay labels the weekday from the date-only string without timezone drift", () => {
  assert.equal(utils.formatSessionDay("2026-10-12"), "T2 12/10");
  assert.equal(utils.formatSessionDay("2026-10-13"), "T3 13/10");
  assert.equal(utils.formatSessionDay("2026-10-18"), "CN 18/10");
  assert.equal(utils.formatSessionDay(null), "");
  assert.equal(utils.formatSessionDay("13/10/2026"), "");
});

// ---------------------------------------------------------------------------
// Response normalisation
// ---------------------------------------------------------------------------
test("normalizeMakeupSessions always returns arrays and a null group when the class has none", () => {
  assert.deepEqual(utils.normalizeMakeupSessions(undefined), {
    groupId: null,
    weekStart: null,
    weekEnd: null,
    sessions: [],
  });

  const normalized = utils.normalizeMakeupSessions({
    groupId: 5,
    weekStart: "2026-10-12",
    weekEnd: "2026-10-18",
    sessions: [{ sessionId: 1 }, { sessionId: 2, makeupCandidates: [{ sessionId: 3 }] }],
  });

  assert.equal(normalized.groupId, 5);
  assert.deepEqual(normalized.sessions[0].makeupCandidates, []);
  assert.deepEqual(normalized.sessions[1].makeupCandidates, [{ sessionId: 3 }]);
});

// ---------------------------------------------------------------------------
// API wiring
// ---------------------------------------------------------------------------
test("getMakeupSessions calls the makeup-sessions endpoint with the weekStart query", async () => {
  const calls = [];
  const original = axiosClient.get;
  axiosClient.get = (...args) => {
    calls.push(args);
    return Promise.resolve({ data: { success: true } });
  };

  try {
    await courseClassApi.getMakeupSessions(154, { weekStart: "2026-10-12" });
  } finally {
    axiosClient.get = original;
  }

  assert.deepEqual(calls, [["/course-classes/154/makeup-sessions", { params: { weekStart: "2026-10-12" } }]]);
});
