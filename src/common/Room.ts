// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

import Scene, {ImageType} from "./Scene";
import RoomName from "./RoomName";

export interface Room {

    name         : RoomName;
    description  : string;
    image        : ImageType;
    authors     ?: string[];
    scene        : Scene;

}

export default Room;
