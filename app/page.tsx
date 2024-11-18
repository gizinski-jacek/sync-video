'use client';

import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { formatFetchError } from './libs/utils';
import { useState } from 'react';
import Error from './components/Error';

export default function App() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	async function handleCreateRoom(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			e.preventDefault();
			const res: AxiosResponse<{ roomId: string }> = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URI}/api/create-room`,
				{ timeout: 5000 }
			);
			router.push(`room/${res.data.roomId}`);
		} catch (error: unknown) {
			setError(formatFetchError(error).statusText);
		}
	}

	function dismissError() {
		setError(null);
	}

	return (
		<div className='min-h-[50%] flex items-center'>
			<button
				className='bg-lime-950 p-2 rounded text-3xl font-bold'
				type='button'
				onClick={handleCreateRoom}
			>
				Create Room
			</button>
			{error && (
				<Error dismiss={dismissError} isAbsoluteAtTop={true}>
					{error}
				</Error>
			)}
		</div>
	);
}
