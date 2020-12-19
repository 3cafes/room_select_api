# ROOM SELECT API

Rest API for Station f room selector

List of rooms is defined in `data/rooms.json`. List of availlable equipments is defined in `data/equipments.json`.
When a user reserve a room, a reservation file is dump in `data/reservation/{reservation}`.

## API

`GET /rooms/search/available`

## RUN

### start development server

Require `nodemon`. Run `npm i nodemon -g` to instal it globally

```
npm run dev
```

### start server

```
npm start
```
