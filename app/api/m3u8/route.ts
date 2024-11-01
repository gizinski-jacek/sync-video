import { VideoData } from '@/app/libs/types';
import { formatFetchError } from '@/app/libs/utils';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
	req: NextRequest
): Promise<NextResponse<VideoData[] | { error: string }>> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		if (!id)
			return NextResponse.json(
				{ error: 'Provide video link or id' },
				{ status: 400 }
			);
		// Checks whether the link is valid
		const test = await axios.get(id);
		const data: VideoData = {
			host: 'm3u8',
			id: id,
			url: id,
			title: null,
			channelId: null,
			channelName: 'stream',
			livestreamChat: false,
			thumbnailUrl: null,
		};
		return NextResponse.json([data], { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
