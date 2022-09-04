import attributes from "../data/attributes.json";
import facts from "../data/facts.json";
import securities from "../data/securities.json";
import { DSL } from "../models";
import { Outputs } from "../constants";
import { validateDsl } from "./validators";

/**
 * Function to process users inputted query as DSL.
 * Function will return "Invalid JSON" error message when input is invalid JSON.
 * Function will return "Invalid DSL" error message when input is invalid DSL.
 * Function will return "Missing Security" error message when security value not found.
 *
 * @param query
 * @returns Output (as string)
 */
export function processDsl(query: string): string {
  try {
    // Parse DSL from query
    let dsl: DSL = JSON.parse(query);
    // Validate DSL
    if (!validateDsl(dsl)) {
      return Outputs.INVALID_DSL;
    }

    // Validate security exists
    let securityItem = securities.find((item) => item.symbol === dsl.security);
    if (!securityItem) {
      return Outputs.MISSING_SECURITY;
    }

    // TODO process DSL
  } catch {
    return Outputs.INVALID_JSON;
  }

  return Outputs.NOT_IMPLEMENTED;
}
