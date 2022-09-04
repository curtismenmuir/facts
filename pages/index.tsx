import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState, useEffect } from "react";
import styles from "./index.module.css";
import { processDsl } from "../services/dsl";

interface DSLExample {
  id: string;
  label: string;
  dsl: string;
}

const examples: readonly DSLExample[] = [
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

const Home: NextPage = () => {
  // Expression
  const [expression, setExpression] = useState<string>(examples[0].dsl);
  const setDsl = (dsl: string) => () => {
    setExpression(dsl);
    setOutput("");
  };
  // Output
  const [output, setOutput] = useState<string>("");
  const onRun = () => {
    setOutput(processDsl(expression));
  };

  return (
    <>
      <Head>
        <title>{"Facts"}</title>
        <meta name={"description"} content={"Facts code challenge"} />
      </Head>

      <main className={styles.container}>
        <h1>{"Welcome to facts!"}</h1>
        <p>
          {"Enter the DSL query below and press the "}
          <strong>
            <q>{"run"}</q>
          </strong>
          {" button to evaluate it."}
        </p>

        {/* Pre-canned Examples Section */}
        <div className={styles.section}>
          <p id={"pre-canned-description"}>
            <strong>{"Pre-canned examples:"}</strong>
          </p>
          <nav
            className={styles.navigation}
            aria-describedby={"pre-canned-description"}>
            {examples.map(({ id, label, dsl }) => (
              <button
                type={"button"}
                onClick={setDsl(dsl)}
                key={id}
                data-testid={`button-${id}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* DSL Editor Section */}
        <div className={styles.section}>
          <label htmlFor={"dsl-expression"}>{"DSL Expression:"}</label>
          <textarea
            id={"dsl-expression"}
            className={styles.field}
            data-testid={"expression-input"}
            placeholder={"Enter your DSL"}
            value={expression}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setExpression(e.target.value)
            }
            rows={8}
          />
          <div className={[styles.message, styles.messageSuccess].join(" ")}>
            {"DSL query ran successfully!"}
          </div>
          <div className={[styles.message, styles.messageError].join(" ")}>
            {"There is a problem with your DSL query."}
          </div>
          <button data-testid={"run-button"} type={"button"} onClick={onRun}>
            {"Run"}
          </button>
        </div>

        {/* DSL Output Section */}
        <div className={styles.section}>
          <label htmlFor={"dsl-output"}>{"Output:"}</label>
          <textarea
            id={"dsl-output"}
            className={styles.field}
            readOnly
            value={output}
            rows={1}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
