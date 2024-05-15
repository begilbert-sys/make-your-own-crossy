import { StrictMode } from 'react';

import Header from "@/app/components/header";
import CrossyBuilder from "@/app/components/builder/crossybuilder";

export default function Home() {
	return (
		<div id="root">
			<StrictMode>
				<div>
					<Header />
					<CrossyBuilder />
				</div>
			</StrictMode>
		</div>
	);
}
