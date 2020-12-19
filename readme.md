# ROOM SELECT API

Rest API for Station f room selector

List of rooms is defined in `data/rooms.json`. List of availlable equipments is defined in `data/equipments.json`.
When a user reserve a room, a reservation file is dump in `data/reservation/{reservation}`.

## API

`GET /rooms/search/available`

## RUN

### setup database

**with docker** \
create a mongodb container

```
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root --name room_select_db mongo
```

**if you have mongodb installed**
just start mongo deamon

```
sudo systemctl start mongodb

```

**configure database connection**
set correct host and password in `src/database/config.js`

### start development server

Require `nodemon`. Run `npm i nodemon -g` to instal it globally

```
npm run dev
```

### start server

```
npm start
```
