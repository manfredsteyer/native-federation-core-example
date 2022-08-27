const {
  withNativeFederation,
  shareAll,
} = require("@softarc/native-federation/build");

module.exports = withNativeFederation({
  name: "remote",

  exposes: {
    "./module": "remote/src/is-long-weekend.ts",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
      includeSecondaries: false,
    }),
  },

  // skip: [
  //   '@softarc/native-federation'
  // ]
});
