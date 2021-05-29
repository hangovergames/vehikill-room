# hangovergames/vehikill-room

Room configuration(s) for [vehikill.io](https://play.vehikill.io).

Feel free to fork and create your own unique rooms :)

### Custom rooms

Try not to directly edit `src/rooms/derby.ts` unless it's a bug fix to the derby room.

New features to the derby room can be suggested by 
[opening issues](https://github.com/hangovergames/vehikill-room/issues), of course. Although best if those are tested on another room first.

### Adding a new room

 1. Fork the repository
 2. Set up the [Development environment](#development-environment)
 3. Add your new room name to `RoomName` enum at `./src/common/RoomName.ts`
 4. Copy existing room configuration (eg. `./src/rooms/derby.ts`) as `./src/rooms/YOUR-ROOM-NAME.ts`
 5. Add your room to `./src/rooms/index.ts`
 6. Make your changes to `./src/rooms/YOUR-ROOM-NAME.ts`
 7. Once you're happy with your room, you may submit it as a pull request.
 8. We may then add it on the server.

### Viewing the room

This repository includes Development environment for rooms using Docker. 

### Development environment

You should to install [Docker](https://www.docker.com/) to run our development environment.

To make things even easier, you'll probably want to use a smart IDE which understands TypeScript. However, that is not 
mandatory. We use [Jetbrain's IDEA](https://www.jetbrains.com/idea/).

Build & start the Development environment:

```
docker-compose build
docker-compose up
```

Once started, you can open http://localhost:3000 in your browser to view the map in realtime while making changes.

You can then go and edit files at `./src' and everything should update automatically without a refresh.

### Discord

You may also contact Vehikill.io developers at [Discord](https://discord.com/invite/tKKMczp).
