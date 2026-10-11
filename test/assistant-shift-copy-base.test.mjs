import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { installLocalStorageStub, startViteModuleLoader } from "../test-support/vite-test-server.mjs";

installLocalStorageStub();

let utils;
let slice;
let axiosClient;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    utils: "/src/features/assistantShift/utils/copyBase.js",
    slice: "/src/features/assistantShift/store/assistantShiftSlice.js",
    axiosClient: "/src/core/api/axiosClient.js",
  });
  ({ utils, slice } = { utils: loader.modules.utils, slice: loader.modules.slice });
  axiosClient = loader.modules.axiosClient.default;
});

after(async () => {
  await loader?.close();
});

const paste = { startAt: "2026-10-11T17:00:00.000Z", endAt: "2026-10-18T16:59:59.999Z" };

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------
test("buildCopyBasePayload omits createClassSessions when the option is off", () => {
  const payload = utils.buildCopyBasePayload({
    ids: [1, 2],
    paste,
    copyAssignments: true,
    copyAssignmentAttendanceStatus: false,
  });

  assert.deepEqual(payload, {
    ids: [1, 2],
    startPasteAt: paste.startAt,
    endPasteAt: paste.endAt,
    copyAssignments: true,
    copyAssignmentAttendanceStatus: false,
  });
  assert.equal("createClassSessions" in payload, false);
});

test("buildCopyBasePayload sends createClassSessions only when it is on", () => {
  const base = { ids: [1], paste, copyAssignments: true, copyAssignmentAttendanceStatus: true };

  assert.equal(utils.buildCopyBasePayload({ ...base, createClassSessions: true }).createClassSessions, true);
  assert.equal("createClassSessions" in utils.buildCopyBasePayload({ ...base, createClassSessions: false }), false);
});

// ---------------------------------------------------------------------------
// Selection summary
// ---------------------------------------------------------------------------
test("countSelectedShiftsByClass counts only the selected shifts, split by whether they have a class", () => {
  const shifts = [
    { assistantShiftId: 1, classId: 10 },
    { assistantShiftId: 2, classId: null },
    { assistantShiftId: 3, classId: 12 },
    { assistantShiftId: 4, classId: null },
  ];

  assert.deepEqual(utils.countSelectedShiftsByClass(shifts, new Set([1, 2, 3])), { withClass: 2, withoutClass: 1 });
  assert.deepEqual(utils.countSelectedShiftsByClass(shifts, new Set()), { withClass: 0, withoutClass: 0 });
  assert.deepEqual(utils.countSelectedShiftsByClass(shifts, new Set([2, 4])), { withClass: 0, withoutClass: 2 });
});

// ---------------------------------------------------------------------------
// Result message
// ---------------------------------------------------------------------------
test("formatCopyBaseResultMessage reports only shifts when sessions were not requested", () => {
  assert.equal(
    utils.formatCopyBaseResultMessage({ copiedShiftCount: 3, copiedAssignmentCount: 5 }),
    "Đã tạo 3 ca trợ giảng.",
  );
  assert.equal(utils.formatCopyBaseResultMessage(undefined), "Đã tạo 0 ca trợ giảng.");
});

test("formatCopyBaseResultMessage reports created sessions and lists only non-zero skips", () => {
  assert.equal(
    utils.formatCopyBaseResultMessage({
      copiedShiftCount: 3,
      createdSessionCount: 2,
      skippedExistingSessionCount: 0,
      skippedNoClassCount: 1,
      skippedEndedCourseCount: 0,
    }),
    "Đã tạo 3 ca, 2 buổi học. Bỏ qua: 1 ca chưa gắn lớp.",
  );
  assert.equal(
    utils.formatCopyBaseResultMessage({
      copiedShiftCount: 2,
      createdSessionCount: 2,
      skippedExistingSessionCount: 0,
      skippedNoClassCount: 0,
      skippedEndedCourseCount: 0,
    }),
    "Đã tạo 2 ca, 2 buổi học.",
  );
  assert.equal(
    utils.formatCopyBaseResultMessage({
      copiedShiftCount: 4,
      createdSessionCount: 1,
      skippedExistingSessionCount: 2,
      skippedNoClassCount: 1,
      skippedEndedCourseCount: 1,
    }),
    "Đã tạo 4 ca, 1 buổi học. Bỏ qua: 2 buổi đã có, 1 ca chưa gắn lớp, 1 lớp đã kết thúc.",
  );
});

// ---------------------------------------------------------------------------
// Thunk wiring
// ---------------------------------------------------------------------------
const runCopyThunk = async (response) => {
  const dispatched = [];
  const original = axiosClient.post;
  const calls = [];
  axiosClient.post = (...args) => {
    calls.push(args);
    return Promise.resolve(response);
  };

  try {
    const action = await slice.copyAssistantBaseShiftAsync({ ids: [1], createClassSessions: true })(
      (item) => dispatched.push(item),
      () => ({}),
      undefined,
    );
    return { action, dispatched, calls };
  } finally {
    axiosClient.post = original;
  }
};

test("copyAssistantBaseShiftAsync posts to base/copy and toasts the session summary", async () => {
  const { action, dispatched, calls } = await runCopyThunk({
    data: {
      success: true,
      data: {
        copiedShiftCount: 2,
        copiedAssignmentCount: 0,
        createdSessionCount: 1,
        skippedExistingSessionCount: 1,
        skippedNoClassCount: 0,
        skippedEndedCourseCount: 0,
      },
    },
  });

  assert.equal(action.type, "assistantShift/copyBase/fulfilled");
  assert.deepEqual(calls, [["/assistant-shifts/base/copy", { ids: [1], createClassSessions: true }]]);

  const toast = dispatched.find((item) => item?.payload?.type === "success")?.payload;
  assert.equal(toast.title, "Đã sao chép ca cơ sở");
  assert.equal(toast.message, "Đã tạo 2 ca, 1 buổi học. Bỏ qua: 1 buổi đã có.");
});

test("copyAssistantBaseShiftAsync keeps the plain message when the server did not create sessions", async () => {
  const { dispatched } = await runCopyThunk({
    data: { success: true, data: { copiedShiftCount: 2, copiedAssignmentCount: 1 } },
  });

  const toast = dispatched.find((item) => item?.payload?.type === "success")?.payload;
  assert.equal(toast.message, "Đã tạo 2 ca trợ giảng.");
});
