'use client';

import { Inter } from 'next/font/google';
import './globals.scss';
import styles from './page.module.scss';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={styles.app}>{children}</body>
		</html>
	);
}
