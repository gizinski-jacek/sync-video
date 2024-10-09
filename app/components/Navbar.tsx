import Link from 'next/link';
import styles from './Navbar.module.scss';
import { useEffect, useRef, useState } from 'react';
import { VideoData } from '../libs/types';
import Loading from './Loading';

interface Props {
	fetching: boolean;
	searchVideo: (url: string) => void;
	searchResults: VideoData[] | null;
	clearSearchResults: () => void;
	addVideo: (video: VideoData) => void;
	showNavbar: boolean;
	toggleNavbar: () => void;
	showChat: boolean;
	toggleSidebar: () => void;
}

export default function Navbar({
	fetching,
	searchVideo,
	searchResults,
	clearSearchResults,
	addVideo,
	showNavbar,
	toggleNavbar,
	showChat,
	toggleSidebar,
}: Props) {
	const [input, setInput] = useState<string>('');

	const searchRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (!searchRef.current?.contains(event.target as Node)) {
				clearSearchResults();
			}
		};
		window.addEventListener('click', handleOutsideClick);

		return () => {
			window.removeEventListener('click', handleOutsideClick);
		};
	}, [searchRef, clearSearchResults]);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value.trim();
		setInput(value);
		if (value) {
			searchVideo(input);
		} else {
			clearSearchResults();
		}
	}

	function handleInputEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			searchVideo(input);
		}
	}

	function handlePasteEvent(e: React.ClipboardEvent<HTMLInputElement>) {
		const value = e.clipboardData.getData('text/plain');
		searchVideo(value);
	}

	return (
		<nav className={showNavbar ? styles['navbar'] : styles['navbar-hidden']}>
			<Link className='inline-block my-auto' href={'/'}>
				SyncVid
			</Link>
			<form
				ref={searchRef}
				className='flex-1 flex flex-row justify-between gap-2 relative max-w-[360px]'
				onSubmit={(e) => e.preventDefault()}
			>
				<input
					className='flex-1 rounded bg-slate-900 px-1 text-base'
					id='input'
					name='input'
					type='text'
					minLength={16}
					maxLength={256}
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleInputEnterKey}
					onPaste={handlePasteEvent}
				/>
				<div className='p-1 cursor-pointer' onClick={() => searchVideo(input)}>
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
				{fetching ? (
					<ul className='absolute top-full left-0 right-0 z-50 max-w-[320px] flex flex-col gap-2 p-2 border-2 border-gray-400 rounded bg-slate-900 text-xs'>
						<Loading styleClass='mx-auto w-[80px] h-[80px]' />
					</ul>
				) : searchResults && searchResults?.length > 0 ? (
					<ul className='absolute top-full left-[-25%] right-[-25%] flex max-w-[540px] z-50 flex-col gap-2 p-2 border-2 border-gray-400 rounded bg-slate-900 text-xs'>
						{searchResults.map((result) => (
							<li
								key={result.id}
								className='p-1 border rounded transition-all hover:bg-slate-800 cursor-pointer'
								onClick={() => addVideo(result)}
							>
								{result.title}
							</li>
						))}
					</ul>
				) : null}
			</form>
			<div className='p-1 cursor-pointer' onClick={toggleSidebar}>
				{showChat ? (
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
				) : (
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
				)}
			</div>
			<div
				className={showNavbar ? styles['hide-nav-btn'] : styles['show-nav-btn']}
				onClick={toggleNavbar}
			></div>
		</nav>
	);
}
