import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import { hostList, Hosts, VideoData } from './types';

export function extractHostName(url: string): Hosts | undefined {
	if (url.includes('m3u8')) {
		return 'm3u8';
	}
	if (url.includes('dai.ly')) {
		return 'dailymotion';
	}
	const host = hostList
		.find((host) => new RegExp('\\b' + host + '\\b').test(url))
		?.replace('.', '') as Hosts | undefined;
	if (host === 'youtube' && url.includes('playlist')) {
		return 'youtube-playlist';
	}
	if (host === 'twitch' && url.includes('videos')) {
		return 'twitch-vod';
	}

	if (host === 'dailymotion' && url.includes('playlist')) {
		return 'dailymotion-playlist';
	}
	return host;
}

export function extractVideoId(
	host: Hosts,
	string: string
): string | undefined {
	if (!hostList.find((x) => x === host)) return;
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
		case 'youtube-playlist':
			let idYTP = str;
			if (idYTP.includes('?si=')) {
				idYTP = idYTP.slice(0, idYTP.indexOf('?si='));
			}
			if (idYTP.includes('?list=')) {
				idYTP = idYTP.slice(idYTP.indexOf('?list=') + 6);
			}
			if (idYTP.includes('&list=')) {
				idYTP = idYTP.slice(idYTP.indexOf('&list=') + 6);
			}
			return idYTP;
		case 'twitch-vod':
			let idTTVVod = str;
			if (idTTVVod.includes('/videos/')) {
				idTTVVod = idTTVVod.slice(str.indexOf('/videos/') + 8);
			}
			if (idTTVVod.includes('?')) {
				idTTVVod = idTTVVod.slice(0, idTTVVod.indexOf('?'));
			}
			return idTTVVod;
		case 'twitch':
		case 'dailymotion':
		case 'dailymotion-playlist':
		case 'vimeo':
			return str.slice(str.lastIndexOf('/') + 1);
		case 'm3u8':
			return str;
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
