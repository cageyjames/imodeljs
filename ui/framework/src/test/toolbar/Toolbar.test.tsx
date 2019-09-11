/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";

import { render, cleanup } from "@testing-library/react";
import { expect } from "chai";
import TestUtils from "../TestUtils";
import {
  Toolbar, CommandItemDef, BaseItemState, GroupItemDef, ConditionalItemDef, SyncUiEventDispatcher, CustomItemDef, PopupButton,
} from "../../ui-framework";
import { Direction, ToolbarPanelAlignment } from "@bentley/ui-ninezone";
import { ItemList } from "../../ui-framework/shared/ItemMap";
import { Orientation } from "@bentley/ui-core";

describe("<Toolbar  />", async () => {

  const tool1 = new CommandItemDef({
    commandId: "test.tool1",
    label: "Tool_1",
    iconSpec: "icon-placeholder",
    isEnabled: false,
  });

  const tool2 = new CommandItemDef({
    commandId: "test.tool2",
    label: "Tool_2",
    iconSpec: "icon-placeholder",
    isEnabled: true,
  });

  const tool1a = new CommandItemDef({
    commandId: "test.tool1_a",
    label: "Tool_1",
    iconSpec: "icon-placeholder",
    isEnabled: false,
  });

  const tool2a = new CommandItemDef({
    commandId: "test.tool2_a",
    label: "Tool_2",
    iconSpec: "icon-placeholder",
    isEnabled: true,
  });

  const tool1b = new CommandItemDef({
    commandId: "test.tool1_b",
    label: "Tool_1",
    iconSpec: "icon-placeholder",
    isEnabled: false,
  });

  const tool2b = new CommandItemDef({
    commandId: "test.tool2_b",
    label: "Tool_2",
    iconSpec: "icon-placeholder",
    isEnabled: true,
  });

  const group1 = new GroupItemDef({
    groupId: "test.group",
    label: "Tool_Group",
    iconSpec: "icon-placeholder",
    items: [tool1a, tool2a],
    itemsInColumn: 4,
  });

  const custom1 = new CustomItemDef({
    customId: "test.custom",
    reactElement: (
      <PopupButton iconSpec="icon-arrow-down" label="Popup Test">
        <div style={{ width: "200px", height: "100px" }}>
          hello world!
        </div>
      </PopupButton>
    ),
  });

  const testItemEventId = "test-event";
  const testItemStateFunc = (currentState: Readonly<BaseItemState>): BaseItemState => {
    const returnState: BaseItemState = { ...currentState };
    returnState.isEnabled = true;
    return returnState;
  };

  const conditional1 = new ConditionalItemDef({
    items: [tool1b, tool2b],
    isEnabled: false,
    stateSyncIds: [testItemEventId],
    stateFunc: testItemStateFunc,
  });

  before(async () => {
    await TestUtils.initializeUiFramework();
  });

  after(() => {
    TestUtils.terminateUiFramework();
  });

  afterEach(cleanup);

  it("should render", async () => {
    const renderedComponent = render(
      <Toolbar orientation={Orientation.Horizontal}
        items={new ItemList([
          tool1,
          tool2,
        ])} />);
    expect(renderedComponent).not.to.be.undefined;
  });

  it("should render all props", async () => {
    const renderedComponent = render(
      <Toolbar
        orientation={Orientation.Vertical}
        expandsTo={Direction.Right}
        panelAlignment={ToolbarPanelAlignment.End}
        items={new ItemList([
          tool1,
          tool2,
          group1,
          conditional1,
          custom1,
        ])} />);
    expect(renderedComponent).not.to.be.undefined;
  });

  it("should render with only items", async () => {
    const renderedComponent = render(
      <Toolbar
        orientation={Orientation.Horizontal}
        items={new ItemList([
          tool1,
          tool2,
          group1,
          conditional1,
          custom1,
        ])} />);
    expect(renderedComponent).not.to.be.undefined;
  });

  it("sync event should not refresh if no items updated", () => {
    const renderedComponent = render(
      <Toolbar
        orientation={Orientation.Horizontal}
        items={new ItemList([
          tool1,
          tool2,
        ])}
      />);
    expect(renderedComponent).not.to.be.undefined;

    expect(tool1.isEnabled).to.be.false;
    expect(tool2.isEnabled).to.be.true;

    SyncUiEventDispatcher.dispatchImmediateSyncUiEvent(testItemEventId);

    expect(tool1.isEnabled).to.be.false;
    expect(tool2.isEnabled).to.be.true;
  });

  it("sync event should refresh updated items", () => {
    const renderedComponent = render(
      <Toolbar
        orientation={Orientation.Horizontal}
        items={new ItemList([
          tool1,
          tool2,
          group1,
          conditional1,
          custom1,
        ])}
      />);
    expect(renderedComponent).not.to.be.undefined;

    expect(tool1b.isEnabled).to.be.false;
    expect(tool2b.isEnabled).to.be.true;

    SyncUiEventDispatcher.dispatchImmediateSyncUiEvent(testItemEventId);

    expect(tool1b.isEnabled).to.be.true;
    expect(tool2b.isEnabled).to.be.true;
  });

});