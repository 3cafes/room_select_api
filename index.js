const express = require('express');
const API = require('./api/index.js');

const app = express();
const port = 3000;

app.use('/api', API);

app.listen(port, () => {
	console.log(`Room select started on localhost:${port}`);
});
