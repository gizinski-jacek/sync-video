import { useEffect, useRef, useState } from 'react';
import { MessageData, UserData } from '../libs/types';
import styles from './Chat.module.scss';

interface Props {
	userList: UserData[];
	chatMessages: MessageData[];
	sendMessage: (message: string) => void;
}

const Chat = ({ userList, chatMessages, sendMessage }: Props) => {
	const [input, setInput] = useState<string>('');
	const [showUserList, setShowUserList] = useState<boolean>(false);

	const chatBottom = useRef<HTMLLIElement>(null);

	useEffect(() => {
		chatBottom.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	const handleSubmit = async (
		e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
		message: string
	) => {
		if (
			(e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter' ||
			e.type === 'click'
		) {
			if (!message) return;
			sendMessage(message);
			setInput('');
		}
	};

	const toggleUserList = () => {
		setShowUserList((prevState) => !prevState);
	};

	return (
		<div className='flex flex-col h-full rounded bg-neutral-800'>
			<div className={`${styles.container} flex-1 flex flex-col relative`}>
				{showUserList && (
					<div className='absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex flex-col overflow-hidden m-2 bg-neutral-800'>
						<div className='flex flex-row justify-between font-bold border-b border-neutral-800'>
							<div className='p-1 px-2 text-sm bg-zinc-900 rounded-t'>
								User List ({userList.length})
							</div>
							<div
								className='p-1 px-2 text-sm bg-zinc-900 rounded-t'
								onClick={toggleUserList}
							>
								<svg
									viewBox='0 0 24 24'
									fill='none'
									height='24px'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<g>
											<path
												id='Vector'
												d='M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16'
												stroke='#ffffff'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											></path>
										</g>
									</g>
								</svg>
							</div>
						</div>
						<ul className='flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-1 overflow-y-scroll bg-zinc-900 rounded-b p-2 text-sm underline'>
							{userList.map((user) => (
								<li key={user.id}>{user.name}</li>
							))}
						</ul>
					</div>
				)}
				<ul className='flex-1 flex flex-col max-h-[160px] md:max-h-full overflow-y-scroll bg-slate-900 rounded m-2 p-2 text-sm'>
					{chatMessages.map((data) => (
						<div key={data.user.id + data.timestamp}>
							<span className='font-bold'>
								{new Date(data.timestamp).toLocaleTimeString('en-GB', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</span>{' '}
							<span className='underline'>{data.user.name}</span>
							{': '}
							{data.message}
						</div>
					))}
					<li ref={chatBottom}></li>
				</ul>
			</div>
			<form
				className='max-h-[36px] flex flex-row justify-between items-center gap-2 m-2'
				onSubmit={(e) => e.preventDefault()}
			>
				<label className='hidden' htmlFor='input'></label>
				<input
					className='bg-slate-900 rounded p-2 box-border w-full text-sm'
					id='input'
					size={20}
					type='text'
					name='input'
					minLength={1}
					maxLength={64}
					value={input}
					onKeyDown={(e) => handleSubmit(e, input)}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Send message'
				/>
				<div className='cursor-pointer' onClick={(e) => handleSubmit(e, input)}>
					<svg
						fill='#ffffff'
						height='24px'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 412.11 412.11'
						stroke='#ffffff'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<g>
								<g>
									<path d='M334.455,0H77.59C39.518,0,8.369,31.17,8.369,69.242v159.451c0,38.094,31.148,69.264,69.221,69.264h14.323L52.827,398.628 c-1.639,4.249-0.194,9.06,3.559,11.67c1.704,1.229,3.689,1.812,5.652,1.812c2.33,0,4.659-0.841,6.514-2.438 c0,0,126.405-111.219,126.793-111.737h139.132c38.116,0,69.264-31.17,69.264-69.264V69.242C403.719,31.17,372.592,0,334.455,0z M330.551,201.579H76.921v-29.25h253.651v29.25C330.572,201.579,330.551,201.579,330.551,201.579z M330.551,121.098H76.921v-29.25 h253.651v29.25H330.551z'></path>
								</g>
								<g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>
								<g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>
								<g> </g>
							</g>
						</g>
					</svg>
				</div>
				<div className='cursor-pointer' onClick={toggleUserList}>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						height='24px'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<rect width='24' height='24' fill='none'></rect>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M5 9.5C5 7.01472 7.01472 5 9.5 5C11.9853 5 14 7.01472 14 9.5C14 11.9853 11.9853 14 9.5 14C7.01472 14 5 11.9853 5 9.5Z'
								fill='#ffffff'
							></path>
							<path
								d='M14.3675 12.0632C14.322 12.1494 14.3413 12.2569 14.4196 12.3149C15.0012 12.7454 15.7209 13 16.5 13C18.433 13 20 11.433 20 9.5C20 7.567 18.433 6 16.5 6C15.7209 6 15.0012 6.2546 14.4196 6.68513C14.3413 6.74313 14.322 6.85058 14.3675 6.93679C14.7714 7.70219 15 8.5744 15 9.5C15 10.4256 14.7714 11.2978 14.3675 12.0632Z'
								fill='#ffffff'
							></path>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M4.64115 15.6993C5.87351 15.1644 7.49045 15 9.49995 15C11.5112 15 13.1293 15.1647 14.3621 15.7008C15.705 16.2847 16.5212 17.2793 16.949 18.6836C17.1495 19.3418 16.6551 20 15.9738 20H3.02801C2.34589 20 1.85045 19.3408 2.05157 18.6814C2.47994 17.2769 3.29738 16.2826 4.64115 15.6993Z'
								fill='#ffffff'
							></path>
							<path
								d='M14.8185 14.0364C14.4045 14.0621 14.3802 14.6183 14.7606 14.7837V14.7837C15.803 15.237 16.5879 15.9043 17.1508 16.756C17.6127 17.4549 18.33 18 19.1677 18H20.9483C21.6555 18 22.1715 17.2973 21.9227 16.6108C21.9084 16.5713 21.8935 16.5321 21.8781 16.4932C21.5357 15.6286 20.9488 14.9921 20.0798 14.5864C19.2639 14.2055 18.2425 14.0483 17.0392 14.0008L17.0194 14H16.9997C16.2909 14 15.5506 13.9909 14.8185 14.0364Z'
								fill='#ffffff'
							></path>
						</g>
					</svg>
				</div>
			</form>
		</div>
	);
};

export default Chat;
