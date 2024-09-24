import Image from 'next/image';
import { VideoData } from '../libs/types';
import styles from './Playlist.module.scss';

interface Props {
	show: boolean;
	playlist: VideoData[];
	changeVideo: (id: string) => void;
}

export default function Playlist({ show, playlist, changeVideo }: Props) {
	console.log(playlist);
	return (
		show && (
			<div className='absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex flex-col overflow-hidden p-2 m-2 bg-zinc-900'>
				{playlist.length > 0 ? (
					playlist.map((video) => (
						<div
							key={video.id}
							className='p-1 border rounded transition-all bg-slate-900 hover:bg-slate-800 cursor-pointer'
							onClick={() => changeVideo(video.id)}
						>
							{video.thumbnailUrl ? (
								<Image
									src={video.thumbnailUrl}
									width={120}
									height={90}
									alt={`${video.title} thumbnail` || 'Video thumbnail'}
								/>
							) : (
								<div className={`${styles.placeholder} position-relative`} />
							)}
							{video.title}
						</div>
					))
				) : (
					<div className='m-5 text-center font-bold'>Playlist Empty</div>
				)}
			</div>
		)
	);
}
