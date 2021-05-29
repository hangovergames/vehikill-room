// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

import React from 'react';
import Room from "../../common/Room";
import ClassName from "../../common/ClassName";
import "./RoomView.scss";
import RoomUtils from "../../utils/RoomUtils";
import {ASSETS_URL} from "../../common/constants";

interface RoomViewProps {

    item: Room;

}

interface RoomViewState {

    loaded       : boolean;
    ownBodyReady : boolean;

}

class RoomView extends React.Component<RoomViewProps, RoomViewState> {

    static defaultProps : Partial<RoomViewProps> = {
    };

    constructor(props: RoomViewProps) {

        super(props);

        this.state = {
            loaded       : false,
            ownBodyReady : false
        };

        // @ts-ignore
        window.AFRAME.ASSETS_PATH = ASSETS_URL;

    }

    onBodyLoaded = (e : any) => {

        if (e?.detail?.body?.el?.id === "peer") {
            // @ts-ignore
            window.scene.removeEventListener("body-loaded", this.onBodyLoaded);
            this.setState({ownBodyReady: true});
        }

    };

    private static _sceneShouldPlay () : boolean {
        // @ts-ignore
        return !!(window.scene && !window.scene.isPlaying);
    }

    componentDidMount() {

        this.setState({
            ...this.state,
            loaded: true
        });

    }

    // componentDidUpdate(prevProps: Readonly<RoomViewProps>, prevState: Readonly<RoomViewState>, snapshot?: any) {
    //
    //     const sceneShouldPlay = RoomView._sceneShouldPlay();
    //
    //
    //
    // }

    render() {

        // const isMobile = window.AFRAME.utils.device.isMobile();
        // const sceneShouldPlay = RoomView._sceneShouldPlay();
        const isLoaded = this.state.loaded;

        return (
            <div className={ClassName.ROOM_VIEW}>

                <h1 className={ClassName.ROOM_VIEW+'-title'}>{this.props.item.name}</h1>

                <div className={ClassName.ROOM_VIEW+'-scene'}>
                    {isLoaded ? RoomUtils.buildRoomScene(this.props.item) : null}
                </div>

            </div>
        );

    }

}

export default RoomView;
