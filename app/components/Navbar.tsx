import Link from 'next/link';
import styles from './Navbar.module.scss';
import { useEffect, useRef, useState } from 'react';
import { VideoData } from '../libs/types';
import Loading from './Loading';
import Image from 'next/image';

interface Props {
	fetching: boolean;
	searchVideo: (url: string) => void;
	searchResults: VideoData[] | null;
	clearSearchResults: () => void;
	currentVideo: VideoData | undefined;
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
	currentVideo,
	addVideo,
	showNavbar,
	toggleNavbar,
	showChat,
	toggleSidebar,
}: Props) {
	const [userInput, setUserInput] = useState<string>('');

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
		setUserInput(value);
		if (!value) {
			clearSearchResults();
		}
	}

	function handleInputEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			searchVideo(userInput);
		}
	}

	function handlePasteEvent(e: React.ClipboardEvent<HTMLInputElement>) {
		const value = e.clipboardData.getData('text/plain');
		searchVideo(value);
	}

	return (
		<nav className={showNavbar ? styles['navbar'] : styles['navbar-hidden']}>
			<Link className='my-auto' href={'/'}>
				SyncVid
			</Link>
			<div className='flex'>
				<form
					ref={searchRef}
					className='flex flex-row justify-between gap-2 relative w-[240px] sm:w-[360px] md:w-[480px] lg:w-[600px]'
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						className={`w-full bg-slate-900 px-1 text-base ${
							fetching || (searchResults && searchResults?.length > 0)
								? 'rounded-t '
								: 'rounded'
						}`}
						id='input'
						name='input'
						type='text'
						minLength={16}
						maxLength={256}
						value={userInput}
						onChange={handleInputChange}
						onKeyDown={handleInputEnterKey}
						onPaste={handlePasteEvent}
					/>
					{fetching ? (
						<div className={styles['loading-container']}>
							<Loading styleClass='mx-auto w-[80px] h-[80px]' />
						</div>
					) : searchResults && searchResults?.length > 0 ? (
						<ul className={styles['search-results-list']}>
							{searchResults.map((result) => (
								<li
									key={result.id}
									className={styles['search-result-item']}
									onClick={() => addVideo(result)}
								>
									{result.thumbnailUrl ? (
										<div className={styles.container}>
											<Image
												src={result.thumbnailUrl}
												width={130}
												height={90}
												alt={
													result.title
														? `${result.title} thumbnail`
														: 'Video thumbnail'
												}
											/>
											{currentVideo?.id === result.id &&
												currentVideo?.host === result.host && (
													<div className={styles.playing}>Playing</div>
												)}
										</div>
									) : (
										<div className={`${styles.placeholder} relative`} />
									)}
									<p className='flex-1 m-0'>{result.title}</p>
								</li>
							))}
						</ul>
					) : null}
				</form>
				<div
					className='m-1 cursor-pointer'
					onClick={() => searchVideo(userInput)}
				>
					<svg
						width='24px'
						viewBox='0 -0.5 25 25'
						fill='#c8c8c8'
						xmlns='http://www.w3.org/2000/svg'
						className='hover:fill-white transition-all'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M18.455 9.8834L7.063 4.1434C6.76535 3.96928 6.40109 3.95274 6.08888 4.09916C5.77667 4.24558 5.55647 4.53621 5.5 4.8764C5.5039 4.98942 5.53114 5.10041 5.58 5.2024L7.749 10.4424C7.85786 10.7903 7.91711 11.1519 7.925 11.5164C7.91714 11.8809 7.85789 12.2425 7.749 12.5904L5.58 17.8304C5.53114 17.9324 5.5039 18.0434 5.5 18.1564C5.55687 18.4961 5.77703 18.7862 6.0889 18.9323C6.40078 19.0785 6.76456 19.062 7.062 18.8884L18.455 13.1484C19.0903 12.8533 19.4967 12.2164 19.4967 11.5159C19.4967 10.8154 19.0903 10.1785 18.455 9.8834V9.8834Z'
								stroke='#c8c8c8'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							></path>
						</g>
					</svg>
				</div>
			</div>
			<div className='m-1 cursor-pointer' onClick={toggleSidebar}>
				{showChat ? (
					<svg
						width='24px'
						viewBox='0 0 24 24'
						fill='#c8c8c8'
						xmlns='http://www.w3.org/2000/svg'
						className='hover:fill-white transition-all'
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
						fill='#c8c8c8'
						xmlns='http://www.w3.org/2000/svg'
						className='hover:fill-white transition-all'
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
