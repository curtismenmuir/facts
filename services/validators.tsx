import { DSL, Expression } from "../models";
import { Operators } from "../constants";

/**
 * Function to validate if inputted query is valid DSL. Function returns true
 * when provided valid DSL, else it returns false.
 *
 * @param dsl
 * @returns true / false
 */
export function validateDsl(dsl: DSL): boolean {
  // Validate DSL fields populated
  if (!validateValue(dsl.expression) || !validateValue(dsl.security)) {
    return false;
  }

  // Validate DSL Expression
  return validateExpression(dsl.expression);
}

/**
 * Function to validate a provided Expression has been specified correctly within
 * DSL input. Function returns true when provided a valid DSL Expressions, else it
 * returns false. Function will recursively validate sub-expressions to ensure DSL
 * validity.
 *
 * @param expression
 * @returns true / false
 */
export function validateExpression(expression: Expression): boolean {
  // Validate Expression fields populated
  if (
    !validateValue(expression.fn) ||
    !validateValue(expression.a) ||
    !validateValue(expression.b)
  ) {
    return false;
  }

  // Validate `fn` is valid operator
  if (!validateOperator(expression.fn)) {
    return false;
  }

  // Validate `a` when Expression
  let result: boolean;
  if (typeof expression.a !== "string" && typeof expression.a !== "number") {
    result = validateExpression(expression.a);
    if (!result) {
      return false;
    }
  }

  // Validate `b` when Expression
  if (typeof expression.b !== "string" && typeof expression.b !== "number") {
    result = validateExpression(expression.b);
    if (!result) {
      return false;
    }
  }

  return true;
}

/**
 * Function to validate if provided `fn` value matches a supported operator.
 * Function returns true when provided valid operator, else it returns false.
 *
 * @param value
 * @returns true / false
 */
export function validateOperator(value: string) {
  let validOperator = Operators.find((item) => item === value);
  if (!validOperator) {
    return false;
  }

  return true;
}

/**
 * Function to validate if a provided value has been populated in provided DSL.
 * Function returns true if values is populate, else it returns false.
 *
 * @param value
 * @returns true / false
 */
export function validateValue(value: Expression | string | number) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  return true;
}
