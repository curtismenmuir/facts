import attributes from "../data/attributes.json";
import facts from "../data/facts.json";
import securities from "../data/securities.json";
import { DSL, Expression } from "../models";
import { Outputs } from "../constants";
import { validateDsl } from "./validators";

/**
 * Function to process users inputted query as DSL.
 * Function will return result of DSL query when successful (as string).
 * Function will return "Invalid JSON" error message when input is invalid JSON.
 * Function will return "Invalid DSL" error message when input is invalid DSL.
 * Function will return "Missing Security" error message when Security value not found.
 * Function will return "Missing Attribute" error message when Attribute value not found.
 * Function will return "Missing Fact" error message when Fact value not found.
 *
 * @param query
 * @returns Output (as string)
 */
export function processDsl(query: string): string {
  // Parse DSL from query
  let dsl: DSL;
  try {
    dsl = JSON.parse(query);
  } catch {
    return Outputs.INVALID_JSON;
  }

  // Validate DSL
  if (!validateDsl(dsl)) {
    return Outputs.INVALID_DSL;
  }

  // Validate security exists
  let securityItem = securities.find((item) => item.symbol === dsl.security);
  if (!securityItem) {
    return Outputs.MISSING_SECURITY;
  }

  // Process Expression
  return processExpression(
    dsl.expression,
    securityItem.id,
    processExpressionValue,
  );
}

/**
 * Function to process a provided Expression.
 * Function will return `value` (as string) when provided a valid Expression.
 * Function will return `Missing Attribute` error message when unable to find matching Attribute record.
 * Function will return `Missing Fact` error message when unable to find matching Attribute record.
 *
 * @param expression
 * @param securityID
 * @returns value / error message (as string)
 */
export function processExpression(
  expression: Expression,
  securityID: number,
  _processExpressionValue: Function,
): string {
  // Process `a`
  const a: string = _processExpressionValue(
    expression.a,
    securityID,
    processAttribute,
    processExpression,
  );
  if (a === Outputs.MISSING_ATTRIBUTE || a === Outputs.MISSING_FACT) {
    return a;
  }

  // Process `b`
  const b: string = _processExpressionValue(
    expression.b,
    securityID,
    processAttribute,
    processExpression,
  );
  if (b === Outputs.MISSING_ATTRIBUTE || b === Outputs.MISSING_FACT) {
    return b;
  }

  // Process final value
  return `${eval(`${a} ${expression.fn} ${b}`)}`;
}

/**
 * Function to process an `a` or `b` value of an expression. Function will process value whether it
 * is a number, Attribute name (string), or Sub-Expression.
 * Function returns `value` when provided a valid input.
 * Function will return `Missing Attribute` error message when unable to find matching Attribute record.
 * Function will return `Missing Fact` error message when unable to find matching Attribute record.
 *
 * @param input
 * @param securityID
 * @returns value / error message (as string)
 */
export function processExpressionValue(
  input: string | number | Expression,
  securityID: number,
  _processAttribute: Function,
  _processExpression: Function,
): string {
  switch (typeof input) {
    case "number":
      // Return number value as string when provided number value
      return `${input}`;
    case "string":
      // Process Attribute value when provided string value
      return _processAttribute(input, securityID);
    default:
      // Process Expression value when provided sub-expression value
      return _processExpression(input, securityID, processExpressionValue);
  }
}

/**
 * Function will search for a provided Attribute name (as string), and if found will attempt to find the
 * relevant Fact record based on Attribute + provided Security ID.
 * Function returns `value` (as string) when provided valid Attribute name + Security ID.
 * Function will return `Missing Attribute` error message when unable to find matching Attribute record.
 * Function will return `Missing Fact` error message when unable to find matching Attribute record.
 *
 * @param value
 * @param securityID
 * @returns Fact.value / error message (as string)
 */
export function processAttribute(value: string, securityID: number): string {
  // Search for matching Attribute
  const attribute = attributes.find((item) => item.name === value);
  if (!attribute) {
    return Outputs.MISSING_ATTRIBUTE;
  }

  // Search for matching Fact
  const fact = facts.find(
    (item) =>
      item.attribute_id === attribute?.id && item.security_id === securityID,
  );
  if (!fact) {
    return Outputs.MISSING_FACT;
  }

  // Return resolved value
  return `${fact.value}`;
}
