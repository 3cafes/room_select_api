const express = require('express');
const API = require('./src/routes');
const { load } = require('./src/load');
const rooms_data = require('./data/rooms.json');
const database = require('./src/database');

const app = express();
const port = 3000;

//enable json body
app.use(express.json());

app.use('/api', API);

const server = app.listen(port, main);

async function main() {
	try {
		await database.start();
		await load(rooms_data.equipments, rooms_data.rooms);
		console.log(`room_select_api listening on localhost:${port}`);
	} catch (e) {
		console.error(e);
		server.close();
	}
}
