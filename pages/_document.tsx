import { Head, Html, Main, NextScript } from "next/document";
import { FunctionComponent } from "react";

const Document: FunctionComponent<{}> = () => {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
