import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Home from "../pages";
import { Examples, Outputs } from "../constants";

describe("Index page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("should set the initial value of the expression", () => {
    expect(screen.getByTestId("expression-input")).toHaveValue(Examples[0].dsl);
  });

  it("should set the expression + clear output when an example button is clicked", () => {
    // Press run button to fill output text
    fireEvent.click(screen.getByTestId("run-button"));
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    // Press example button
    fireEvent.click(screen.getByTestId("button-divide"));
    // Verify result
    expect(screen.getByTestId("expression-input")).toHaveValue(Examples[1].dsl);
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
  });

  it("should update expression when textarea is updated manually", () => {
    // Simulate onChange event
    const value = "some value";
    fireEvent.change(screen.getByTestId("expression-input"), {
      target: { value: value },
    });
    // Verify updates
    expect(screen.getByTestId("expression-input")).toHaveValue(value);
  });

  it('should evaluate the expression when the "run" button is clicked for `multiply` example', () => {
    const expectedValue = "8";
    // Ensure output box empty
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
    // Press `run` button
    fireEvent.click(screen.getByTestId("run-button"));
    // Verify output updated
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    expect(screen.getByTestId("output-text-area")).toHaveValue(expectedValue);
  });

  it('should evaluate the expression when the "run" button is clicked for `divide` example', () => {
    const expectedValue = "0.5";
    // Set divide example
    fireEvent.click(screen.getByTestId("button-divide"));
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
    // Press `run` button
    fireEvent.click(screen.getByTestId("run-button"));
    // Verify output
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    expect(screen.getByTestId("output-text-area")).toHaveValue(expectedValue);
  });

  it('should evaluate the expression when the "run" button is clicked for `nested` example', () => {
    const expectedValue = "-21";
    // Set nested example
    fireEvent.click(screen.getByTestId("button-nested"));
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
    // Press `run` button
    fireEvent.click(screen.getByTestId("run-button"));
    // Verify output
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    expect(screen.getByTestId("output-text-area")).toHaveValue(expectedValue);
  });

  it('should evaluate the expression when the "run" button is clicked for `invalid-json` example', () => {
    const expectedValue = Outputs.INVALID_JSON;
    // Set invalid-json example
    fireEvent.click(screen.getByTestId("button-invalid-json"));
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
    // Press `run` button
    fireEvent.click(screen.getByTestId("run-button"));
    // Verify output
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    expect(screen.getByTestId("output-text-area")).toHaveValue(expectedValue);
  });

  it('should evaluate the expression when the "run" button is clicked for `invalid-dsl` example', () => {
    const expectedValue = Outputs.INVALID_DSL;
    // Set invalid-dsl example
    fireEvent.click(screen.getByTestId("button-invalid-dsl"));
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
    // Press `run` button
    fireEvent.click(screen.getByTestId("run-button"));
    // Verify output
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    expect(screen.getByTestId("output-text-area")).toHaveValue(expectedValue);
  });

  it('should evaluate the expression when the "run" button is clicked for `missing-security` example', () => {
    const expectedValue = Outputs.MISSING_SECURITY;
    // Set missing-security example
    fireEvent.click(screen.getByTestId("button-missing-security"));
    expect(screen.getByTestId("output-text-area")).toHaveValue("");
    // Press `run` button
    fireEvent.click(screen.getByTestId("run-button"));
    // Verify output
    expect(screen.getByTestId("output-text-area")).not.toHaveValue("");
    expect(screen.getByTestId("output-text-area")).toHaveValue(expectedValue);
  });
});
