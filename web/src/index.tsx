import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { init } from './i18next';

const LazyComponent = React.lazy(async () => {	
	try {
		const res = await fetch(`https://cfx-nui-ei-banking/locale.json`)
		const translation = await res.json()
	
		await init(translation);
	} catch(err) {
		console.log(err);
		await init({})
	}

	return import('./Appcomp');
})

ReactDOM.render(
	<React.StrictMode>
		<React.Suspense fallback={<p>Loading...</p>}>
			<LazyComponent />
		</React.Suspense>
	</React.StrictMode>,
	document.getElementById('root')
);
