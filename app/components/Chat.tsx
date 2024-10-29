import { useEffect, useRef, useState } from 'react';
import { MessageData, UserData } from '../libs/types';
import styles from './Chat.module.scss';

interface Props {
	roomOwnerId: string;
	userData: UserData;
	userList: UserData[];
	chatMessages: MessageData[];
	sendMessage: (message: string) => void;
}

const Chat = ({
	roomOwnerId,
	userData,
	userList,
	chatMessages,
	sendMessage,
}: Props) => {
	const [input, setInput] = useState<string>('');
	const [showUserList, setShowUserList] = useState<boolean>(false);

	const chatBottom = useRef<HTMLLIElement>(null);

	useEffect(() => {
		chatBottom.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	const handleSubmit = (message: string) => {
		if (!message.trim()) return;
		sendMessage(message);
		setInput('');
	};

	function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const { value } = e.target as HTMLTextAreaElement;
		setInput(value);
	}

	const handleInputEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSubmit(input);
		}
	};

	const toggleUserList = () => {
		setShowUserList((prevState) => !prevState);
	};

	return (
		<div className={styles.chat}>
			<div
				className={`${styles.container} ${
					showUserList ? styles['user-list-visible'] : ''
				}`}
			>
				{userList && showUserList && (
					<div className={styles['chat-users']}>
						<div className='flex flex-row justify-between font-bold border-b-2 border-slate-800'>
							<div className='p-0 px-1 text-sm bg-lime-950 rounded-tl'>
								User List ({userList.length})
							</div>
							<div
								className='text-sm bg-lime-950 rounded-tr cursor-pointer'
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
						<div className={styles['user-list']}>
							<ul className={styles['user-list-container']}>
								{userList.map((user) => (
									<li
										key={user.id}
										className={`${
											user.id === roomOwnerId
												? 'text-red-500'
												: user.id === userData.id
												? 'text-green-700'
												: 'text-gray-300'
										}`}
									>
										{user.name}
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
				<ul className={styles['chat-messages-list']}>
					{chatMessages?.map((message) => (
						<li key={message.user.id + message.timestamp}>
							<span className='font-bold'>
								{new Date(message.timestamp).toLocaleTimeString('en-GB', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</span>{' '}
							<span
								className={`${
									message.user.id === roomOwnerId
										? 'text-red-500'
										: message.user.id === userData.id
										? 'text-green-700'
										: 'text-gray-300'
								}`}
							>
								{message.user.name}
							</span>
							{': '}
							{message.message}
						</li>
					))}
					<li ref={chatBottom}></li>
				</ul>
			</div>
			<form
				className='max-h-[120px] w-[300px] flex flex-row justify-between items-center gap-2 p-2 border-s-2 lg:border-s-0 lg:border-t-4 border-slate-900'
				onSubmit={(e) => e.preventDefault()}
			>
				<label className='hidden' htmlFor='input'></label>
				<textarea
					className='bg-slate-900 rounded p-2 box-border word-wrap w-full h-full text-sm resize-none'
					id='input'
					name='input'
					rows={5}
					minLength={1}
					maxLength={128}
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleInputEnterKey}
					placeholder='Send message'
				/>
				<div className='mb-auto flex flex-col gap-2'>
					<div className='cursor-pointer' onClick={() => handleSubmit(input)}>
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
				</div>
			</form>
		</div>
	);
};

export default Chat;
