export type BldrTheme = "black" | "white";

export const THEME_STORAGE_KEY = "bldr-theme";
export const THEME_ATTRIBUTE = "data-bldr-theme";

/** Inline, render-blocking: restores a saved palette before first paint. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="white"||t==="black"){document.documentElement.setAttribute("${THEME_ATTRIBUTE}",t)}}catch(e){}})()`;
