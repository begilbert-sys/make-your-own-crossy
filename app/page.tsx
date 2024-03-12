import Image from "next/image";
import { StrictMode } from 'react';
import CrossyBuilder from "@/app/components/crossybuilder";
import styles from '@/styles/Home.module.css';

export default function Home() {
	return (
	<StrictMode>
		<div>
			<CrossyBuilder />
		</div>
	</StrictMode>
	);
}
