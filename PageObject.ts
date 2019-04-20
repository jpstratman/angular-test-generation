import { browser, by, element, until, WebElement } from "protractor";

/**
 * Author: Jason Stratman
 *
 * PageObject for use with Protractor to facilitate
 * form interaction.
 */
export class PageObject {
  constructor() {
    by.addLocator(
      "formControlName",
      (value, opt_parentElement, opt_rootSelector) => {
        var using = opt_parentElement || document;

        return using.querySelectorAll('[formControlName="' + value + '"]');
      }
    );
  }

  public navigateTo(pageName) {
    return browser.get(pageName);
  }

  public getFormControlName(element: WebElement) {
    const attribute = element.getAttribute("formControlName");

    return browser.wait(attribute, 5000);
  }

  public sendToFormControl(controlName: string, keys: string) {
    element(by.formControlName(controlName)).sendKeys(keys);
  }

  public clickButton(controlName: string) {
    element(by.buttonText(controlName)).click();
  }

  public clickLink(controlName: string) {
    element(by.linkText(controlName)).click();
  }

  public getForms() {
    const condition = until.elementsLocated(by.css("form"));

    return browser.wait(condition, 5000);
  }

  public getInputs() {
    const condition = until.elementsLocated(by.css("input"));

    return browser.wait(condition, 5000);
  }

  public getButtons() {
    const condition = until.elementsLocated(by.css("button"));

    return browser.wait(condition, 5000);
  }

  public getLinks() {
    const condition = until.elementsLocated(by.css("a"));

    return browser.wait(condition, 5000);
  }

  public getText(element: WebElement) {
    const attribute = element.getText();

    return browser.wait(attribute, 5000);
  }
}
