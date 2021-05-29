// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

/**
 * The room name must be in standard URL path format, eg. no special characters.
 */
export enum RoomName {

    derby = "derby",
    arena = "arena"

}

export function isRoomName (name : any) : name is RoomName {
    return Object.keys(RoomName).includes(name);
}

export default RoomName;
