/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Test aria-expanded on a button
addAccessibleTask(
  `hello world<br>
  <button aria-expanded="false" id="b">I am a button</button><br>
  goodbye`,
  async (browser, accDoc) => {
    let button = getNativeInterface(accDoc, "b");
    is(button.getAttributeValue("AXExpanded"), 0, "button is not expanded");

    let stateChanged = waitForEvent(EVENT_STATE_CHANGE, "b");
    await SpecialPowers.spawn(browser, [], () => {
      content.document
        .getElementById("b")
        .setAttribute("aria-expanded", "true");
    });
    await stateChanged;
    is(button.getAttributeValue("AXExpanded"), 1, "button is expanded");

    stateChanged = waitForEvent(EVENT_STATE_CHANGE, "b");
    await SpecialPowers.spawn(browser, [], () => {
      content.document.getElementById("b").removeAttribute("aria-expanded");
    });
    await stateChanged;

    ok(
      !button.attributeNames.includes("AXExpanded"),
      "button has no expanded attr"
    );
  }
);
