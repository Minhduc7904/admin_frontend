import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createServer } from "vite";

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

let getMyNotificationsAsync;
let getMyStatsAsync;
let notificationReducer;
let vite;

before(async () => {
  vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    server: { hmr: false, middlewareMode: true },
  });

  const notificationSlice = await vite.ssrLoadModule(
    "/src/features/notification/store/notificationSlice.js",
  );
  getMyNotificationsAsync = notificationSlice.getMyNotificationsAsync;
  getMyStatsAsync = notificationSlice.getMyStatsAsync;
  notificationReducer = notificationSlice.default;
});

after(async () => {
  await vite?.close();
});

test("ignores notification responses from the account that logged out", () => {
  let state = notificationReducer(undefined, { type: "@@init" });

  state = notificationReducer(
    state,
    getMyNotificationsAsync.pending("old-notifications", {
      page: 1,
      limit: 10,
    }),
  );
  state = notificationReducer(
    state,
    getMyStatsAsync.pending("old-stats"),
  );
  state = notificationReducer(state, { type: "auth/logout/fulfilled" });

  state = notificationReducer(
    state,
    getMyNotificationsAsync.fulfilled(
      {
        data: [{ notificationId: 1, title: "old account" }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
      "old-notifications",
      { page: 1, limit: 10 },
    ),
  );
  state = notificationReducer(
    state,
    getMyStatsAsync.fulfilled(
      { data: { total: 1, unread: 1, read: 0 } },
      "old-stats",
    ),
  );

  assert.deepEqual(state.myNotifications, []);
  assert.deepEqual(state.stats, { total: 0, unread: 0, read: 0 });
});

test("accepts notification responses from the current request", () => {
  let state = notificationReducer(undefined, { type: "@@init" });

  state = notificationReducer(
    state,
    getMyNotificationsAsync.pending("current-notifications", {
      page: 1,
      limit: 10,
    }),
  );
  state = notificationReducer(
    state,
    getMyNotificationsAsync.fulfilled(
      {
        data: [{ notificationId: 2, title: "current account" }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
      "current-notifications",
      { page: 1, limit: 10 },
    ),
  );

  assert.equal(state.myNotifications.length, 1);
  assert.equal(state.myNotifications[0].title, "current account");
  assert.equal(state.myNotificationsRequestId, null);
});
