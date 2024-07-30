/** @type {import('next').NextConfig} */
const nextConfig = {
	redirects() {
		return [
			{
				source: '/room',
				destination: '/',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
