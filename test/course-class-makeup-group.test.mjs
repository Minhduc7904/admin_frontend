import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { installLocalStorageStub, startViteModuleLoader } from "../test-support/vite-test-server.mjs";

installLocalStorageStub();

let slice;
let utils;
let axiosClient;
let courseClassApi;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    slice: "/src/features/courseClass/store/courseClassSlice.js",
    utils: "/src/features/courseClass/utils/makeupGroup.js",
    axiosClient: "/src/core/api/axiosClient.js",
    courseClassApi: "/src/core/api/courseClassApi.js",
  });
  ({ slice, utils, axiosClient, courseClassApi } = {
    slice: loader.modules.slice,
    utils: loader.modules.utils,
    axiosClient: loader.modules.axiosClient.default,
    courseClassApi: loader.modules.courseClassApi.courseClassApi,
  });
});

after(async () => {
  await loader?.close();
});

const candidate = (classId, overrides = {}) => ({
  classId,
  className: `Lớp ${classId}`,
  weeklySchedule: "Thứ 4 - 18:00",
  startDate: "2026-09-01",
  endDate: "2027-05-31",
  room: "P402",
  instructorName: "Thầy Ngọc",
  selected: false,
  isExpired: false,
  disabled: false,
  disabledReason: null,
  ...overrides,
});

const CLASS_ID = 151;
const GET_REQUEST = "get-1";
const GROUP_ID = 3;

const serverData = (candidates) => ({
  success: true,
  message: "ok",
  data: { sourceClassId: CLASS_ID, courseId: 20, groupId: GROUP_ID, candidates },
});

const reduce = (state, action) => slice.default(state, action);

// Trạng thái đã tải: 152 cùng nhóm, 153 cùng nhóm nhưng hết hạn, 154 hết hạn chưa chọn (disabled),
// 155 đang ở nhóm khác (disabled), 156 tự do.
const loadedState = () => {
  const candidates = [
    candidate(152, { selected: true }),
    candidate(153, { selected: true, isExpired: true }),
    candidate(154, { isExpired: true, disabled: true, disabledReason: "Lớp đã kết thúc" }),
    candidate(155, { disabled: true, disabledReason: "Đã thuộc nhóm học bù khác: Lớp 160, Lớp 161" }),
    candidate(156),
  ];
  let state = reduce(undefined, { type: "@@init" });
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending(GET_REQUEST, CLASS_ID));
  state = reduce(
    state,
    slice.getCourseClassMakeupGroupAsync.fulfilled(serverData(candidates), GET_REQUEST, CLASS_ID),
  );
  return state;
};

test("loads makeup options and derives the selected set from the server response", () => {
  const state = loadedState();

  assert.equal(state.loadingGetMakeupGroup, false);
  assert.equal(state.makeupSourceClassId, CLASS_ID);
  assert.equal(state.makeupGroupId, GROUP_ID);
  assert.deepEqual(state.selectedMakeupClassIds, [152, 153]);
  assert.deepEqual(state.savedMakeupClassIds, [152, 153]);
  assert.equal(state.isMakeupDirty, false);
  assert.equal(state.makeupCandidates.length, 5);
  assert.equal(state.makeupError, null);
});

test("shows loading while fetching and clears the previous class data", () => {
  let state = loadedState();
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending("get-2", 999));

  assert.equal(state.loadingGetMakeupGroup, true);
  assert.equal(state.makeupSourceClassId, 999);
  assert.deepEqual(state.makeupCandidates, []);
  assert.deepEqual(state.selectedMakeupClassIds, []);
});

test("ignores a stale get response after the class changed", () => {
  let state = reduce(undefined, { type: "@@init" });
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending("old", 1));
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending("new", 2));
  state = reduce(
    state,
    slice.getCourseClassMakeupGroupAsync.fulfilled(serverData([candidate(9, { selected: true })]), "old", 1),
  );

  assert.equal(state.loadingGetMakeupGroup, true);
  assert.deepEqual(state.makeupCandidates, []);

  state = reduce(state, slice.getCourseClassMakeupGroupAsync.rejected(null, "old", 1, "boom"));
  assert.equal(state.makeupError, null);
});

test("stores a readable error when loading fails", () => {
  let state = reduce(undefined, { type: "@@init" });
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending(GET_REQUEST, CLASS_ID));
  state = reduce(
    state,
    slice.getCourseClassMakeupGroupAsync.rejected(null, GET_REQUEST, CLASS_ID, "Không tải được"),
  );

  assert.equal(state.loadingGetMakeupGroup, false);
  assert.equal(state.makeupError, "Không tải được");
});

test("selecting and unselecting toggles the dirty flag against the saved set", () => {
  let state = loadedState();

  state = reduce(state, slice.toggleMakeupClass(156));
  assert.deepEqual(state.selectedMakeupClassIds, [152, 153, 156]);
  assert.equal(state.isMakeupDirty, true);

  state = reduce(state, slice.toggleMakeupClass(156));
  assert.deepEqual(state.selectedMakeupClassIds, [152, 153]);
  assert.equal(state.isMakeupDirty, false);
});

test("does not allow adding an expired candidate or a candidate that belongs to another group", () => {
  let state = loadedState();

  state = reduce(state, slice.toggleMakeupClass(154));
  state = reduce(state, slice.toggleMakeupClass(155));

  assert.deepEqual(state.selectedMakeupClassIds, [152, 153]);
  assert.equal(state.isMakeupDirty, false);
});

test("allows unselecting an expired class that is already selected", () => {
  let state = loadedState();

  state = reduce(state, slice.toggleMakeupClass(153));

  assert.deepEqual(state.selectedMakeupClassIds, [152]);
  assert.equal(state.isMakeupDirty, true);
});

test("ignores toggling an unknown class and toggling while saving", () => {
  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(12345));
  assert.equal(state.isMakeupDirty, false);

  state = reduce(state, slice.toggleMakeupClass(156));
  state = reduce(
    state,
    slice.updateCourseClassMakeupGroupAsync.pending("upd", { classId: CLASS_ID, makeupClassIds: [152, 153, 156] }),
  );
  state = reduce(state, slice.toggleMakeupClass(152));

  assert.deepEqual(state.selectedMakeupClassIds, [152, 153, 156]);
});

test("reset restores the saved selection without aliasing it", () => {
  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(156));
  state = reduce(state, slice.resetMakeupSelection());

  assert.deepEqual(state.selectedMakeupClassIds, [152, 153]);
  assert.equal(state.isMakeupDirty, false);

  state = reduce(state, slice.toggleMakeupClass(156));
  assert.deepEqual(state.savedMakeupClassIds, [152, 153]);
  assert.equal(state.isMakeupDirty, true);
});

test("saving uses its own loading flag and leaves the class update flag alone", () => {
  let state = loadedState();
  state = reduce(
    state,
    slice.updateCourseClassMakeupGroupAsync.pending("upd", { classId: CLASS_ID, makeupClassIds: [152] }),
  );

  assert.equal(state.loadingUpdateMakeupGroup, true);
  assert.equal(state.loadingUpdate, false);
  assert.equal(state.loadingGet, false);
});

test("a successful save adopts the server response and resets the dirty state", () => {
  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(156));
  const arg = { classId: CLASS_ID, makeupClassIds: [152, 153, 156] };
  state = reduce(state, slice.updateCourseClassMakeupGroupAsync.pending("upd", arg));
  state = reduce(
    state,
    slice.updateCourseClassMakeupGroupAsync.fulfilled(
      serverData([
        candidate(152, { selected: true }),
        candidate(153, { selected: true, isExpired: true }),
        candidate(156, { selected: true }),
      ]),
      "upd",
      arg,
    ),
  );

  assert.equal(state.loadingUpdateMakeupGroup, false);
  assert.deepEqual(state.selectedMakeupClassIds, [152, 153, 156]);
  assert.deepEqual(state.savedMakeupClassIds, [152, 153, 156]);
  assert.equal(state.isMakeupDirty, false);
  assert.equal(state.makeupGroupId, GROUP_ID);
  assert.equal(state.makeupError, null);
});

test("saving an empty selection adopts the response where the class has no group", () => {
  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(152));
  state = reduce(state, slice.toggleMakeupClass(153));
  const arg = { classId: CLASS_ID, makeupClassIds: [] };
  state = reduce(state, slice.updateCourseClassMakeupGroupAsync.pending("upd", arg));
  state = reduce(
    state,
    slice.updateCourseClassMakeupGroupAsync.fulfilled(
      { success: true, message: "ok", data: { sourceClassId: CLASS_ID, courseId: 20, groupId: null, candidates: [candidate(152), candidate(153)] } },
      "upd",
      arg,
    ),
  );

  assert.equal(state.makeupGroupId, null);
  assert.deepEqual(state.selectedMakeupClassIds, []);
  assert.deepEqual(state.savedMakeupClassIds, []);
  assert.equal(state.isMakeupDirty, false);
});

test("a failed save keeps the edited selection, stays dirty and shows the backend error", () => {
  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(156));
  const arg = { classId: CLASS_ID, makeupClassIds: [152, 153, 156] };
  state = reduce(state, slice.updateCourseClassMakeupGroupAsync.pending("upd", arg));
  state = reduce(
    state,
    slice.updateCourseClassMakeupGroupAsync.rejected(
      null,
      "upd",
      arg,
      "Không thể lưu nhóm lớp học bù",
    ),
  );

  assert.equal(state.loadingUpdateMakeupGroup, false);
  assert.deepEqual(state.selectedMakeupClassIds, [152, 153, 156]);
  assert.equal(state.isMakeupDirty, true);
  assert.match(state.makeupError, /Không thể lưu/);
});

test("a save response for a previous class is dropped but clears the saving flag", () => {
  let state = loadedState();
  const arg = { classId: CLASS_ID, makeupClassIds: [152] };
  state = reduce(state, slice.updateCourseClassMakeupGroupAsync.pending("upd", arg));
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending("get-other", 999));
  state = reduce(
    state,
    slice.updateCourseClassMakeupGroupAsync.fulfilled(serverData([candidate(152, { selected: true })]), "upd", arg),
  );

  assert.equal(state.loadingUpdateMakeupGroup, false);
  assert.equal(state.makeupSourceClassId, 999);
  assert.deepEqual(state.makeupCandidates, []);
});

test("clears makeup state on logout and on explicit clear", () => {
  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(156));

  const afterLogout = reduce(state, { type: "auth/logout/fulfilled" });
  assert.deepEqual(afterLogout.makeupCandidates, []);
  assert.deepEqual(afterLogout.selectedMakeupClassIds, []);
  assert.equal(afterLogout.isMakeupDirty, false);
  assert.equal(afterLogout.makeupSourceClassId, null);
  assert.equal(afterLogout.makeupGroupId, null);

  const afterClear = reduce(state, slice.clearMakeupGroup());
  assert.deepEqual(afterClear.makeupCandidates, []);
  assert.equal(afterClear.isMakeupDirty, false);
});

test("search ignores case and Vietnamese diacritics and matches class name only", () => {
  const candidates = [
    candidate(1, { className: "Đại 1 lớp 12B", room: "Toán" }),
    candidate(2, { className: "Hình học 11A" }),
  ];

  assert.deepEqual(utils.filterMakeupCandidates(candidates, "dai 1").map((item) => item.classId), [1]);
  assert.deepEqual(utils.filterMakeupCandidates(candidates, "HINH HOC").map((item) => item.classId), [2]);
  assert.deepEqual(utils.filterMakeupCandidates(candidates, "toan").map((item) => item.classId), []);
  assert.equal(utils.filterMakeupCandidates(candidates, "   "), candidates);
});

test("treats id lists as sets and formats date-only strings without timezone shifts", () => {
  assert.equal(utils.isSameIdSet([1, 2, 3], [3, 1, 2]), true);
  assert.equal(utils.isSameIdSet([1, 2], [1, 2, 3]), false);
  assert.equal(utils.isSameIdSet([1, 2], [1, 4]), false);

  assert.equal(utils.formatMakeupDate("2026-09-01"), "01/09/2026");
  assert.equal(utils.formatMakeupDate(null), null);
  assert.equal(utils.formatMakeupDateRange("2026-09-01", "2027-05-31"), "01/09/2026 - 31/05/2027");
  assert.equal(utils.formatMakeupDateRange("2026-09-01", null), "Từ 01/09/2026");
  assert.equal(utils.formatMakeupDateRange(null, "2027-05-31"), "Đến 31/05/2027");
  assert.equal(utils.formatMakeupDateRange(null, null), null);
});

// ---------------------------------------------------------------------------
// API paths: only /makeup-group exists; the legacy /makeup-options path must not be used anywhere.
// ---------------------------------------------------------------------------
const withRecordedClient = async (run) => {
  const calls = [];
  const original = { get: axiosClient.get, put: axiosClient.put, post: axiosClient.post, delete: axiosClient.delete };
  for (const method of Object.keys(original)) {
    axiosClient[method] = (...args) => {
      calls.push({ method, args });
      return Promise.resolve({ data: { success: true } });
    };
  }
  try {
    await run();
  } finally {
    Object.assign(axiosClient, original);
  }
  return calls;
};

test("getMakeupGroup and updateMakeupGroup call the makeup-group endpoints", async () => {
  const calls = await withRecordedClient(async () => {
    await courseClassApi.getMakeupGroup(151);
    await courseClassApi.updateMakeupGroup(151, { makeupClassIds: [152, 153] });
  });

  assert.deepEqual(calls, [
    { method: "get", args: ["/course-classes/151/makeup-group"] },
    { method: "put", args: ["/course-classes/151/makeup-group", { makeupClassIds: [152, 153] }] },
  ]);
  assert.ok(!calls.some((call) => JSON.stringify(call).includes("makeup-options")));
  assert.equal(courseClassApi.getMakeupOptions, undefined);
  assert.equal(courseClassApi.updateMakeupOptions, undefined);
});

test("the legacy makeup-options path no longer exists in the source tree", () => {
  const offenders = [];
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) visit(path);
      else if (/\.(js|jsx)$/.test(name) && /makeup-options|MAKEUP_OPTIONS/.test(readFileSync(path, "utf8"))) {
        offenders.push(path);
      }
    }
  };
  visit(new URL("../src", import.meta.url).pathname);

  assert.deepEqual(offenders, []);
});

// ---------------------------------------------------------------------------
// Save payload and conflict handling
// ---------------------------------------------------------------------------
test("the save payload sends the whole selected set, de-duplicated and sorted, and [] to dissolve", () => {
  assert.deepEqual(utils.buildMakeupGroupPayload([153, 152, 153]), { makeupClassIds: [152, 153] });
  assert.deepEqual(utils.buildMakeupGroupPayload([]), { makeupClassIds: [] });
});

test("recognises a 409 or the conflict code as a makeup group conflict", () => {
  assert.equal(utils.isMakeupGroupConflictError({ response: { status: 409 } }), true);
  assert.equal(
    utils.isMakeupGroupConflictError({ response: { status: 400, data: { code: "COURSE_CLASS_MAKEUP_GROUP_CONFLICT" } } }),
    true,
  );
  assert.equal(utils.isMakeupGroupConflictError({ response: { status: 500 } }), false);
  assert.equal(utils.isMakeupGroupConflictError(new Error("network")), false);
});

test("a 409 on save becomes a conflict state that keeps the edited selection until reload", async () => {
  const dispatched = [];
  const conflictError = Object.assign(new Error("Request failed"), {
    response: { status: 409, data: { code: "COURSE_CLASS_MAKEUP_GROUP_CONFLICT", message: "technical backend text" } },
  });

  const originalPut = axiosClient.put;
  axiosClient.put = () => Promise.reject(conflictError);
  let action;
  try {
    action = await slice.updateCourseClassMakeupGroupAsync({ classId: CLASS_ID, makeupClassIds: [152, 156] })(
      (value) => dispatched.push(value),
      () => ({}),
      undefined,
    );
  } finally {
    axiosClient.put = originalPut;
  }

  assert.equal(action.type, "courseClass/updateMakeupGroup/rejected");
  assert.equal(action.payload, utils.MAKEUP_GROUP_CONFLICT_MESSAGE);

  let state = loadedState();
  state = reduce(state, slice.toggleMakeupClass(156));
  state = reduce(state, action);

  assert.equal(state.makeupConflict, true);
  assert.equal(state.makeupError, utils.MAKEUP_GROUP_CONFLICT_MESSAGE);
  assert.deepEqual(state.selectedMakeupClassIds, [152, 153, 156]);
  assert.equal(state.isMakeupDirty, true);

  // Reloading adopts the server state and clears the conflict.
  state = reduce(state, slice.getCourseClassMakeupGroupAsync.pending("reload", CLASS_ID));
  assert.equal(state.makeupConflict, false);
  assert.equal(state.makeupError, null);
});

test("other save errors are not reported as conflicts", () => {
  let state = loadedState();
  const arg = { classId: CLASS_ID, makeupClassIds: [152] };
  state = reduce(state, slice.updateCourseClassMakeupGroupAsync.pending("upd", arg));
  state = reduce(state, slice.updateCourseClassMakeupGroupAsync.rejected(null, "upd", arg, "Lớp không tồn tại"));

  assert.equal(state.makeupConflict, false);
  assert.equal(state.makeupError, "Lớp không tồn tại");
});

test("candidate mapping keeps the server fields and exposes the saved baseline", () => {
  const state = loadedState();
  const byId = Object.fromEntries(state.makeupCandidates.map((item) => [item.classId, item]));

  assert.equal(byId[154].disabled, true);
  assert.equal(byId[154].disabledReason, "Lớp đã kết thúc");
  assert.equal(byId[155].disabledReason, "Đã thuộc nhóm học bù khác: Lớp 160, Lớp 161");
  assert.deepEqual(utils.getSelectedClassIds(state.makeupCandidates), [152, 153]);
  assert.deepEqual(slice.selectSavedMakeupClassIds({ courseClass: state }), [152, 153]);
});
