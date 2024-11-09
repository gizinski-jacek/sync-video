import styles from './Playlist.module.scss';
import Image from 'next/image';
import { VideoData } from '../libs/types';

interface Props {
	showPlaylist: boolean;
	playlist: VideoData[];
	changeVideo: (video: VideoData) => void;
	removeVideo: (video: VideoData) => void;
	reorderVideo: (video: VideoData, index: number) => void;
	currentVideo: VideoData;
}

export default function Playlist({
	showPlaylist,
	playlist,
	changeVideo,
	removeVideo,
	reorderVideo,
	currentVideo,
}: Props) {
	return (
		<ul className={`${styles.playlist} ${showPlaylist ? styles.visible : ''}`}>
			{playlist.map((video, index) => (
				<li key={video.id}>
					<div className={styles.video}>
						<div className={styles.container}>
							{video.thumbnailUrl ? (
								<Image
									src={video.thumbnailUrl}
									width={130}
									height={90}
									alt={
										video.title ? `${video.title} thumbnail` : 'Video thumbnail'
									}
								/>
							) : (
								<div className={`${styles.placeholder} relative`} />
							)}
							{currentVideo?.id === video.id &&
							currentVideo?.host === video.host ? (
								<div className={styles.playing}>Playing</div>
							) : (
								<div
									className={styles['change-video']}
									onClick={() => changeVideo(video)}
								>
									Play
								</div>
							)}
						</div>
						<p className='flex-1 m-0'>{video.title}</p>
						<div className='flex flex-col justify-between'>
							<div
								className='bg-red-700 hover:bg-red-600 transition-all cursor-pointer'
								onClick={() => removeVideo(video)}
							>
								<svg
									width='24px'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<path
											d='M7 17L16.8995 7.10051'
											stroke='#000000'
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										></path>
										<path
											d='M7 7.00001L16.8995 16.8995'
											stroke='#000000'
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										></path>
									</g>
								</svg>
							</div>
							<div
								className='bg-yellow-600 hover:bg-yellow-500 transition-all cursor-pointer'
								onClick={() => reorderVideo(video, index - 1)}
							>
								<svg
									width='24px'
									fill='#000000'
									viewBox='0 0 32 32'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<path d='M8 20.695l7.997-11.39L24 20.695z'></path>
									</g>
								</svg>
							</div>
							<div
								className='bg-yellow-600 hover:bg-yellow-500 transition-all cursor-pointer'
								onClick={() => reorderVideo(video, index + 1)}
							>
								<svg
									width='24px'
									fill='#000000'
									viewBox='0 0 32 32'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<path d='M24 11.305l-7.997 11.39L8 11.305z'></path>
									</g>
								</svg>
							</div>
						</div>
					</div>
					{index !== playlist.length - 1 && <hr />}
				</li>
			))}
		</ul>
	);
}
