import { expect } from "chai";
import { Before, Given, When, Then } from "cucumber";
import * as _ from "lodash";
import { PageObject } from "./PageObject";
import { generateFeatureFile } from "./generateFeatureFile";

let pageObject: PageObject;

/**
 * Author: Jason Stratman
 *
 * Example step file for generation of Cucumber feature
 * file and test coverage of input forms.
 *
 * Comment out the "await generateFeatureFile(config, pageObject);"
 * once the Cucumber feature is generated.
 */
Before(async () => {
  let config = {
    featureName: "Login",
    stakeholder: "website user",
    task: "authenticate myself",
    justification: "gain access to my data",
    scenarioDescription: "Entering in credentials",
    currentPage: "login",
    defaultThen: "ASSERT EXPECTATION",
    textInputSamples: ["SomeEmail@gmail.com", "password"]
  };

  pageObject = new PageObject();
  pageObject.navigateTo(`/${config.currentPage}`);

  await generateFeatureFile(config, pageObject);
});

Given("I am on the {string} page", (pageName: string) => {
  return pageObject.navigateTo(`/${pageName}`);
});

When(
  "I type {string} into the {string} field",
  (text: string, formControl: string) => {
    return pageObject.sendToFormControl(formControl, text);
  }
);

When("I click the {string} button", (buttonText: string) => {
  return pageObject.clickButton(buttonText);
});

When("I click the {string} link", (linkText: string) => {
  return pageObject.clickLink(linkText);
});

Then("ASSERT EXPECTATION", () => {
  return expect.fail();
});
