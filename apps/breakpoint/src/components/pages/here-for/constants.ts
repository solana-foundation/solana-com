// Plain (non-"use client") module so server components can read these values;
// importing them from client.ts on the server yields client references instead.
export const HERE_FOR_PATH = "/mutuals";
export const EGG_COUPON_CODE = "BP26-HARKL";
export const EGG_COUPON_HREF = `https://luma.com/breakpoint2026?coupon=${EGG_COUPON_CODE}`;
