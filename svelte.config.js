import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
    // Automatically chooses the adapter for your current environment, if possible
    // Supported environments: Cloudflare, Netlify, Vercel
		adapter: adapter()
	}
}

export default config
