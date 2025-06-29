import { config } from './config.ts';
import { createApp } from './lib/utils/createApp.ts';

const app = await createApp();

const port = config.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
