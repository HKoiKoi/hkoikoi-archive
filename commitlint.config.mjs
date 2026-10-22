const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "perf",
        "chore",
        "build",
        "ci",
      ],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 72],
  },
};

export default config;
