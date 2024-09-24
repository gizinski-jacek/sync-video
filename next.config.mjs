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
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*ytimg.com',
				port: '',
			},
		],
	},
};

export default nextConfig;
