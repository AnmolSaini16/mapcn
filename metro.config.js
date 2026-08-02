const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const withNativeWindConfig = withNativeWind(config, {
  inlineRem: 16,
});

const maplibreWebShim = path.resolve(
  __dirname,
  "src/lib/maplibre-react-native.web.ts",
);

const originalResolveRequest = withNativeWindConfig.resolver.resolveRequest;

withNativeWindConfig.resolver.resolveRequest = (
  context,
  moduleName,
  platform,
) => {
  if (platform === "web" && moduleName === "@maplibre/maplibre-react-native") {
    return {
      filePath: maplibreWebShim,
      type: "sourceFile",
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWindConfig;
