const PREVIEW_BASE_PATH = "/images/previews";

export function getPreviewImages(name: string) {
  return {
    light: `${PREVIEW_BASE_PATH}/${name}.png`,
    dark: `${PREVIEW_BASE_PATH}/dark/${name}.png`,
  };
}

export function getBlockPreviewImages(blockName: string) {
  return {
    light: `${PREVIEW_BASE_PATH}/blocks/${blockName}.png`,
    dark: `${PREVIEW_BASE_PATH}/dark/blocks/${blockName}.png`,
  };
}
