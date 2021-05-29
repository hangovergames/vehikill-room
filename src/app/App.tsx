import React from 'react';
import './App.scss';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import ROOMS from "../rooms";
import RoomListView from "../components/roomListView/RoomListView";
import RoomView from "../components/roomView/RoomView";
import Room from "../common/Room";
import find from "lodash/find";
import RoomName, {isRoomName} from "../common/RoomName";

interface ItemFinder<T, NameT> {
    (name: NameT) : T | undefined;
}

function ViewRoomParamMapper (props: {View: any, itemFinder: ItemFinder<Room, RoomName>}) {

    const { View, itemFinder } = props;

    const { item = undefined } = useParams<{item: RoomName}>();

    if (isRoomName(item)) {
        const room : Room | undefined = itemFinder(item);
        if (room) {
            return <View item={room} />;
        }
    }

    return null;
}

function App() {
    return (
        <Router>
            <div className="App">

                <nav>
                    <ul>
                        <li><Link to="/">Rooms</Link></li>
                    </ul>
                </nav>

                <section>
                    <Switch>

                        <Route exact path="/">
                            <RoomListView list={ROOMS}/>
                        </Route>

                        <Route path="/:item">
                            <ViewRoomParamMapper
                                View={RoomView}
                                itemFinder={(itemName: RoomName) : Room | undefined => find(ROOMS, (item: Room) => item.name === itemName)} />
                        </Route>

                    </Switch>
                </section>

            </div>
        </Router>

    );
}

export default App;
