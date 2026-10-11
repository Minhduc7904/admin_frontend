import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { after, before, test } from "node:test";

import { installLocalStorageStub, startViteModuleLoader } from "../test-support/vite-test-server.mjs";

installLocalStorageStub();

let panel;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    panel: "/src/features/courseClass/components/CourseClassMakeupSessionsPanel.jsx",
  });
  panel = loader.modules.panel;
});

after(async () => {
  await loader?.close();
});

const render = ({ permissions = [], roles = [] } = {}) => {
  const store = configureStore({
    reducer: {
      profile: (state = { permissions: permissions.map((code) => ({ code })), roles }) => state,
    },
  });

  return renderToStaticMarkup(
    createElement(Provider, { store }, createElement(panel.CourseClassMakeupSessionsPanel, { classId: 154 })),
  );
};

test("the floating button shows for users who can read the class and its sessions, with the panel closed", () => {
  const html = render({ permissions: ["course-class:get-by-id", "class-session:get-all"] });

  assert.match(html, /Buổi học bù trong tuần/);
  assert.match(html, /aria-expanded="false"/);
  assert.doesNotMatch(html, /data-testid="makeup-sessions-panel"/);
  assert.doesNotMatch(html, /data-testid="makeup-sessions-table"/);
});

test("the panel is hidden without course-class:get-by-id", () => {
  assert.equal(render({ permissions: ["class-session:get-all"] }), "");
});

test("the panel is hidden without class-session:get-all", () => {
  assert.equal(render({ permissions: ["course-class:get-by-id"] }), "");
});

test("the panel is hidden for a user with no permissions", () => {
  assert.equal(render(), "");
});

test("a super admin sees the button without listing the permissions", () => {
  const html = render({ roles: [{ roleName: "SUPER_ADMIN" }] });

  assert.match(html, /Buổi học bù trong tuần/);
});
