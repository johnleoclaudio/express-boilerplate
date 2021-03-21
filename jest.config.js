module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxConcurrency: 1,
  testPathIgnorePatterns: ["/node_modules/", "/config"],
  globals: {}
};
