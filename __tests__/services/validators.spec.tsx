import "@testing-library/jest-dom";
import { Operators } from "../../constants";
import { Expression } from "../../models";
import {
  validateDsl,
  validateExpression,
  validateOperator,
  validateValue,
} from "../../services/validators";

const OPERATOR = "*";
const NUMBER_EXPRESSION: Expression = {
  fn: OPERATOR,
  a: 1,
  b: 2,
};
const STRING_EXPRESSION: Expression = {
  fn: OPERATOR,
  a: "a",
  b: "b",
};

describe("validateDsl() tests", () => {
  it("should return true when provided valid DSL", () => {
    const dsl = JSON.parse(
      `{ "expression": { "fn": "+", "a": 3, "b": 3 }, "security": "abc" }`,
    );
    const result = validateDsl(dsl);
    expect(result).toEqual(true);
  });

  it("should return false when provided DSL missing Expression value", () => {
    const dsl = JSON.parse(`{ "security": "abc" }`);
    const result = validateDsl(dsl);
    expect(result).toEqual(false);
  });

  it("should return false when provided DSL missing Security value", () => {
    const dsl = JSON.parse(`{ "expression": { "fn": "+", "a": 3, "b": 3 } }`);
    const result = validateDsl(dsl);
    expect(result).toEqual(false);
  });

  it("should return false when provided DSL contains invalid expression", () => {
    const dsl = JSON.parse(
      `{ "expression": { "a": 3, "b": 3 }, "security": "abc" }`,
    );
    const result = validateDsl(dsl);
    expect(result).toEqual(false);
  });
});

describe("validateExpression() tests", () => {
  it("should return true when provided valid Expression with numbers", () => {
    const result = validateExpression(NUMBER_EXPRESSION);
    expect(result).toEqual(true);
  });

  it("should return true when provided valid Expression with strings", () => {
    const result = validateExpression(STRING_EXPRESSION);
    expect(result).toEqual(true);
  });

  it("should return true when provided valid Expression with sub-expressions", () => {
    const expression: Expression = {
      fn: OPERATOR,
      a: {
        fn: OPERATOR,
        a: STRING_EXPRESSION,
        b: 2,
      },
      b: {
        fn: OPERATOR,
        a: 1,
        b: NUMBER_EXPRESSION,
      },
    };
    const result = validateExpression(expression);
    expect(result).toEqual(true);
  });

  it("should return false when expression missing `fn` value", () => {
    const expression: Expression = JSON.parse(`{ "a": 2, "b": 3 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when expression contains null `fn` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": null, "a": 2, "b": 3 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when expression contains empty `fn` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": "", "a": 2, "b": 3 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when expression contains invalid `fn` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": "!", "a": 2, "b": 3 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when missing `a` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": "+", "b": 3 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when provided null for `a` value", () => {
    const expression: Expression = JSON.parse(
      `{ "fn": "+", "a": null, "b": 3 }`,
    );
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when provided empty string for `a` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": "+", "a": "", "b": 3 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when provided missing `b` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": "+", "a": 2 }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when provided null for `b` value", () => {
    const expression: Expression = JSON.parse(
      `{ "fn": "+", "a": 2, "b": null }`,
    );
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when provided empty string for `b` value", () => {
    const expression: Expression = JSON.parse(`{ "fn": "/", "a": 2, "b": "" }`);
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when `a` value contains invalid expression", () => {
    const expression: Expression = JSON.parse(
      `{ "fn": "+", "a": { "fn": "" }, "b": 3 }`,
    );
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });

  it("should return false when `b` value contains invalid expression", () => {
    const expression: Expression = JSON.parse(
      `{ "fn": "+", "a": 3, "b": { "fn": "" } }`,
    );
    const result = validateExpression(expression);
    expect(result).toEqual(false);
  });
});

describe("validateOperator() tests", () => {
  it("should return true when provided `+` operator", () => {
    const result = validateOperator(Operators[0]);
    expect(result).toEqual(true);
  });

  it("should return true when provided `-` operator", () => {
    const result = validateOperator(Operators[1]);
    expect(result).toEqual(true);
  });

  it("should return true when provided `*` operator", () => {
    const result = validateOperator(Operators[2]);
    expect(result).toEqual(true);
  });

  it("should return true when provided `/` operator", () => {
    const result = validateOperator(Operators[3]);
    expect(result).toEqual(true);
  });

  it("should return false when provided invalid operator", () => {
    const result = validateOperator("=");
    expect(result).toEqual(false);
  });
});

describe("validateValue() tests", () => {
  it("should return true when provided valid Expression", () => {
    const result = validateValue(NUMBER_EXPRESSION);
    expect(result).toEqual(true);
  });

  it("should return true when provided valid string", () => {
    const result = validateValue("abc");
    expect(result).toEqual(true);
  });

  it("should return true when provided valid number", () => {
    const result = validateValue(5);
    expect(result).toEqual(true);
  });

  it("should return false when provided undefined value", () => {
    const value = JSON.parse(`{}`);
    const result = validateValue(value.a);
    expect(result).toEqual(false);
  });

  it("should return false when provided null value", () => {
    const value = JSON.parse(`{ "a": null }`);
    const result = validateValue(value.a);
    expect(result).toEqual(false);
  });

  it("should return false when provided empty string value", () => {
    const value = JSON.parse(`{ "a": "" }`);
    const result = validateValue(value.a);
    expect(result).toEqual(false);
  });
});
