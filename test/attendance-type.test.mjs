import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { installLocalStorageStub, startViteModuleLoader } from "./helpers/vite-test-server.mjs";

installLocalStorageStub();

let fields;
let options;
let badge;
let slice;
let axiosClient;
let studentTable;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    fields: "/src/features/attendance/utils/attendanceFields.js",
    options: "/src/core/constants/options.js",
    badge: "/src/features/attendance/components/AttendanceTypeBadge.jsx",
    slice: "/src/features/attendance/store/attendanceSlice.js",
    axiosClient: "/src/core/api/axiosClient.js",
    studentTable: "/src/features/student/components/StudentAttendanceTable.jsx",
  });
  fields = loader.modules.fields;
  options = loader.modules.options;
  badge = loader.modules.badge;
  slice = loader.modules.slice;
  axiosClient = loader.modules.axiosClient.default;
  studentTable = loader.modules.studentTable;
});

after(async () => {
  await loader?.close();
});

const values = (list) => list.map((option) => option.value);

test("status options are PRESENT, ABSENT, LATE and type options are REGULAR, MAKEUP", () => {
  assert.deepEqual(values(options.ATTENDANCE_STATUS_OPTIONS), ["PRESENT", "ABSENT", "LATE"]);
  assert.deepEqual(values(options.ATTENDANCE_TYPE_OPTIONS), ["REGULAR", "MAKEUP"]);
});

test("labels for status and type come from separate tables and never infer one from the other", () => {
  assert.equal(fields.getAttendanceStatusLabel("PRESENT"), "Có mặt");
  assert.equal(fields.getAttendanceStatusLabel("MAKEUP"), null);
  assert.equal(fields.getAttendanceTypeLabel("MAKEUP"), "Học bù");
  assert.equal(fields.getAttendanceTypeLabel("REGULAR"), "Chính khóa");
  assert.equal(fields.getAttendanceTypeLabel("PRESENT"), null);
  assert.equal(fields.getAttendanceTypeLabel(undefined), null);
});

test("create defaults to REGULAR and sends MAKEUP when chosen", () => {
  const base = { sessionId: 5, studentId: 9, status: "PRESENT", notes: "" };

  assert.deepEqual(fields.buildCreateAttendancePayload(base), {
    sessionId: 5,
    studentId: 9,
    status: "PRESENT",
    attendanceType: "REGULAR",
  });
  assert.equal(fields.buildCreateAttendancePayload({ ...base, attendanceType: "MAKEUP" }).attendanceType, "MAKEUP");
  assert.equal(fields.buildCreateAttendancePayload({ ...base, attendanceType: "BOGUS" }).attendanceType, "REGULAR");
  assert.equal(fields.buildCreateAttendancePayload({ ...base, status: "ABSENT", attendanceType: "MAKEUP" }).status, "ABSENT");
});

test("edit loads the current type from the API record and sends it back unchanged", () => {
  const record = { sessionId: 5, studentId: 9, status: "LATE", attendanceType: "MAKEUP", notes: "trễ" };
  const form = fields.attendanceToFormData(record);

  assert.equal(form.attendanceType, "MAKEUP");
  assert.deepEqual(fields.buildUpdateAttendancePayload(form), {
    status: "LATE",
    attendanceType: "MAKEUP",
    notes: "trễ",
  });
});

test("edit never guesses a type: a record without one leaves the field out", () => {
  const form = fields.attendanceToFormData({ sessionId: 5, studentId: 9, status: "PRESENT", notes: "Học bù" });

  assert.equal(form.attendanceType, undefined);
  assert.deepEqual(fields.buildUpdateAttendancePayload(form), { status: "PRESENT", notes: "Học bù" });
});

test("changing only the status never sends or resets the type", async () => {
  assert.deepEqual(fields.buildStatusOnlyPayload("ABSENT"), { status: "ABSENT" });

  const calls = [];
  const original = axiosClient.put;
  axiosClient.put = (...args) => {
    calls.push(args);
    return Promise.resolve({ data: { success: true, data: {} } });
  };
  try {
    await slice.updateAttendanceStatusAsync({ id: 7, status: "ABSENT" })(() => {}, () => ({}), undefined);
  } finally {
    axiosClient.put = original;
  }

  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /attendances\/7$/);
  assert.deepEqual(calls[0][1], { status: "ABSENT" });
});

test("bulk payload carries the type explicitly", () => {
  assert.deepEqual(fields.buildBulkAttendancePayload({ sessionId: 3, status: "PRESENT", notes: "" }), {
    sessionId: 3,
    status: "PRESENT",
    attendanceType: "REGULAR",
  });
  assert.equal(
    fields.buildBulkAttendancePayload({ sessionId: 3, status: "PRESENT", attendanceType: "MAKEUP" }).attendanceType,
    "MAKEUP",
  );
});

test("list query keeps the attendanceType filter separate from the status filter", () => {
  assert.deepEqual(
    fields.buildAttendanceListParams({ classId: 4, page: 1, statusFilter: "PRESENT", attendanceTypeFilter: "MAKEUP" }),
    { classId: 4, page: 1, status: "PRESENT", attendanceType: "MAKEUP" },
  );
  assert.deepEqual(fields.buildAttendanceListParams({ classId: 4, statusFilter: "", attendanceTypeFilter: "" }), {
    classId: 4,
  });
  assert.deepEqual(fields.buildAttendanceListParams({ classId: 4, attendanceTypeFilter: "MAKEUP" }), {
    classId: 4,
    attendanceType: "MAKEUP",
  });
  assert.equal(fields.buildAttendanceListParams({ statusFilter: "MAKEUP" }).attendanceType, undefined);
});

test("makeup counts use attendanceType, not status", () => {
  const rows = [
    { status: "PRESENT", attendanceType: "MAKEUP" },
    { status: "ABSENT", attendanceType: "MAKEUP" },
    { status: "PRESENT", attendanceType: "REGULAR" },
    { status: "PRESENT" },
  ];

  assert.equal(fields.countMakeupAttendances(rows), 2);
});

test("the type badge renders its own label next to the status, and nothing for unknown types", () => {
  const render = (attendanceType) =>
    renderToStaticMarkup(createElement(badge.AttendanceTypeBadge, { attendanceType }));

  assert.match(render("MAKEUP"), /Học bù/);
  assert.match(render("REGULAR"), /Chính khóa/);
  assert.equal(render(undefined), "");
  assert.equal(render("PRESENT"), "");
});

test("the student attendance table shows status and type as two independent labels", () => {
  const rows = [
    { attendanceId: 1, status: "PRESENT", attendanceType: "MAKEUP", markedAt: "2026-10-01T01:00:00Z" },
    { attendanceId: 2, status: "PRESENT", attendanceType: "REGULAR", markedAt: "2026-10-02T01:00:00Z" },
    { attendanceId: 3, status: "ABSENT", attendanceType: "MAKEUP", markedAt: "2026-10-03T01:00:00Z" },
  ];
  const html = renderToStaticMarkup(
    createElement(studentTable.StudentAttendanceTable, {
      attendances: rows,
      loading: false,
      onView: () => {},
      onEdit: () => {},
      onDelete: () => {},
    }),
  );

  assert.equal(html.match(/Có mặt/g)?.length, 2);
  assert.equal(html.match(/Vắng/g)?.length, 1);
  assert.equal(html.match(/Học bù/g)?.length, 2);
  assert.equal(html.match(/Chính khóa/g)?.length, 1);
});

test("no source file still treats MAKEUP as an attendance status", () => {
  const offenders = [];
  const patterns = [
    /status\s*[:=]\s*["']MAKEUP["']/,
    /status\s*===?\s*["']MAKEUP["']/,
    /STATUS_[A-Z_]*\s*=\s*\{[^}]*MAKEUP/,
  ];
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) visit(path);
      else if (/\.(js|jsx)$/.test(name)) {
        const source = readFileSync(path, "utf8");
        if (patterns.some((pattern) => pattern.test(source))) offenders.push(path);
      }
    }
  };
  visit(new URL("../src", import.meta.url).pathname);

  assert.deepEqual(offenders, []);
});
