import { PageObject } from "./PageObject";
import * as _ from "lodash";

export enum FormTypes {
  INPUT = "INPUT",
  BUTTON = "BUTTON",
  LINK = "LINK"
}

interface FormInput {
  type: FormTypes;
  name: string;
  input?: string;
}

interface FormCombinationStep {
  given: string;
  whens: string[];
  then: string;
}

export interface FeatureConfig {
  featureName: string;
  stakeholder: string;
  task: string;
  justification: string;
  scenarioDescription: string;
  currentPage: string;
  defaultThen: string;
  textInputSamples: string[];
}

/**
 * Author: Jason Stratman
 *
 * Generates print-out of Cucumber feature file
 * which covers all permutations of form controls
 * found on specified page.
 */
export async function generateFeatureFile(
  config: FeatureConfig,
  pageObject: PageObject
) {
  let formMetadatas: FormInput[] = [];

  // Get names of all input forms (text boxes)
  const inputNames = await Promise.all(
    await pageObject
      .getInputs()
      .then(inputs => inputs.map(input => pageObject.getFormControlName(input)))
  );

  inputNames.forEach(inputName => {
    formMetadatas.push({
      type: FormTypes.INPUT,
      name: inputName
    } as FormInput);
  });

  // Get names of all buttons
  const buttonNames = await Promise.all(
    await pageObject
      .getButtons()
      .then(buttons => buttons.map(button => pageObject.getText(button)))
  );

  buttonNames.forEach(buttonName => {
    formMetadatas.push({
      type: FormTypes.BUTTON,
      name: buttonName
    } as FormInput);
  });

  // Generate all possible text input combinations and orderings based on the text input samples
  const allInputCombinations = assignInputs(
    formMetadatas,
    config.textInputSamples
  );

  const formCombinationSteps = allInputCombinations.map(
    formInputs =>
      ({
        given: `I am on the "${config.currentPage}" page`,
        whens: formInputs.map(input => {
          switch (input.type) {
            case FormTypes.INPUT:
              return `I type "${input.input}" into the "${input.name}" field`;
            case FormTypes.BUTTON:
              return `I click the "${input.name}" button`;
            case FormTypes.LINK:
              return `I click the "${input.name}" link`;
            default:
              return ``;
          }
        }),
        then: config.defaultThen
      } as FormCombinationStep)
  );

  console.log(`Feature: ${config.featureName}`);
  console.log(`  As a ${config.stakeholder}`);
  console.log(`  I need to ${config.task}`);
  console.log(`  So that I can ${config.justification}`);

  formCombinationSteps.forEach((step, index) => {
    console.log("");
    console.log(`  Scenario: ${config.scenarioDescription} ${index + 1}`);
    console.log(`    Given ${step.given}`);
    step.whens.forEach(when => console.log(`    When ${when}`));
    console.log(`    Then ${step.then}`);
  });
}

function assignInputs(
  formMetadatas: FormInput[],
  textInputSamples: string[]
): FormInput[][] {
  let allInputCombinations: FormInput[][] = permuteArray(formMetadatas);

  let index = allInputCombinations.findIndex(inputCombinations =>
    inputCombinations.some(
      inputCombination =>
        inputCombination.type == FormTypes.INPUT &&
        _.isNil(inputCombination.input)
    )
  );

  while (index !== -1) {
    const incompleteInputCombinations = allInputCombinations.splice(
      index,
      1
    )[0];

    let ind = incompleteInputCombinations.findIndex(
      inputCombination =>
        inputCombination.type == FormTypes.INPUT &&
        _.isNil(inputCombination.input)
    );

    textInputSamples.forEach((textInput, i, arr) => {
      const copy = _.cloneDeep(incompleteInputCombinations);

      copy.splice(ind, 1, {
        ...copy[ind],
        input: textInput
      })[0];

      allInputCombinations.push(copy);
    });

    index = allInputCombinations.findIndex(inputCombinations =>
      inputCombinations.some(
        inputCombination =>
          inputCombination.type == FormTypes.INPUT &&
          _.isNil(inputCombination.input)
      )
    );
  }

  return allInputCombinations;
}

function permuteArray(array: FormInput[]): FormInput[][] {
  var permArr = [],
    usedChars = [];

  function permute(input) {
    var i, ch;

    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);

      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }

      permute(input);

      input.splice(i, 0, ch);

      usedChars.pop();
    }
    return permArr;
  }

  return permute(array);
}
