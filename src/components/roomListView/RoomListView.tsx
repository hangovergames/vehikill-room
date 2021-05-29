import React from 'react';
import Room from "../../common/Room";
import map from "lodash/map";
import {Link} from "react-router-dom";
import ClassName from "../../common/ClassName";
import "./RoomListView.scss";
import {IMAGE_ASSET_URL} from "../../common/constants";

interface RoomListViewProps {

    list: Room[];

}

interface RoomListViewState {

}

class RoomListView extends React.Component<RoomListViewProps, RoomListViewState> {

    static defaultProps : Partial<RoomListViewProps> = {
    };

    // constructor(props: RoomListViewProps) {
    //     super(props);
    // }

    render() {

        return (
            <React.Fragment>
                <div className={ClassName.ROOM_LIST_VIEW}>
                {map(
                    this.props.list,
                    (room: Room) => (
                        <div
                            key={`room-${room.name}`}
                            className={ClassName.ROOM_LIST_VIEW+'-item'}
                            style={{background: `url(${IMAGE_ASSET_URL(room.image)})`}}>

                            <Link className={ClassName.ROOM_LIST_VIEW+'-item-content'} to={`/${room.name}`}>
                                <span className={ClassName.ROOM_LIST_VIEW+'-item-name'}>#{room.name}</span>
                                <span className={ClassName.ROOM_LIST_VIEW+'-item-description'}>{room.description}</span>
                            </Link>

                        </div>
                    )
                )}
                </div>
            </React.Fragment>
        );

    }

}

export default RoomListView;
