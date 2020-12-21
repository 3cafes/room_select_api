# ROOM SELECT API

Rest API for Station f room selector
you can find the fron here: [https://github.com/3cafes/room_select_front]

Equipments and of rooms are defined in `data/rooms.json`.
When a user reserve a room, a reservation file is dump in `data/reservation/{reservation}/{room}/{date}/{start_hour}.json`.

`rooms.json` is loaded when you start the api and database is updated if a modification have been done.

the room file formats is the following:

```
{
	"equipments": ["TV", "Retro Projecteur", ...],
	"rooms": [
		{
			"name": "Salle #1",
			"description": "Salle #1",
			"capacity": 5,
			"equipments": [
				{
					"name": "TV"
				},
				{
					"name": "Retro Projecteur"
				}
			]
		},
		...
	]
}
```

## API

list of routes is available at this link: [https://www.getpostman.com/collections/e2ea121539910def9800];

## RUN

### setup database

**with docker** \
create a mongodb container

```
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root --name room_select_db mongo
```

**if you have mongodb installed**
start mongo deamon

```
sudo systemctl start mongodb

```

**configure database connection**
set correct host and password in `src/database/config.js`

```
const HOST = 'localhost';
const PORT = 27017;
const DATABASE = 'room_select_db';
const USERNAME = 'root';
const PASSWORD = 'root';

```

### start development server

Require `nodemon`. Run `npm i nodemon -g` to instal it globally

```
npm run dev
```

### start server

```
npm start
```
