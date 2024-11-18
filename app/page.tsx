'use client';

import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { formatFetchError } from './libs/utils';

export default function App() {
	const router = useRouter();

	async function handleCreateRoom(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			e.preventDefault();
			const res: AxiosResponse<{ roomId: string }> = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URI}/api/create-room2`,
				{ timeout: 5000 }
			);
			router.push(`room/${res.data.roomId}`);
		} catch (error: unknown) {
			console.error(formatFetchError(error));
		}
	}

	return (
		<div>
			<button type='button' onClick={handleCreateRoom}>
				Create Room
			</button>
		</div>
	);
}
