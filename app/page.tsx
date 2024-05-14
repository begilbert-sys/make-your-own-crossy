import { StrictMode } from 'react';

import CrossyBuilder from "@/app/components/builder/crossybuilder";


export default function Home() {
	return (
		<div id="root">
			<StrictMode>
				<div>
					<CrossyBuilder />
				</div>
			</StrictMode>
		</div>
	);
}
