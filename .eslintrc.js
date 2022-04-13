module.exports = {
    root: true,
    extends: ["@hokify"],
    rules: {
      "no-multiple-empty-lines": ["error", { max: 5, maxBOF: 0, maxEOF: 0 }],
    },
  };
  