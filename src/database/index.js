const mongoose = require('mongoose');
const { DATABASE, HOST, PORT, USERNAME, PASSWORD } = require('./config');
const Schemas = require('./schemas');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(
	`mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`,
	{
		auth: {
			authSource: 'admin',
		},
	}
);

var db;

async function start() {
	console.log('Database: connect...');
	return new Promise((resolve, reject) => {
		db = mongoose.connection;
		db.on('error', () => {
			reject(`Database: connection error`);
		});
		db.once('open', () => {
			console.log('Database: successfully connected');
			resolve(true);
		});
	});
}

module.exports = {
	db,
	start,
	...Schemas,
};
