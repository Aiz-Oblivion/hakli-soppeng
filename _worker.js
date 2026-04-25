// Cloudflare Pages Worker — handle routing
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
