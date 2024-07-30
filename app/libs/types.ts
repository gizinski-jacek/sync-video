import { Socket } from 'socket.io-client';

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface UserData {
	id: string;
	name: string;
}

export interface ChatMessage {
	user: UserData;
	message: string;
	timestamp: string;
}

export interface VideoData {
	id: string;
	url: string;
}

export interface ChatData {
	userList: UserData[];
	messageList: ChatMessage[];
	videoList: VideoData[];
}

type ServerToClientEvents = {
	oops: (error: any) => void;
	all_data: (data: {
		userData: UserData;
		userList: UserData[];
		messageList: ChatMessage[];
		videoList: VideoData[];
	}) => void;
	new_user: (chatData: UserData) => void;
	new_message: (message: {
		user: UserData;
		message: string;
		timestamp: string;
	}) => void;
	new_video: (video: VideoData[]) => void;
};

type ClientToServerEvents = {
	send_message: (data: { roomId: string; message: string }) => void;
	add_video: (data: { roomId: string; video: string }) => void;
};
