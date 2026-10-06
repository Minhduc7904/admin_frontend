import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createServer } from "vite";

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

let slice;
let utils;
let vite;

before(async () => {
  vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    server: { hmr: false, middlewareMode: true },
  });

  slice = await vite.ssrLoadModule("/src/features/courseClass/store/courseClassSlice.js");
  utils = await vite.ssrLoadModule("/src/features/courseClass/utils/makeupGroup.js");
});

after(async () => {
  await vite?.close();
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
