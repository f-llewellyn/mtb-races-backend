import { config } from './config.js';
import { createApp } from './lib/utils/createApp.js';

const app = await createApp();

const port = config.PORT || 8002;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
