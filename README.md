# Consumer Part of udemy Course "Epic Test Arch. - test everything, everywhere all at once"

(test everything, everywhere)[https://www.udemy.com/course/epic-test-arch-test-everything-everywhere-all-at-once]

A template with tooling, configuration and best practices for a Cy api e2e testing in a Node.js project.

## Setup

```bash
    npm i
```

Use the sample `.env.example` file to create a `.env` file of your own. These values will also have to exist in your CI secrets.

```bash
    SERVERPORT=3001
```

### Scripts

```bash
    npm run lint
    npm run typecheck
    npm run fix:format
    npm run validate # all the above in parallel

    npm run test # unit tests
    npm run test:watch # watch mode

    npm run mock:server # starts the mock backend/provider server

    npm run cy:open-local # open mode
    npm run cy:run-local  # run mode
    npm run cy:run-local-fast  # no video or screen shots
```


#### Articles


(Strengthening Pact Contract Testing with TypeScript and Data Abstraction)[https://dev.to/muratkeremozcan/-strengthening-pact-contract-testing-with-typescript-and-data-abstraction-16hc]
