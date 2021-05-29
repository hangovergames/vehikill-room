// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

/**
 * The room name must be in standard URL path format, eg. no special characters.
 */
export enum RoomName {

    derby = "derby",
    arena = "arena"

}

export function isRoomName (name : any) : name is RoomName {
    switch(name) {
        case RoomName.derby:
            return true;
        default:
            return false;
    }
}

export default RoomName;
