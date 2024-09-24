'use client';

import styles from './room.module.scss';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Loading from '@/app/components/Loading';
import {
	ChatData,
	Hosts,
	SocketType,
	UserData,
	VideoData,
} from '@/app/libs/types';
import Chat from '@/app/components/Chat';
import Playlist from '@/app/components/Playlist';
import ReactPlayer from 'react-player';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import {
	extractVideoId,
	formatFetchError,
	getVideoData,
} from '@/app/libs/utils';

export default function Room() {
	const { roomId }: { roomId: string } = useParams();
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [searchResults, setSearchResults] = useState<VideoData[] | null>(null);
	const [videoData, setVideoData] = useState<VideoData[]>([]);
	const [showNavbar, setShowNavbar] = useState<boolean>(true);
	const [showChat, setShowChat] = useState<boolean>(true);
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [chatData, setChatData] = useState<ChatData>({
		userList: [],
		messageList: [],
		videoList: [],
	});
	const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
	const [videoPlaybackTime, setVideoPlaybackTime] = useState<number>(0);

	const router = useRouter();

	useEffect(() => {
		if (roomId.length < 6) {
			router.push('/');
		}
	}, [roomId, router]);

	useEffect(() => {
		if (!roomId) {
			return;
		}
		const newSocket = io(`${process.env.NEXT_PUBLIC_API_URI}/rooms`, {
			query: { roomId },
			withCredentials: true,
		});
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [roomId]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on('oops', (error) => {
			console.error(error);
		});
		socket.on('all_room_data', (roomData) => {
			setUserData(roomData.userData);
			setChatData({
				userList: roomData.userList,
				messageList: roomData.messageList,
				videoList: roomData.videoList,
			});
		});
		socket.on('new_user_joined', (userData) => {
			setChatData((prevState) => ({
				userList: [...prevState.userList, userData],
				messageList: prevState.messageList,
				videoList: prevState.videoList,
			}));
		});
		socket.on('new_message_received', (messageData) => {
			setChatData((prevState) => ({
				userList: prevState.userList,
				messageList: [...prevState.messageList, messageData],
				videoList: prevState.videoList,
			}));
		});
		socket.on('new_video_added', (videoData) => {
			setVideoData(videoData);
		});
		socket.on('start_video_playback', () => {
			setVideoPlaying(true);
		});
		socket.on('stop_video_playback', () => {
			setVideoPlaying(false);
		});
		socket.on('jump_to_video_time', (data) => {
			setVideoPlaybackTime(data.time);
		});

		return () => {
			socket.off();
		};
	}, [socket]);

	function handleSendMessage(message: string) {
		if (!socket || !roomId) return;
		socket.emit('send_message', {
			roomId: roomId,
			message: message,
		});
	}

	async function handleSearchVideo(host: Hosts, string: string) {
		try {
			if (!host || !string) return;
			setFetching(true);
			const id = extractVideoId(host, string);
			if (!id) {
				setError('Unsupported host or incorrect Id');
				return;
			}
			const data = await getVideoData(host, id);
			setSearchResults(data);
			setFetching(false);
		} catch (error) {
			setError(
				formatFetchError(error).statusText ||
					'Unknown fetching error. Make sure you selected correct source.'
			);
			setFetching(false);
		}
	}

	function handleAddVideo(video: VideoData) {
		if (!socket || !video) return;
		socket.emit('add_video', { roomId, video });
	}

	function handlePlayVideo() {
		if (!socket || !roomId) return;
		socket.emit('start_video_playback', {
			roomId: roomId,
		});
	}

	function handleStopVideo() {
		if (!socket || !roomId) return;
		socket.emit('stop_video_playback', {
			roomId: roomId,
		});
	}

	function handleVideoSeek(time: number) {
		if (!socket || !roomId || !time) return;
		socket.emit('jump_to_video_time', {
			roomId: roomId,
			time: time,
		});
	}

	function handleVideoChange(videoId: string) {
		if (!socket || !roomId || !videoId) return;
		socket.emit('change_video', {
			roomId: roomId,
			videoId: videoId,
		});
	}

	function handleVideoEnded() {
		if (!socket || !roomId) return;
		socket.emit('video_ended', {
			roomId: roomId,
		});
	}

	function dismissError() {
		setError(null);
	}

	function toggleNavbarVisibility() {
		setShowNavbar((prevState) => !prevState);
	}

	function toggleSidebar() {
		setShowChat((prevState) => !prevState);
	}

	return (
		<>
			<Navbar
				searchVideo={handleSearchVideo}
				searchResults={searchResults}
				addVideo={handleAddVideo}
				showNavbar={showNavbar}
				toggleNavbar={toggleNavbarVisibility}
				showChat={showChat}
				toggleSidebar={toggleSidebar}
			/>
			{error && !!videoData.length && (
				<div className={styles['error-absolute']} onClick={dismissError}>
					{error}
				</div>
			)}
			<main
				className={`${styles['main']} ${
					showNavbar ? 'pt-[48px]' : 'pt-0'
				} flex flex-col`}
			>
				<div className='flex-1 flex flex-col lg:flex-row gap-4 m-2 lg:m-4'>
					<div className={`${styles['video']} flex-1 flex flex-col relative`}>
						{videoData[0] && (
							<ReactPlayer
								className='absolute top-0 left-0'
								url={videoData[0].url}
								width={'100%'}
								height={'100%'}
								muted={true}
								controls={true}
								loop={false}
								playing={videoPlaying}
								onProgress={({ playedSeconds }) =>
									setVideoPlaybackTime(playedSeconds)
								}
								onSeek={(seconds) => handleVideoSeek(seconds)}
								onEnded={handleVideoEnded}
							/>
						)}
					</div>
					{fetching && (
						<div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-700/75'>
							<Loading
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							/>
						</div>
					)}
					{error && !videoData.length && (
						<div className={styles.error} onClick={dismissError}>
							{error}
						</div>
					)}
					<div className='min-w-[240px] lg:w-1/4 relative'>
						<Chat
							userList={chatData.userList}
							chatMessages={chatData.messageList}
							sendMessage={handleSendMessage}
						/>
						<Playlist
							show={!showChat}
							playlist={videoData}
							changeVideo={handleVideoChange}
						/>
					</div>
				</div>
			</main>
		</>
	);
}
