'use client';

import styles from './room.module.scss';
import { useEffect, useRef, useState } from 'react';
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
	const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1);
	const playerRef = useRef<ReactPlayer>(null);

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
		const newSocket: SocketType = io(
			`${process.env.NEXT_PUBLIC_API_URI}/rooms`,
			{ query: { roomId }, withCredentials: true }
		);
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

		socket.on('all_room_data', ({ userData, roomData }) => {
			setUserData(userData);
			setRoomData(roomData);
		});

		socket.on('user_leaving', ({ userList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					userList: userList,
				};
			});
		});

		socket.on('new_chat_message', ({ messageList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					messageList: messageList,
				};
			});
		});

		socket.on('new_video_added', ({ videoList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					videoList: videoList,
				};
			});
		});

		socket.on('video_removed', ({ videoList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					videoList: videoList,
				};
			});
		});

		socket.on('start_video', ({ videoProgress }) => {
			playerRef.current?.seekTo(
				videoProgress * playerRef.current?.getDuration()
			);
			setTimeout(() => {
				setVideoPlaying(true);
			}, 100);
		});

		socket.on('stop_video', () => {
			setVideoPlaying(false);
		});

		socket.on('playback_rate_change', ({ playbackRate }) => {
			setVideoPlaybackRate(playbackRate);
		});

		socket.on('change_video', ({ videoList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					videoList: videoList,
				};
			});
		});

		socket.on('reorder_video', ({ videoList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					videoList: videoList,
				};
			});
		});

		socket.on('video_ended', ({ videoList }) => {
			setRoomData((prevState) => {
				if (prevState === null) return null;
				return {
					...prevState,
					videoList: videoList,
				};
			});
		});

		socket.on('error', (message) => {
			setError(message);
			setSearchResults(null);
		});

		return () => {
			socket.off();
		};
	}, [socket, videoPlaying]);

	function handleSendMessage(message: string) {
		if (!socket || !roomId) return;
		socket.emit('new_chat_message', {
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
			setSearchResults(null);
			setFetching(false);
		}
	}

	function handleAddVideo(video: VideoData) {
		if (!socket || !roomId || !video) return;
		setSearchResults(null);
		socket.emit('new_video_added', { roomId, video });
	}

	function handleRemoveChange(video: VideoData) {
		if (!socket || !roomId || !video) return;
		socket.emit('video_removed', { roomId, video });
	}

	function handlePlayVideo() {
		if (videoPlaying) return;
		if (!socket?.id || !roomId) return;
		socket.emit('start_video', { roomId });
	}

	function handlePauseVideo() {
		if (!videoPlaying) return;
		if (!socket?.id || !roomId) return;
		socket.emit('stop_video', { roomId });
	}

	function handleVideoProgressChange(videoProgress: number) {
		if (!socket || !roomId || !videoProgress || !userData || !roomData) return;
		if (userData.id !== roomData.ownerData.id) return;
		socket.emit('video_progress', { roomId, videoProgress });
	}

	function handlePlaybackRateChange(playbackRate: number) {
		if (!socket || !roomId || !playbackRate) return;
		socket.emit('playback_rate_change', { roomId, playbackRate });
	}

	function handleVideoChange(video: VideoData) {
		if (!socket || !roomId || !video) return;
		socket.emit('change_video', { roomId, video });
	}

	function handleReorderVideo(video: VideoData, targetIndex: number) {
		if (!socket || !roomId || !video) return;
		socket.emit('reorder_video', { roomId, video, targetIndex });
	}

	function handleVideoEnded(video: VideoData) {
		if (!socket || !roomId || !video) return;
		socket.emit('video_ended', { roomId, video });
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
				currentVideo={roomData?.videoList[0]}
				addVideo={handleAddVideo}
				showNavbar={showNavbar}
				toggleNavbar={toggleNavbarVisibility}
				showChat={showPlaylist}
				toggleSidebar={toggleSidebar}
			/>
			{error && (
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
					<div className='flex-1 flex flex-col lg:flex-row gap-1 xs:m-1 lg:gap-2 lg:m-2'>
						<div
							className={`${styles['video']} flex-1 flex flex-col bg-slate-900 relative`}
						>
							{roomData.videoList[0] ? (
								<ReactPlayer
									ref={playerRef}
									className='absolute top-0 left-0 right-0 bottom-0'
									url={roomData.videoList[0].url}
									width={'100%'}
									height={'100%'}
									volume={0.25}
									controls={true}
									loop={false}
									playing={videoPlaying}
									playbackRate={videoPlaybackRate}
									onStart={handlePlayVideo}
									onPlay={handlePlayVideo}
									onPause={handlePauseVideo}
									onProgress={({ played }) => handleVideoProgressChange(played)}
									onPlaybackRateChange={handlePlaybackRateChange}
									onEnded={() => handleVideoEnded(roomData.videoList[0])}
								/>
							) : (
								<div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-slate-900' />
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
							{userData && (
								<Chat
									roomOwnerId={roomData.ownerData.id}
									userData={userData}
									userList={roomData.userList}
									chatMessages={roomData.messageList}
									sendMessage={handleSendMessage}
								/>
							)}
							<Playlist
								showPlaylist={showPlaylist}
								playlist={roomData.videoList}
								currentVideo={roomData?.videoList[0]}
								changeVideo={handleVideoChange}
								removeVideo={handleRemoveChange}
								reorderVideo={handleReorderVideo}
							/>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
