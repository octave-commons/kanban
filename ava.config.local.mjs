// Local AVA config for Stryker mutation testing
const kanbanConfig = {
  files: [
    "dist/tests/**/*.test.js",
    "!dist/tests/**/*integration*.test.js",
    "!dist/tests/**/*e2e*.test.js"
  ],
  nodeArguments: ["--loader", "esmock"],
  timeout: "30s",
  concurrency: 1,
  verbose: true
};

export default kanbanConfig;