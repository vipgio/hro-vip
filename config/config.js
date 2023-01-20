const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:8000" : "https://hro-vip.vercel.app";

export const API = "https://api.hro.gg/api/v1";

export const CDN = "https://cdn.hro.gg";

export const minPrice = 1;
export const maxPrice = 200000;
