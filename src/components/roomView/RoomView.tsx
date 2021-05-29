import React from 'react';
import Room from "../../common/Room";
import ClassName from "../../common/ClassName";
import "./RoomView.scss";
import RoomUtils from "../../utils/RoomUtils";

interface RoomViewProps {

    item: Room;

}

interface RoomViewState {

}

class RoomView extends React.Component<RoomViewProps, RoomViewState> {

    static defaultProps : Partial<RoomViewProps> = {
    };

    // constructor(props: RoomViewProps) {
    //     super(props);
    // }

    render() {

        return (
            <div className={ClassName.ROOM_VIEW}>

                <h1 className={ClassName.ROOM_VIEW+'-title'}>{this.props.item.name}</h1>

                <div className={ClassName.ROOM_VIEW+'-scene'}>
                    {RoomUtils.buildRoomScene(this.props.item)}
                </div>

            </div>
        );

    }

}

export default RoomView;
