export const Examples = [
  {
    id: "multiply",
    label: "Simple multiplication",
    dsl: `{
    "expression": {"fn": "*", "a": "sales", "b": 2},
    "security": "ABC"
}`,
  },
  {
    id: "divide",
    label: "Simple division",
    dsl: `{
    "expression": {"fn": "/", "a": "price", "b": "eps"},
    "security": "BCD"
}`,
  },
  {
    id: "nested",
    label: "Nested expression",
    dsl: `{
    "expression": {
    "fn": "-", 
    "a": {"fn": "-", "a": "eps", "b": "shares"}, 
    "b": {"fn": "-", "a": "assets", "b": "liabilities"}
    },
    "security": "CDE"
}`,
  },
  {
    id: "invalid-json",
    label: "Invalid JSON",
    dsl: `{
    "expression": {"fn": "+", "a": "price", "b": "eps"},
    "security": "BCD"
`,
  },
  {
    id: "invalid-dsl",
    label: "Invalid DSL",
    dsl: `{
    "wrong": 123,
    "security": "BCD"
}`,
  },
  {
    id: "missing-security",
    label: "Missing security",
    dsl: `{
    "expression": {"fn": "*", "a": "sales", "b": 2},
    "security": "ZZZ"
}`,
  },
];
