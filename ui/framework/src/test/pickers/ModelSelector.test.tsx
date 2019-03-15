/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { HierarchyBuilder, initialize, terminate } from "@bentley/presentation-testing";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import TestUtils from "../TestUtils";
import { Ruleset } from "@bentley/presentation-common";
import { Presentation } from "@bentley/presentation-frontend";

describe("ModelSelector", () => {

  const testIModelPath = "src/test/test-data/Properties_60InstancesWithUrl2.ibim";
  let imodel: IModelConnection;
  let hierarchyBuilder: HierarchyBuilder;

  before(async () => {
    await TestUtils.initializeUiFramework();
    initialize();
  });

  after(() => {
    terminate();
    TestUtils.terminateUiFramework();
  });

  beforeEach(async () => {
    imodel = await IModelConnection.openStandalone(testIModelPath);
    hierarchyBuilder = new HierarchyBuilder(imodel);
  });

  afterEach(async () => {
    await imodel.closeStandalone();
  });

  describe("Model", () => {

    let ruleset: Ruleset;

    beforeEach(() => {
      ruleset = require("../../../rulesets/Models");
    });

    it("generates correct models' hierarchy", async () => {
      const builder = new HierarchyBuilder(imodel);
      const hierarchy = await builder.createHierarchy(ruleset);
      expect(hierarchy).to.matchSnapshot();
    });

  });

  describe("Category", () => {

    let ruleset: Ruleset;

    beforeEach(() => {
      ruleset = require("../../../rulesets/Categories");
    });

    it("generates empty hierarchy when 'ViewType' ruleset variable is not set", async () => {
      const hierarchy = await hierarchyBuilder.createHierarchy(ruleset);
      expect(hierarchy.length).to.eq(0);
    });

    it("generates correct spatial categories' hierarchy", async () => {
      await Presentation.presentation.vars(ruleset.id).setString("ViewType", "3d");
      const hierarchy = await hierarchyBuilder.createHierarchy(ruleset);
      expect(hierarchy).to.matchSnapshot();
    });

    it("generates correct drawing categories' hierarchy", async () => {
      await Presentation.presentation.vars(ruleset.id).setString("ViewType", "2d");
      const hierarchy = await hierarchyBuilder.createHierarchy(ruleset);
      expect(hierarchy).to.matchSnapshot();
    });

  });

});