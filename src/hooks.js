// In this App, some components use browser native modules
// like AudioContext which cause issues during SSR.
// This file prevents server side rendering.
// It is possible to have more granular control and decide
// which pages shall be rendered via SSR and which not
// But let's keep it simple.

/** @param {any} options */
export async function handle({ event, resolve }) {
  return resolve(event, { ssr: false })
}
