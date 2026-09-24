import { useId } from "react";

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.presentme.app";

// Each SVG needs its own gradient id: if two share one and the first is hidden, the second loses its fill
export const useSvgId = (prefix) => `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
