import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import { installLocalStorageStub, startViteModuleLoader } from "../test-support/vite-test-server.mjs";

installLocalStorageStub();

let helpers;
let slice;
let axiosClient;
let constants;
let table;
let detailInfo;
let studentTable;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    helpers: "/src/features/attendance/utils/attendanceMakeup.js",
    slice: "/src/features/attendance/store/attendanceSlice.js",
    axiosClient: "/src/core/api/axiosClient.js",
    constants: "/src/core/constants/index.js",
    table: "/src/features/attendance/components/AttendanceTable.jsx",
    detailInfo: "/src/features/attendance/components/AttendanceDetailInfo.jsx",
    studentTable: "/src/features/student/components/StudentAttendanceTable.jsx",
  });
  helpers = loader.modules.helpers;
  slice = loader.modules.slice;
  axiosClient = loader.modules.axiosClient.default;
  constants = loader.modules.constants;
  table = loader.modules.table;
  detailInfo = loader.modules.detailInfo;
  studentTable = loader.modules.studentTable;
});

after(async () => {
  await loader?.close();
});

/* ===================== helpers ===================== */

test("isMadeUpAbsence is true only for ABSENT rows that carry a makeup link", () => {
  assert.equal(helpers.isMadeUpAbsence({ status: "ABSENT", makeupByAttendanceId: 9 }), true);
  assert.equal(helpers.isMadeUpAbsence({ status: "ABSENT", isMadeUp: true }), true);
  assert.equal(helpers.isMadeUpAbsence({ status: "ABSENT", makeupByAttendanceId: null }), false);
  assert.equal(helpers.isMadeUpAbsence({ status: "ABSENT" }), false);
  assert.equal(helpers.isMadeUpAbsence({ status: "PRESENT", makeupByAttendanceId: 9 }), false);
  assert.equal(helpers.isMadeUpAbsence(null), false);
});

test("canCheckIn / canCancelCheckIn follow the status", () => {
  assert.equal(helpers.canCheckIn({ status: "ABSENT" }), true);
  assert.equal(helpers.canCheckIn({ status: "LATE" }), true);
  assert.equal(helpers.canCheckIn({ status: "PRESENT" }), false);
  assert.equal(helpers.canCheckIn(null), false);
  assert.equal(helpers.canCancelCheckIn({ status: "PRESENT" }), true);
  assert.equal(helpers.canCancelCheckIn({ status: "ABSENT" }), false);
});

test("needsMakeupConfirm only for a made-up absence being checked in", () => {
  assert.equal(helpers.needsMakeupConfirm({ status: "ABSENT", makeupByAttendanceId: 4 }), true);
  assert.equal(helpers.needsMakeupConfirm({ status: "ABSENT", makeupByAttendanceId: null }), false);
  assert.equal(helpers.needsMakeupConfirm({ status: "LATE" }), false);
  assert.equal(helpers.needsMakeupConfirm({ status: "PRESENT", makeupByAttendanceId: 4 }), false);
});

test("mergeAttendanceRow keeps old fields and lets new values win", () => {
  const merged = helpers.mergeAttendanceRow(
    { attendanceId: 1, status: "ABSENT", otherAttendancesInWeek: [{ attendanceId: 2 }] },
    { attendanceId: 1, status: "PRESENT" },
  );
  assert.equal(merged.status, "PRESENT");
  assert.deepEqual(merged.otherAttendancesInWeek, [{ attendanceId: 2 }]);
  assert.deepEqual(helpers.mergeAttendanceRow(undefined, { a: 1 }), { a: 1 });
});

test("mergeAttendanceRow merges student and classSession one level deep", () => {
  const merged = helpers.mergeAttendanceRow(
    { student: { fullName: "A", hasParentZaloId: true }, classSession: { name: "B1", makeupNote: "n", homeworkId: 3 } },
    { student: { fullName: "A2" }, classSession: { name: "B1x" } },
  );
  assert.deepEqual(merged.student, { fullName: "A2", hasParentZaloId: true });
  assert.deepEqual(merged.classSession, { name: "B1x", makeupNote: "n", homeworkId: 3 });
  assert.deepEqual(helpers.mergeAttendanceRow({ student: { a: 1 } }, { x: 1 }).student, { a: 1 });
});

test("pickDetailAttendance only trusts a fetched record for the same attendance", () => {
  const selected = { attendanceId: 1, status: "ABSENT", classSession: { name: "B1" } };
  assert.equal(helpers.pickDetailAttendance(selected, { attendanceId: 2, status: "PRESENT" }), selected);
  assert.equal(helpers.pickDetailAttendance(selected, null), selected);
  const picked = helpers.pickDetailAttendance(selected, { attendanceId: 1, status: "PRESENT", makeupBy: null });
  assert.equal(picked.status, "PRESENT");
  assert.equal(picked.classSession.name, "B1");
});

test("formatMakeupLinkLabel shows class, session, dd/MM/yyyy and the time range", () => {
  assert.equal(helpers.formatMakeupLinkDate("2026-10-09"), "09/10/2026");
  assert.equal(helpers.formatMakeupLinkDate(null), "");

  const label = helpers.formatMakeupLinkLabel({
    className: "12A",
    sessionName: "Buổi 3",
    sessionDate: "2026-10-09",
    startTime: "1970-01-01T11:00:00.000Z",
    endTime: "1970-01-01T12:30:00.000Z",
  });
  assert.equal(label, "12A - Buổi 3 • 09/10/2026 • 18:00 - 19:30");
  assert.equal(helpers.formatMakeupLinkLabel(null), "");
});

test("success messages mention the linked count only when it is positive", () => {
  assert.equal(helpers.buildCheckInSuccessMessage(2), "Đã nối 2 buổi vắng được học bù");
  assert.equal(helpers.buildCheckInSuccessMessage(0), "");
  assert.equal(helpers.getLinkedAbsenceCount({ data: { data: { linkedAbsenceCount: 3 } } }), 3);
  assert.equal(helpers.getLinkedAbsenceCount({ data: { data: {} } }), 0);
  assert.equal(helpers.getLinkedAbsenceCount(undefined), 0);
});

test("runQuickCheckIns visits every session in order and reports the failed ones", async () => {
  const calls = [];
  const sessions = [{ sessionId: 1 }, { sessionId: 2 }, { sessionId: 3 }];
  const result = await helpers.runQuickCheckIns({
    sessions,
    studentId: 9,
    checkIn: async (payload) => {
      calls.push(payload);
      if (payload.sessionId === 2) throw new Error("409");
    },
  });

  assert.deepEqual(calls, [
    { sessionId: 1, studentId: 9 },
    { sessionId: 2, studentId: 9 },
    { sessionId: 3, studentId: 9 },
  ]);
  assert.deepEqual(result.failed, [{ sessionId: 2 }]);
  assert.equal(result.succeeded, 2);
  assert.equal(result.total, 3);
});

/* ===================== API + thunks ===================== */

test("endpoints for check-in and cancel check-in", () => {
  assert.equal(constants.API_ENDPOINTS.ATTENDANCES.CHECK_IN, "/attendances/check-in");
  assert.equal(constants.API_ENDPOINTS.ATTENDANCES.CANCEL_CHECK_IN(12), "/attendances/12/cancel-check-in");
});

const runThunk = async (thunk) => {
  const dispatched = [];
  const result = await thunk((action) => dispatched.push(action), () => ({}), undefined);
  return { result, dispatched };
};

const withPost = async (response, work) => {
  const calls = [];
  const original = axiosClient.post;
  axiosClient.post = (...args) => {
    calls.push(args);
    return Promise.resolve(response);
  };
  try {
    return { calls, ...(await work()) };
  } finally {
    axiosClient.post = original;
  }
};

const notifications = (dispatched) => dispatched.filter((a) => a?.payload?.type === "success").map((a) => a.payload);

test("checkInAttendanceAsync posts { sessionId, studentId } to /attendances/check-in and toasts the linked count", async () => {
  const response = {
    data: {
      success: true,
      message: "Điểm danh thành công",
      data: { attendanceId: 5, status: "PRESENT", attendanceType: "MAKEUP", linkedAbsenceCount: 2 },
    },
  };
  const { calls, dispatched, result } = await withPost(response, () =>
    runThunk(slice.checkInAttendanceAsync({ sessionId: 3, studentId: 8 })),
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/attendances/check-in");
  assert.deepEqual(calls[0][1], { sessionId: 3, studentId: 8 });
  assert.equal(result.type, slice.checkInAttendanceAsync.fulfilled.type);
  const [toast] = notifications(dispatched);
  assert.equal(toast.title, "Điểm danh thành công");
  assert.equal(toast.message, "Đã nối 2 buổi vắng được học bù");
});

test("cancelCheckInAttendanceAsync posts to /attendances/:id/cancel-check-in without a body", async () => {
  const response = {
    data: { success: true, message: "Hủy điểm danh thành công", data: { attendanceId: 5, status: "ABSENT" } },
  };
  const { calls, dispatched, result } = await withPost(response, () =>
    runThunk(slice.cancelCheckInAttendanceAsync(5)),
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/attendances/5/cancel-check-in");
  assert.equal(calls[0][1], undefined);
  assert.equal(result.type, slice.cancelCheckInAttendanceAsync.fulfilled.type);
  const [toast] = notifications(dispatched);
  assert.equal(toast.title, "Hủy điểm danh thành công");
  assert.equal(toast.message, "");
});

test("a failed check-in rejects so callers can keep the panel open", async () => {
  const original = axiosClient.post;
  axiosClient.post = () => Promise.reject(Object.assign(new Error("x"), { response: { data: { message: "Khóa học đã kết thúc" } } }));
  let outcome;
  try {
    outcome = await runThunk(slice.checkInAttendanceAsync({ sessionId: 3, studentId: 8 }));
  } finally {
    axiosClient.post = original;
  }
  assert.equal(outcome.result.type, slice.checkInAttendanceAsync.rejected.type);
  assert.equal(outcome.result.payload, "Khóa học đã kết thúc");
});

/* ===================== reducer merge ===================== */

test("fulfilled check-in / cancel MERGE into the row and keep list-only fields", () => {
  const initial = slice.default(undefined, { type: "init" });
  const state = {
    ...initial,
    attendances: [
      {
        attendanceId: 5,
        status: "ABSENT",
        attendanceType: "REGULAR",
        otherAttendancesInWeek: [{ attendanceId: 7 }],
        tuitionPayment: { status: "PAID" },
      },
      { attendanceId: 6, status: "ABSENT" },
    ],
    currentAttendance: { attendanceId: 5, status: "ABSENT", classSession: { name: "B1" } },
  };

  const afterCheckIn = slice.default(state, {
    type: slice.checkInAttendanceAsync.fulfilled.type,
    payload: { data: { attendanceId: 5, status: "PRESENT", attendanceType: "MAKEUP", linkedAbsenceCount: 1 } },
  });
  assert.equal(afterCheckIn.attendances[0].status, "PRESENT");
  assert.equal(afterCheckIn.attendances[0].attendanceType, "MAKEUP");
  assert.deepEqual(afterCheckIn.attendances[0].otherAttendancesInWeek, [{ attendanceId: 7 }]);
  assert.deepEqual(afterCheckIn.attendances[0].tuitionPayment, { status: "PAID" });
  assert.equal(afterCheckIn.attendances[1].status, "ABSENT");
  assert.equal(afterCheckIn.currentAttendance.classSession.name, "B1");
  assert.equal(afterCheckIn.currentAttendance.status, "PRESENT");

  const afterCancel = slice.default(afterCheckIn, {
    type: slice.cancelCheckInAttendanceAsync.fulfilled.type,
    payload: { data: { attendanceId: 5, status: "ABSENT" } },
  });
  assert.equal(afterCancel.attendances[0].status, "ABSENT");
  assert.deepEqual(afterCancel.attendances[0].otherAttendancesInWeek, [{ attendanceId: 7 }]);
});

test("loading flag tracks pending check-ins and clears on settle", () => {
  const initial = slice.default(undefined, { type: "init" });
  const pendingOne = slice.default(initial, { type: slice.checkInAttendanceAsync.pending.type });
  const pendingTwo = slice.default(pendingOne, { type: slice.checkInAttendanceAsync.pending.type });
  assert.equal(slice.selectAttendanceLoadingCheckIn({ attendance: pendingTwo }), true);

  const settledOne = slice.default(pendingTwo, { type: slice.checkInAttendanceAsync.rejected.type, payload: "x" });
  assert.equal(slice.selectAttendanceLoadingCheckIn({ attendance: settledOne }), true);
  const settledTwo = slice.default(settledOne, {
    type: slice.checkInAttendanceAsync.fulfilled.type,
    payload: { data: { attendanceId: 1 } },
  });
  assert.equal(slice.selectAttendanceLoadingCheckIn({ attendance: settledTwo }), false);
});

test("a late response for an older detail request is ignored", () => {
  const act = (type, requestId, extra = {}) => ({ type, meta: { requestId, arg: 0 }, ...extra });
  let state = slice.default(undefined, { type: "init" });
  state = slice.default(state, act(slice.getAttendanceByIdAsync.pending.type, "A"));
  state = slice.default(state, act(slice.getAttendanceByIdAsync.pending.type, "B"));
  state = slice.default(state, act(slice.getAttendanceByIdAsync.fulfilled.type, "A", { payload: { data: { attendanceId: 1 } } }));
  assert.equal(state.currentAttendance, null);
  assert.equal(state.loadingDetail, true);
  state = slice.default(state, act(slice.getAttendanceByIdAsync.fulfilled.type, "B", { payload: { data: { attendanceId: 2 } } }));
  assert.equal(state.currentAttendance.attendanceId, 2);
  assert.equal(state.loadingDetail, false);
});

test("fetching one attendance does not flip the list loading flag", () => {
  const initial = slice.default(undefined, { type: "init" });
  const pending = slice.default(initial, { type: slice.getAttendanceByIdAsync.pending.type, meta: { requestId: "A" } });
  assert.equal(pending.loadingGet, false);
  assert.equal(pending.loadingDetail, true);
});

/* ===================== rendering ===================== */

const row = (overrides) => ({
  attendanceId: 1,
  sessionId: 10,
  studentId: 20,
  status: "ABSENT",
  attendanceType: "REGULAR",
  markedAt: "2026-10-01T01:00:00Z",
  student: { studentId: 20, fullName: "Nguyen Van A" },
  classSession: { name: "Buổi 1" },
  ...overrides,
});

const renderTable = (attendances, props = {}) =>
  renderToStaticMarkup(
    createElement(
      MemoryRouter,
      null,
      createElement(table.AttendanceTable, {
        attendances,
        loading: false,
        onView: () => {},
        onEdit: () => {},
        onDelete: () => {},
        onCheckIn: () => {},
        onCancelCheckIn: () => {},
        ...props,
      }),
    ),
  );

test("status column: ABSENT and LATE rows offer 'Điểm danh', PRESENT rows offer 'Hủy điểm danh'", () => {
  const absent = renderTable([row({ status: "ABSENT" })]);
  assert.match(absent, />Điểm danh</);
  assert.doesNotMatch(absent, /Hủy điểm danh/);

  const late = renderTable([row({ status: "LATE" })]);
  assert.match(late, />Điểm danh</);

  const present = renderTable([row({ status: "PRESENT", attendanceType: "MAKEUP" })]);
  assert.match(present, /Hủy điểm danh/);
  assert.doesNotMatch(present, />Điểm danh</);
  assert.match(present, /Học bù/);
});

test("status column shows 'Đã được học bù' only for made-up absences, and no status dropdown", () => {
  const madeUp = renderTable([row({ status: "ABSENT", makeupByAttendanceId: 7, isMadeUp: true })]);
  assert.match(madeUp, /Đã được học bù/);
  assert.match(madeUp, />Điểm danh</);
  assert.doesNotMatch(madeUp, /aria-haspopup/);

  const notMadeUp = renderTable([row({ status: "ABSENT", makeupByAttendanceId: null })]);
  assert.doesNotMatch(notMadeUp, /Đã được học bù/);

  const presentWithLink = renderTable([row({ status: "PRESENT", makeupByAttendanceId: 7 })]);
  assert.doesNotMatch(presentWithLink, /Đã được học bù/);
});

test("the busy row shows a disabled processing button", () => {
  const html = renderTable([row({ attendanceId: 1 }), row({ attendanceId: 2, status: "PRESENT" })], {
    checkInLoadingId: 1,
  });
  assert.match(html, /Đang xử lý/);
  // the other row's button is disabled while one request runs
  assert.match(html, /<button[^>]*disabled[^>]*>[^<]*Hủy điểm danh/);
});

test("no buttons render without handlers", () => {
  const html = renderTable([row({ status: "ABSENT" })], { onCheckIn: undefined, onCancelCheckIn: undefined });
  assert.doesNotMatch(html, />Điểm danh</);
});

test("AttendanceDetailInfo renders both makeup sections with class, session, date and time range", () => {
  const summary = (overrides) => ({
    attendanceId: 100,
    sessionId: 50,
    status: "PRESENT",
    sessionName: "Buổi 4",
    sessionDate: "2026-10-09",
    startTime: "1970-01-01T11:00:00.000Z",
    endTime: "1970-01-01T12:30:00.000Z",
    classId: 3,
    className: "12B",
    ...overrides,
  });
  const html = renderToStaticMarkup(
    createElement(detailInfo.AttendanceDetailInfo, {
      attendance: row({
        status: "PRESENT",
        attendanceType: "MAKEUP",
        makeupBy: summary({ attendanceId: 101, className: "12C", sessionName: "Buổi 9" }),
        madeUpAbsences: [summary({ attendanceId: 102, status: "ABSENT" }), summary({ attendanceId: 103, sessionName: "Buổi 5" })],
      }),
    }),
  );

  assert.match(html, /Buổi này học bù cho/);
  assert.match(html, /Được học bù bởi/);
  assert.equal(html.match(/data-testid="makeup-link-item"/g)?.length, 3);
  assert.match(html, /12B - Buổi 4/);
  assert.match(html, /12C - Buổi 9/);
  assert.match(html, /09\/10\/2026/);
  assert.match(html, /18:00 - 19:30/);
});

test("AttendanceDetailInfo hides the sections without links and flags a made-up absence", () => {
  const plain = renderToStaticMarkup(
    createElement(detailInfo.AttendanceDetailInfo, { attendance: row({ status: "PRESENT", makeupBy: null, madeUpAbsences: [] }) }),
  );
  assert.doesNotMatch(plain, /Buổi này học bù cho/);
  assert.doesNotMatch(plain, /Được học bù bởi/);
  assert.doesNotMatch(plain, /Đã được học bù/);

  const absent = renderToStaticMarkup(
    createElement(detailInfo.AttendanceDetailInfo, {
      attendance: row({
        status: "ABSENT",
        makeupByAttendanceId: 9,
        isMadeUp: true,
        makeupBy: {
          attendanceId: 9,
          sessionId: 5,
          status: "PRESENT",
          sessionName: "Buổi 2",
          sessionDate: "2026-10-08",
          startTime: "1970-01-01T11:00:00.000Z",
          endTime: "1970-01-01T12:00:00.000Z",
          className: "12B",
        },
      }),
    }),
  );
  assert.match(absent, /Đã được học bù/);
  assert.match(absent, /Được học bù bởi/);
});

test("the student attendance table flags a made-up absence", () => {
  const html = renderToStaticMarkup(
    createElement(studentTable.StudentAttendanceTable, {
      attendances: [row({ makeupByAttendanceId: 4, isMadeUp: true })],
      loading: false,
      onView: () => {},
      onEdit: () => {},
      onDelete: () => {},
    }),
  );
  assert.match(html, /Đã được học bù/);
});
