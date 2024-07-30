import { useEffect, useRef, useState } from 'react';
import { ChatMessage, UserData } from '../libs/types';

interface Props {
	userList: UserData[];
	chatMessages: ChatMessage[];
	sendMessage: (message: string) => void;
}

const Chat = ({ chatMessages, sendMessage }: Props) => {
	const [input, setInput] = useState<string>('');

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

	return (
		<div className='flex flex-col h-full rounded bg-neutral-800'>
			<ul className='flex-1 flex flex-col max-h-[160px] md:max-h-full overflow-y-scroll bg-slate-900 rounded m-2 p-2 text-sm'>
				{chatMessages.map((data) => (
					<div key={data.user.id + data.timestamp}>
						{new Date(data.timestamp).toLocaleTimeString('en-GB', {
							hour: '2-digit',
							minute: '2-digit',
						}) +
							' ' +
							data.user.name}
						{': '}
						{data.message}
					</div>
				))}
				<li ref={chatBottom}></li>
			</ul>
			<form
				className='flex flex-row justify-between items-center gap-2 m-2'
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
			</form>
		</div>
	);
};

export default Chat;
