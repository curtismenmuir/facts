export interface DSL {
  expression: Expression;
  security: string;
}

export interface Expression {
  fn: string;
  a: string | number | Expression;
  b: string | number | Expression;
}
