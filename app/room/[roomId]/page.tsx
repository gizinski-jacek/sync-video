'use client';

import styles from './room.module.scss';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Loading from '@/app/components/Loading';
import { ChatData, SocketType, UserData, VideoData } from '@/app/libs/types';
import Chat from '@/app/components/Chat';
import Playlist from '@/app/components/Playlist';
import ReactPlayer from 'react-player';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function Room() {
	const { roomId }: { roomId: string } = useParams();
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
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
	const router = useRouter();

	useEffect(() => {
		if (roomId.length < 6) {
			router.push('/');
		}
	}, [roomId, router]);

	useEffect(() => {
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
		socket.on('all_data', (data) => {
			setUserData(data.userData);
			setChatData({
				userList: data.userList,
				messageList: data.messageList,
				videoList: data.videoList,
			});
		});
		socket.on('new_user', (data) => {
			setChatData((prevState) => ({
				userList: [...prevState.userList, data],
				messageList: prevState.messageList,
				videoList: prevState.videoList,
			}));
		});
		socket.on('new_message', (data) => {
			setChatData((prevState) => ({
				userList: prevState.userList,
				messageList: [...prevState.messageList, data],
				videoList: prevState.videoList,
			}));
		});
		socket.on('new_video', (data) => {
			setVideoData(data);
		});

		return () => {
			socket.off();
		};
	}, [socket]);

	function handleSendMessage(message: string) {
		if (!socket || !roomId) return;
		socket.emit('send_message', {
			roomId: roomId as string,
			message: message,
		});
	}

	function handleAddVideo(video: string) {
		if (!socket || !video) return;
		socket.emit('add_video', { roomId, video });
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
						<Playlist show={!showChat} playlist={videoData} />
					</div>
				</div>
			</main>
		</>
	);
}
