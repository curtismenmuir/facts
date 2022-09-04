# Facts

## :collision: Important

- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- Find full details of project spec [here](./SPEC.md)

## :arrow_up: How to setup project

**Step 1:** git clone this repo

**Step 2:** Ensure [NodeJS](https://nodejs.org/en/) is installed on machine

- NOTE: Use [Node Version Manager](https://github.com/nvm-sh/nvm) where applicable

**Step 3:** Ensure [Yarn](https://yarnpkg.com/) is installed on machine

**Step 4:** Install project dependencies `npm install`

## :fast_forward: How to run development build

**Step 1:** Complete Setup instructions above

**Step 2:** Run the development server: `yarn dev`

**Step 3:** Navigating to: `http://localhost:3000`

## :arrow_forward: How to run production build

**Step 1:** Complete Setup instructions above

**Step 2:** Build project: `yarn build`

**Step 3:** Start project: `yarn start -p 3030`

**Step 4:** Navigating to: `http://localhost:3030`

## :rotating_light: Unit Tests

- Run tests: `yarn test`
- Run tests with hot reloading: `yarn test:hot`
- Run tests with coverage output: `yarn test:coverage`

## :cop: Linting

- Run linter: `yarn lint`

## :soon: Future Improvements

- Format `attributes`, `securities` & `facts` into map / dictionary?
  - Would allow for fast lookup of values (O1 space/time complexity)
- Update UI with Green / Red popup values?
