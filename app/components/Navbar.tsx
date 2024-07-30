import Link from 'next/link';
import styles from './Navbar.module.scss';
import { useState } from 'react';

interface Props {
	addVideo: (video: string) => void;
	showNavbar: boolean;
	toggleNavbar: () => void;
	showChat: boolean;
	toggleSidebar: () => void;
}

export default function Navbar({
	addVideo,
	showNavbar,
	toggleNavbar,
	showChat,
	toggleSidebar,
}: Props) {
	const [input, setInput] = useState<string>('');

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setInput(value);
	}

	return (
		<nav className={showNavbar ? styles['navbar'] : styles['navbar-hidden']}>
			<Link className='hidden sm:inline-block my-auto' href={'/'}>
				SyncVid
			</Link>
			<form
				className='h-full flex flex-row justify-between gap-2'
				onSubmit={(e) => e.preventDefault()}
			>
				<input
					className='rounded bg-slate-900 h-full px-1 text-base max-w-[120px] md:max-w-[200px]'
					id='input'
					name='input'
					type='text'
					value={input}
					onChange={handleInputChange}
				/>
				<div
					className='p-1 cursor-pointer'
					onClick={() => addVideo(input as any)}
				>
					<svg
						width='24px'
						viewBox='0 -0.5 25 25'
						fill='#ffffff'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M18.455 9.8834L7.063 4.1434C6.76535 3.96928 6.40109 3.95274 6.08888 4.09916C5.77667 4.24558 5.55647 4.53621 5.5 4.8764C5.5039 4.98942 5.53114 5.10041 5.58 5.2024L7.749 10.4424C7.85786 10.7903 7.91711 11.1519 7.925 11.5164C7.91714 11.8809 7.85789 12.2425 7.749 12.5904L5.58 17.8304C5.53114 17.9324 5.5039 18.0434 5.5 18.1564C5.55687 18.4961 5.77703 18.7862 6.0889 18.9323C6.40078 19.0785 6.76456 19.062 7.062 18.8884L18.455 13.1484C19.0903 12.8533 19.4967 12.2164 19.4967 11.5159C19.4967 10.8154 19.0903 10.1785 18.455 9.8834V9.8834Z'
								stroke='#ffffff'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							></path>
						</g>
					</svg>
				</div>
			</form>
			<div className='p-1 cursor-pointer' onClick={toggleSidebar}>
				{showChat ? (
					<svg
						width='24px'
						viewBox='0 0 24 24'
						fill='#ffffff'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<path d='M8,7,2,11V3ZM3,14.5H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2ZM10,7a1,1,0,0,0,1,1H21a1,1,0,0,0,0-2H11A1,1,0,0,0,10,7ZM3,21H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z'></path>
						</g>
					</svg>
				) : (
					<svg
						width='24px'
						viewBox='0 0 20 20'
						fill='#ffffff'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<path d='M17 11v3l-3-3H8a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1zm-3 2v2a2 2 0 0 1-2 2H6l-3 3v-3H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 0 0 4 4h6z'></path>
						</g>
					</svg>
				)}
			</div>
			<div
				className={showNavbar ? styles['hide-nav-btn'] : styles['show-nav-btn']}
				onClick={toggleNavbar}
			></div>
		</nav>
	);
}
