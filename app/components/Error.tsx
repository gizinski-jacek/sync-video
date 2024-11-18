import { ReactNode } from 'react';
import styles from './Error.module.scss';

interface Props {
	dismiss: () => void;
	isAbsoluteAtTop?: boolean;
	children: ReactNode;
}

export default function Error({
	dismiss,
	isAbsoluteAtTop = false,
	children,
}: Props) {
	return (
		<div
			className={isAbsoluteAtTop ? styles['error-absolute'] : styles.error}
			onClick={dismiss}
		>
			{children}
		</div>
	);
}
