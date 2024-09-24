'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function App() {
	const router = useRouter();

	async function handleCreateRoom(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			e.preventDefault();
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URI}/api/create-room`,
				{ timeout: 15000 }
			);
			router.push(`room/${res.data.roomId}`);
		} catch (error: unknown) {
			console.error(error);
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
