import { VideoData, YoutubeResponse } from '@/app/libs/types';
import { formatFetchError } from '@/app/libs/utils';
import axios, { AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import querystring from 'querystring';

export async function GET(
	req: NextRequest
): Promise<NextResponse<VideoData[] | { error: string }>> {
	try {
		if (!process.env.YOUTUBE_API_KEY) {
			console.error('Provide YOUTUBE_API_KEY env variables');
			throw NextResponse.json(
				{ error: 'Unknown server error' },
				{ status: 500 }
			);
		}
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		if (!id)
			throw NextResponse.json(
				{ error: 'Provide video link or id' },
				{ status: 400 }
			);
		const query = querystring.stringify({
			id: id,
			key: process.env.YOUTUBE_API_KEY,
			part: ['snippet', 'id'],
		});
		const res: AxiosResponse<YoutubeResponse> = await axios.get(
			'https://youtube.googleapis.com/youtube/v3/playlists?' + query,
			{ timeout: 10000 }
		);
		const data: VideoData[] = res.data.items.map((item) => {
			return {
				host: 'youtube',
				id: item.id,
				url: 'https://www.youtube.com/watch?v=' + item.id,
				title: item.snippet.title,
				channelId: item.snippet.channelId,
				channelName: item.snippet.channelTitle,
				iFrameSrcId: item.id,
				livestreamChat: item.snippet.liveBroadcastContent === 'live',
				thumbnailUrl: item.snippet.thumbnails.default.url,
			};
		});
		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
