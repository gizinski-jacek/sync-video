'use client';

import styles from './room.module.scss';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { RoomData, SocketType, UserData, VideoData } from '@/app/libs/types';
import Chat from '@/app/components/Chat';
import Playlist from '@/app/components/Playlist';
import ReactPlayer from 'react-player';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { getVideoData } from '@/app/libs/utils';
import { NextResponse } from 'next/server';

export default function Room() {
	const { roomId }: { roomId: string } = useParams();

	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [searchResults, setSearchResults] = useState<VideoData[] | null>(null);
	const [showNavbar, setShowNavbar] = useState<boolean>(true);
	const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [roomData, setRoomData] = useState<RoomData | null>(null);
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
		socket.on('all_room_data', (data) => {
			const { userData, roomData } = data;
			setUserData(userData);
			setRoomData(roomData);
		});
		socket.on('new_user_joined', (userData) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					id: prevState.id,
					createdAt: prevState.createdAt,
					userList: [...prevState.userList, userData],
					messageList: prevState.messageList,
					videoList: prevState.videoList,
				};
			});
		});
		socket.on('new_message_received', (messageData) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					id: prevState.id,
					createdAt: prevState.createdAt,
					userList: prevState.userList,
					messageList: messageData,
					videoList: prevState.videoList,
				};
			});
		});
		socket.on('new_video_added', (videoData) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					id: prevState.id,
					createdAt: prevState.createdAt,
					userList: prevState.userList,
					messageList: prevState.messageList,
					videoList: videoData,
				};
			});
		});
		socket.on('video_was_removed', (videoData) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					id: prevState.id,
					createdAt: prevState.createdAt,
					userList: prevState.userList,
					messageList: prevState.messageList,
					videoList: videoData,
				};
			});
		});
		socket.on('start_video_playback', () => {
			setVideoPlaying(true);
		});
		socket.on('stop_video_playback', () => {
			setVideoPlaying(false);
		});
		socket.on('video_seek', (seconds) => {
			setVideoPlaybackTime(seconds);
		});

		socket.on('error', (message) => {
			setError(message);
			setSearchResults(null);
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

	async function handleSearchVideo(url: string) {
		try {
			if (!url) return;
			setFetching(true);
			const data = await getVideoData(url);
			setSearchResults(data);
			setFetching(false);
		} catch (error) {
			setError(
				(error as NextResponse).statusText ||
					'Unknown fetching error. Make sure you selected correct source.'
			);
			setFetching(false);
		}
	}

	function handleAddVideo(video: VideoData) {
		if (!socket || !roomId || !video) return;
		setSearchResults(null);
		socket.emit('add_video', { roomId, video });
	}

	function handleRemoveChange(video: VideoData) {
		if (!socket || !roomId || !video) return;
		socket.emit('remove_video', { roomId, video });
	}

	// function handlePlayVideo() {
	// 	if (!socket || !roomId) return;
	// 	socket.emit('start_video_playback', roomId);
	// }

	// function handleStopVideo() {
	// 	if (!socket || !roomId) return;
	// 	socket.emit('stop_video_playback', roomId);
	// }

	function handleVideoSeek(time: number) {
		// if (!socket || !roomId || !time) return;
		// socket.emit('video_seek', { roomId: roomId, time: time });
	}

	// function handleVideoChange(videoId: string) {
	// 	if (!socket || !roomId || !videoId) return;
	// 	socket.emit('change_video', { roomId, videoId });
	// }

	function handleVideoEnded(videoId: string) {
		// if (!socket || !roomId || !videoId) return;
		// socket.emit('video_ended', { roomId, videoId });
	}

	function dismissError() {
		setError(null);
	}

	function toggleNavbarVisibility() {
		setShowNavbar((prevState) => !prevState);
	}

	function toggleSidebar() {
		setShowPlaylist((prevState) => !prevState);
	}

	function clearSearchResults() {
		setSearchResults(null);
	}

	return (
		<>
			<Navbar
				fetching={fetching}
				searchVideo={handleSearchVideo}
				searchResults={searchResults}
				clearSearchResults={clearSearchResults}
				addVideo={handleAddVideo}
				showNavbar={showNavbar}
				toggleNavbar={toggleNavbarVisibility}
				showChat={showPlaylist}
				toggleSidebar={toggleSidebar}
			/>
			{error && !!roomData?.videoList.length && (
				<div className={styles['error-absolute']} onClick={dismissError}>
					{error}
				</div>
			)}
			<main
				className={`${styles['main']} ${
					showNavbar ? 'pt-[48px]' : 'pt-0'
				} flex flex-col`}
			>
				{roomData && (
					<div className='flex-1 flex flex-col lg:flex-row gap-1 m-1 lg:gap-2 lg:m-2'>
						<div className={`${styles['video']} flex-1 flex flex-col relative`}>
							{roomData.videoList[0] && (
								<ReactPlayer
									className='absolute top-0 left-0'
									url={roomData.videoList[0].url}
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
									onEnded={() => handleVideoEnded(roomData.videoList[0].id)}
								/>
							)}
							{error && !roomData.videoList.length && (
								<div className={styles.error} onClick={dismissError}>
									{error}
								</div>
							)}
						</div>
						<div
							className={`${styles.sidebar} ${
								showNavbar ? '' : styles['navbar-hidden']
							}`}
						>
							<Chat
								userList={roomData.userList}
								chatMessages={roomData.messageList}
								sendMessage={handleSendMessage}
							/>
							{showPlaylist && (
								<Playlist
									playlist={roomData.videoList}
									removeVideo={handleRemoveChange}
								/>
							)}
						</div>
					</div>
				)}
			</main>
		</>
	);
}
