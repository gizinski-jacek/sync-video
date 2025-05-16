import { Socket } from 'socket.io-client';

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface UserData {
	id: string;
	name: string;
}

export interface MessageData {
	id: string;
	user: UserData;
	message: string;
	timestamp: number;
}

export interface RoomData {
	ownerData: UserData;
	id: string;
	createdAt: number;
	userList: UserData[];
	messageList: MessageData[];
	videoList: VideoData[];
}

type ServerToClientEvents = {
	oops: (error: any) => void;
	all_room_data: (data: { userData: UserData; roomData: RoomData }) => void;
	user_leaving: (data: { userList: UserData[] }) => void;
	new_chat_message: (data: { messageList: MessageData[] }) => void;
	new_video_added: (data: { videoList: VideoData[] }) => void;
	video_removed: (data: { videoList: VideoData[] }) => void;
	start_video: (data: { videoProgress: number }) => void;
	stop_video: () => void;
	video_progress: (data: { videoProgress: number }) => void;
	playback_rate_change: (data: { playbackRate: number }) => void;
	clear_playlist: () => void;
	change_video: (data: { videoList: VideoData[] }) => void;
	reorder_video: (data: { videoList: VideoData[] }) => void;
	video_ended: (data: { videoList: VideoData[] }) => void;
	error: (message: string) => void;
};

type ClientToServerEvents = {
	new_chat_message: (data: { roomId: string; message: string }) => void;
	new_video_added: (data: { roomId: string; video: VideoData }) => void;
	video_removed: (data: { roomId: string; video: VideoData }) => void;
	start_video: (data: { roomId: string }) => void;
	stop_video: (data: { roomId: string }) => void;
	video_progress: (data: { roomId: string; videoProgress: number }) => void;
	playback_rate_change: (data: {
		roomId: string;
		playbackRate: number;
	}) => void;
	clear_playlist: (data: { roomId: string }) => void;
	change_video: (data: { roomId: string; video: VideoData }) => void;
	reorder_video: (data: {
		roomId: string;
		video: VideoData;
		targetIndex: number;
	}) => void;
	video_ended: (data: { roomId: string; video: VideoData }) => void;
};

export type Hosts =
	| 'youtube'
	| 'youtu.be'
	| 'youtube-playlist'
	| 'twitch'
	| 'twitch-vod'
	| 'dailymotion'
	| 'dai.ly'
	| 'dailymotion-playlist'
	| 'vimeo'
	| 'm3u8';

export const hostList: Hosts[] = [
	'youtube',
	'youtu.be',
	'youtube-playlist',
	'twitch',
	'twitch-vod',
	// 'dailymotion',
	// 'dai.ly',
	// 'dailymotion-playlist',
	'vimeo',
	'm3u8',
];

export interface VideoData {
	host: Hosts;
	id: string;
	url: string;
	title: string | null;
	channelId: string | null;
	channelName: string;
	livestreamChat: boolean;
	thumbnailUrl: string | null;
}

export interface YoutubeResponse {
	kind: string;
	etag: string;
	nextPageToken: string;
	prevPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YoutubeVideo[];
}

export interface YoutubeVideo {
	kind: string;
	etag: string;
	id: string;
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: {
			[key: string]: {
				url: string;
				width: number;
				height: number;
			};
		};
		channelTitle: string;
		tags: string[];
		categoryId: string;
		liveBroadcastContent: string;
		defaultLanguage: string;
		localized: {
			title: string;
			description: string;
		};
		defaultAudioLanguage: string;
	};
}

export interface TwitchAuth {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export interface TwitchLivestream {
	data: {
		id: string;
		user_id: string;
		user_login: string;
		user_name: string;
		game_id: string;
		game_name: string;
		type: string;
		title: string;
		viewer_count: number;
		started_at: string;
		language: string;
		thumbnail_url: string;
		tag_ids: string[];
		tags: string[];
		is_mature: boolean;
	}[];
}
export interface TwitchVOD {
	data: {
		id: string;
		stream_id: null;
		user_id: string;
		user_login: string;
		user_name: string;
		title: string;
		description: string;
		created_at: string;
		published_at: string;
		url: string;
		thumbnail_url: string;
		viewable: string;
		view_count: number;
		language: string;
		type: string;
		duration: string;
		muted_segments: {
			duration: number;
			offset: number;
		}[];
	}[];
	pagination: {};
}

export interface DailymotionVideo {
	id: string;
	title: string;
	'owner.id': string;
	'owner.username': string;
}

export interface DailymotionPlaylist {
	id: string;
	name: string;
	'owner.id': string;
	'owner.username': string;
}

export interface VimeoVideo {
	uri: string;
	name: string;
	type: string;
	user: {
		uri: string;
		name: string;
		link: string;
	};
}
