import "@testing-library/jest-dom";
import { Outputs } from "../../constants";
import { Expression } from "../../models";
import {
  processDsl,
  processExpression,
  processExpressionValue,
  processAttribute,
} from "../../services/dsl";

const securityID = 1;
const attributeName = "price";

describe("processDsl() tests", () => {
  it("should return `value` (as string) when provided valid DSL", () => {
    const query = `{ "expression": { "fn": "+", "a": 3, "b": 3 }, "security": "ABC" }`;
    const expectedResult = "6";
    const result = processDsl(query);
    expect(result).toEqual(expectedResult);
  });

  it("should return `Invalid JSON` error message when input query is not valid JSON", () => {
    const query = `"expression": { "fn": "+", "a": 3, "b": 3 }, "security": "ABC"`;
    const result = processDsl(query);
    expect(result).toEqual(Outputs.INVALID_JSON);
  });

  it("should return `Invalid DSL` error message when input query is not valid DSL", () => {
    const query = `{ "invalid": "DSL" }`;
    const result = processDsl(query);
    expect(result).toEqual(Outputs.INVALID_DSL);
  });

  it("should return `Missing Security` error message when selected security value not found", () => {
    const query = `{ "expression": { "fn": "+", "a": 3, "b": 3 }, "security": "NotFound" }`;
    const result = processDsl(query);
    expect(result).toEqual(Outputs.MISSING_SECURITY);
  });

  it("should return `Missing Attribute` error message when provided Attribute value not found", () => {
    const query = `{ "expression": { "fn": "+", "a": "invalid attribute", "b": 3 }, "security": "ABC" }`;
    const result = processDsl(query);
    expect(result).toEqual(Outputs.MISSING_ATTRIBUTE);
  });
});

describe("processExpression() tests", () => {
  it("should process Expression and return `value` (as string) when provided valid Expression", () => {
    const expression: Expression = {
      fn: "+",
      a: 2,
      b: 3,
    };
    const expectedResult = "5";
    const processExpressionValueMock = jest.fn();
    processExpressionValueMock.mockReturnValueOnce(`${expression.a}`);
    processExpressionValueMock.mockReturnValueOnce(`${expression.b}`);
    const result = processExpression(
      expression,
      securityID,
      processExpressionValueMock,
    );
    expect(result).toEqual(expectedResult);
    expect(processExpressionValueMock).toHaveBeenCalledTimes(2);
  });

  it("should return `Missing Attribute` error message when provided invalid `a` field", () => {
    const expression: Expression = {
      fn: "+",
      a: "Invalid value",
      b: 3,
    };
    const processExpressionValueMock = jest.fn();
    processExpressionValueMock.mockReturnValueOnce(Outputs.MISSING_ATTRIBUTE);
    processExpressionValueMock.mockReturnValueOnce(`${expression.b}`);
    const result = processExpression(
      expression,
      securityID,
      processExpressionValueMock,
    );
    expect(result).toEqual(Outputs.MISSING_ATTRIBUTE);
    expect(processExpressionValueMock).toHaveBeenCalledTimes(1);
  });

  it("should return `Missing Fact` error message when provided invalid `a` field", () => {
    const expression: Expression = {
      fn: "+",
      a: "Invalid value",
      b: 3,
    };
    const processExpressionValueMock = jest.fn();
    processExpressionValueMock.mockReturnValueOnce(Outputs.MISSING_FACT);
    processExpressionValueMock.mockReturnValueOnce(`${expression.b}`);
    const result = processExpression(
      expression,
      securityID,
      processExpressionValueMock,
    );
    expect(result).toEqual(Outputs.MISSING_FACT);
    expect(processExpressionValueMock).toHaveBeenCalledTimes(1);
  });

  it("should return `Missing Attribute` error message when provided invalid `b` field", () => {
    const expression: Expression = {
      fn: "+",
      a: 2,
      b: "Invalid value",
    };
    const processExpressionValueMock = jest.fn();
    processExpressionValueMock.mockReturnValueOnce(`${expression.a}`);
    processExpressionValueMock.mockReturnValueOnce(Outputs.MISSING_ATTRIBUTE);
    const result = processExpression(
      expression,
      securityID,
      processExpressionValueMock,
    );
    expect(result).toEqual(Outputs.MISSING_ATTRIBUTE);
    expect(processExpressionValueMock).toHaveBeenCalledTimes(2);
  });

  it("should return `Missing Facts` error message when provided invalid `b` field", () => {
    const expression: Expression = {
      fn: "+",
      a: 2,
      b: "Invalid value",
    };
    const processExpressionValueMock = jest.fn();
    processExpressionValueMock.mockReturnValueOnce(`${expression.a}`);
    processExpressionValueMock.mockReturnValueOnce(Outputs.MISSING_FACT);
    const result = processExpression(
      expression,
      securityID,
      processExpressionValueMock,
    );
    expect(result).toEqual(Outputs.MISSING_FACT);
    expect(processExpressionValueMock).toHaveBeenCalledTimes(2);
  });
});

describe("processExpressionValue() tests", () => {
  it("should return value as string when provided a number value", () => {
    const input = 5;
    const processAttributeMock = jest.fn();
    const processExpressionMock = jest.fn();
    const result = processExpressionValue(
      input,
      securityID,
      processAttributeMock,
      processExpressionMock,
    );
    expect(result).toEqual(`${input}`);
    expect(processAttributeMock).toHaveBeenCalledTimes(0);
    expect(processExpressionMock).toHaveBeenCalledTimes(0);
  });

  it("should return processed attribute value when provided string value", () => {
    const expectedValue = "1";
    const processAttributeMock = jest.fn(() => {
      return expectedValue;
    });
    const processExpressionMock = jest.fn();
    const result = processExpressionValue(
      attributeName,
      securityID,
      processAttributeMock,
      processExpressionMock,
    );
    expect(result).toEqual(expectedValue);
    expect(processAttributeMock).toHaveBeenCalledTimes(1);
    expect(processExpressionMock).toHaveBeenCalledTimes(0);
  });

  it("should return processed expression value when provided Expression", () => {
    const input: Expression = {
      fn: "*",
      a: 2,
      b: 3,
    };
    const expectedValue = "1";
    const processAttributeMock = jest.fn();
    const processExpressionMock = jest.fn(() => {
      return expectedValue;
    });
    const result = processExpressionValue(
      input,
      securityID,
      processAttributeMock,
      processExpressionMock,
    );
    expect(result).toEqual(expectedValue);
    expect(processAttributeMock).toHaveBeenCalledTimes(0);
    expect(processExpressionMock).toHaveBeenCalledTimes(1);
  });
});

describe("processAttribute() tests", () => {
  it("should return `Fact.value` when provided valid attribute name + security id", () => {
    const expectedResult = "1";
    const result = processAttribute(attributeName, securityID);
    expect(result).toEqual(expectedResult);
  });

  it("should return `Missing Attribute` error message when provided invalid attribute name", () => {
    const result = processAttribute("Invalid Attribute", securityID);
    expect(result).toEqual(Outputs.MISSING_ATTRIBUTE);
  });

  it("should return `Missing Fact` error message when provided invalid security id", () => {
    const result = processAttribute(attributeName, -1);
    expect(result).toEqual(Outputs.MISSING_FACT);
  });
});
