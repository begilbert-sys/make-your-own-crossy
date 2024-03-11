import Image from "next/image";
import Board from "@/app/components/board";
import { StrictMode } from 'react';

export default function Home() {
	return (
	<div>
		<StrictMode>
			<Board rows={4} columns={4} />
		</StrictMode>
	</div>
	);
}
