import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import { Hosts, VideoData } from './types';

export function extractHostName(url: string): Hosts | undefined {
	const hostList = ['youtube', 'youtu.be'];
	const host = hostList
		.find((host) => new RegExp('\\b' + host + '\\b').test(url))
		?.replace('.', '') as Hosts | undefined;
	return host;
}

export function extractVideoId(
	host: Hosts,
	string: string
): string | undefined {
	const supportedHostList = ['youtube'];
	if (!supportedHostList.find((x) => x === host)) return;
	const str =
		string[string.length - 1] === '/'
			? string.slice(0, string.length - 1)
			: string;

	switch (host) {
		case 'youtube':
			let idYT = str;
			if (idYT.includes('?si=')) {
				idYT = idYT.slice(0, idYT.indexOf('?si='));
			}
			if (idYT.includes('?v=')) {
				idYT = idYT.slice(idYT.indexOf('?v=') + 3);
			}
			if (idYT.includes('.be/')) {
				idYT = idYT.slice(idYT.indexOf('.be/') + 4);
			}
			if (idYT.includes('/live/')) {
				idYT = idYT.slice(idYT.indexOf('/live/') + 6);
			}
			if (idYT.includes('?list=')) {
				idYT = idYT.slice(0, idYT.indexOf('?list='));
			}
			if (idYT.includes('&list=')) {
				idYT = idYT.slice(0, idYT.indexOf('&list='));
			}
			return idYT;

		default:
			break;
	}
}

export async function getVideoData(url: string): Promise<VideoData[]> {
	try {
		if (!url) {
			throw new Error('Provide video url');
		}
		const host = extractHostName(url);
		if (!host) {
			throw new Error('Unsupported video host');
		}
		const id = extractVideoId(host, url);
		if (!id) {
			throw new Error('Unsupported video host or incorrect Id');
		}
		const res: AxiosResponse<VideoData[]> = await axios.get(
			`/api/${host}?id=${id}`,
			{ timeout: 5000 }
		);
		return res.data;
	} catch (error: unknown) {
		throw formatFetchError(error);
	}
}

export function formatFetchError(error: unknown): NextResponse<{
	error: string;
}> {
	if (error instanceof AxiosError) {
		return NextResponse.json(
			{ error: error.response?.data.error || 'Unknown server error' },
			{
				status: error.status || 500,
				statusText: error.response?.data.error || 'Unknown server error',
			}
		);
	} else {
		return NextResponse.json(
			{ error: (error as Error)?.message || 'Unknown server error' },
			{
				status: 500,
				statusText: (error as Error)?.message || 'Unknown server error',
			}
		);
	}
}
