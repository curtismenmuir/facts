import "@testing-library/jest-dom";
import { Outputs } from "../../constants";
import { processDsl } from "../../services/dsl";

describe("processDsl() tests", () => {
  it("should return `Not Implemented` error message when provided valid DSL", () => {
    const query = `{ "expression": { "fn": "+", "a": 3, "b": 3 }, "security": "ABC" }`;
    const result = processDsl(query);
    expect(result).toEqual(Outputs.NOT_IMPLEMENTED);
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
});
