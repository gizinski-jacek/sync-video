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
	id: string;
	createdAt: number;
	userList: UserData[];
	messageList: MessageData[];
	videoList: VideoData[];
}

export interface AllRoomData {
	userData: UserData;
	roomData: RoomData;
}

type ServerToClientEvents = {
	oops: (error: any) => void;
	all_room_data: (data: AllRoomData) => void;
	new_user_joined: (userData: UserData) => void;
	new_message_received: (messageData: MessageData[]) => void;
	new_video_added: (videoData: VideoData[]) => void;
	video_was_removed: (videoData: VideoData[]) => void;
	// ! Unfinished
	start_video_playback: () => void;
	stop_video_playback: () => void;
	video_seek: (seconds: number) => void;
	change_video: (data: { roomId: string; videoId: string }) => void;
	video_ended: (data: { roomId: string; time: number }) => void;
	error: (message: string) => void;
};

type ClientToServerEvents = {
	send_message: (data: { roomId: string; message: string }) => void;
	add_video: (data: { roomId: string; video: VideoData }) => void;
	remove_video: (data: { roomId: string; video: VideoData }) => void;
	// ! Unfinished
	start_video_playback: (roomId: string) => void;
	stop_video_playback: (roomId: string) => void;
	video_seek: (data: { roomId: string; time: number }) => void;
	change_video: (data: { roomId: string; videoId: string }) => void;
	video_ended: (data: { roomId: string; videoId: string }) => void;
};

export type Hosts = 'youtube';

export interface VideoData {
	host: Hosts;
	id: string;
	url: string;
	title: string | null;
	channelId: string | null;
	channelName: string;
	iFrameSrcId: string;
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
