import styles from './Playlist.module.scss';
import Image from 'next/image';
import { VideoData } from '../libs/types';

interface Props {
	playlist: VideoData[];
	removeVideo: (video: VideoData) => void;
}

export default function Playlist({ playlist, removeVideo }: Props) {
	return (
		<div className={styles.playlist}>
			<ul className={styles.container}>
				{playlist.map((video, index) => (
					<li key={video.id}>
						<div className={styles.video}>
							{video.thumbnailUrl ? (
								<Image
									src={video.thumbnailUrl}
									width={130}
									height={90}
									alt={`${video.title} thumbnail` || 'Video thumbnail'}
								/>
							) : (
								<div className={`${styles.placeholder} relative`} />
							)}
							<p className='flex-1 m-0'>{video.title}</p>
							<div className='flex flex-col justify-between'>
								<div
									className='bg-red-700 cursor-pointer'
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
							</div>
						</div>
						{index !== playlist.length - 1 && <hr />}
					</li>
				))}
			</ul>
		</div>
	);
}
