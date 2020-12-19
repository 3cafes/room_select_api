import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('hello wolrd');
});

app.listen(port, () => {
	console.log(`Room select started on localhost:${port}`);
});
