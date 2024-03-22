import { StrictMode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import CrossyBuilder from "@/app/components/crossybuilder";


export default function Home() {
	return (
		<div id="root">
			<StyledEngineProvider injectFirst>
				<StrictMode>
					<div>
						<CrossyBuilder />
					</div>
				</StrictMode>
			</StyledEngineProvider>
		</div>
	);
}
