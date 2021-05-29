// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

import Room from "../common/Room";
import {Entity as AEntity} from "aframe-react";
import React from "react";
import map from "lodash/map";
import keys from "lodash/keys";
import isBoolean from "lodash/isBoolean";
import {
    Entity,
    EntityType, Fog, Geometry,
    InstancedMaterialModifier,
    LoadingTracker,
    Model,
    Shadow, Side,
    TraverseShadows
} from "../common/Scene";
import {MODEL_ASSET_URL} from "../common/constants";

export class RoomUtils {

    static stringifyObject (obj: { [key:string] : any }, separator : string = ', ') : string {
        return map(keys(obj), (key : string) : string => {
            // @ts-ignore
            const value : any = obj[key];

            if (isBoolean(value)) return `${key}: ${value ? 'true' : 'false'}`;

            return `${key}: ${value}`;

        }).join(separator);
    }

    static stringifyModel (item: Model) : string {
        return `url(${MODEL_ASSET_URL(item.type)})`;
    }

    static stringifyShadow (item : Shadow) : string {
        return RoomUtils.stringifyObject(item);
    }

    static stringifyFog (item : Fog) : string {
        return RoomUtils.stringifyObject(item);
    }

    static stringifyLoadingTracker (item : LoadingTracker) : string {
        return RoomUtils.stringifyObject(item, '; ');
    }

    static stringifyTraverseShadows (item : TraverseShadows) : string {
        return RoomUtils.stringifyObject(item);
    }

    static stringifyGeometry (item : Geometry) : string {
        return RoomUtils.stringifyObject(item, '; ');
    }

    static stringifyInstancedMaterialModifier (item : InstancedMaterialModifier) : string {

        if (item.side === Side.DOUBLE_SIDE) {
            return `side: ${window.AFRAME.THREE.DoubleSide};`;
        }

        return '';

    }

    static stringifyBoolean (item : boolean | undefined) {
        return item ? 'true' : 'false';
    }

    static buildEntity (item: Entity, key: string) : any {

        const elementKey = `${key}-${item?.nid}-${item?.id}`

        const entityProps : {[key: string] : any} = {};

        if (item?.id                        !== undefined) entityProps.id                         = `${item.id}`;
        if (item?.primitive                 !== undefined) entityProps.primitive                  = `${item.primitive}`;
        if (item?.shadow                    !== undefined) entityProps.shadow                     = RoomUtils.stringifyShadow(item.shadow);
        if (item?.nid                       !== undefined) entityProps.nid                        = `${item.nid}`;
        if (item?.position                  !== undefined) entityProps.position                   = `${item.position}`;
        if (item?.rotation                  !== undefined) entityProps.rotation                   = `${item.rotation}`;
        if (item?.scale                     !== undefined) entityProps.scale                      = `${item.scale}`;
        if (item?.visible                   !== undefined) entityProps.visible                    = RoomUtils.stringifyBoolean(item.visible);
        if (item?.geometry                  !== undefined) entityProps.geometry                   = RoomUtils.stringifyGeometry(item.geometry);
        if (item?.loadingTracker            !== undefined) entityProps['loading-tracker']         = RoomUtils.stringifyLoadingTracker(item.loadingTracker);
        if (item?.cachedGltfModel           !== undefined) entityProps['cached-gltf-model']       = RoomUtils.stringifyModel(item.cachedGltfModel);
        if (item?.class                     !== undefined) entityProps.class                      = `${item.class}`;
        if (item?.mixin                     !== undefined) entityProps.mixin                      = `${item.mixin}`;
        if (item?.receiveShadow             !== undefined) entityProps['receive-shadow']               = RoomUtils.stringifyBoolean(item.receiveShadow);
        if (item?.instancedMaterialModifier !== undefined) entityProps['instanced-material-modifier']  = RoomUtils.stringifyInstancedMaterialModifier(item.instancedMaterialModifier);
        if (item?.instancedGltfModel        !== undefined) entityProps['instanced-gltf-model']         = RoomUtils.stringifyModel(item.instancedGltfModel);

        if (item.type === EntityType.REACT) {

            if (item?.staticBody      !== undefined ) entityProps['static-body']      = item.staticBody;
            if (item?.dynamicBody     !== undefined ) entityProps['dynamic-body']     = item.dynamicBody;
            if (item?.traverseShadows !== undefined ) entityProps['traverse-shadows'] = RoomUtils.stringifyTraverseShadows(item.traverseShadows);

        }

        console.log('ITEM =', item);
        console.log('ITEM PROPS =', entityProps);

        if (item.type === EntityType.REACT) {
            return (
                <AEntity
                    key={elementKey}
                    {...entityProps}
                />
            );
        } else {
            return (
                <a-entity
                    key={elementKey}
                    {...entityProps}
                />
            );
        }

    }

    static buildRoomScene (room: Room) : any {

        const {scene} = room;
        const {shadow, fog, assets, elements} = scene;

        const sceneProps = {
            id: 'scene',
            shadow: RoomUtils.stringifyShadow(shadow),
            fog: RoomUtils.stringifyFog(fog)
        };

        return (
            <a-scene {...sceneProps}>

                <a-entity rotation="90 90 -90">
                    <a-camera id="main-camera"
                              position="0 15 150"
                              user-height="0.6"
                              look-controls="enabled: true"
                              wasd-controls="acceleration:200">
                        <a-entity cursor="rayOrigin: mouse" />
                    </a-camera>
                </a-entity>

                <a-assets>{map(
                    assets,
                    (item, index) => RoomUtils.buildEntity(item, `asset-${index}`)
                )}</a-assets>

                {map(
                    elements,
                    (item, index) => RoomUtils.buildEntity(item, `element-${index}`)
                )}

                {/*<AEntity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 0, y: 0, z: -5}}/>*/}
                {/*<AEntity particle-system={{preset: 'snow'}}/>*/}
                {/*<AEntity light={{type: 'point'}}/>*/}
                {/*<AEntity gltf-model={{src: 'virtualcity.gltf'}}/>*/}

            </a-scene>
        );

    }

    static Rig () {
        return (
            <AEntity
                key="camera"
                id="camera"
                camera={{
                    // Don't pause the entity when camera goes inactive. Otherwise,
                    // the controls will stop working and bird will stop animating when
                    // exiting VR (=changing to third person camera).
                    // pauseEntityWhenInactive: false,
                    // fov: 82
                }}
                // chasecam={{
                //     target: '#peer',
                //     pedestal: car.cameraPedestal,
                //     lerp: 1,
                //     offset: car.cameraOffset
                // }}
                // to enable in-world UI (in ui/3D) uncomment the next two lines
                // cursor="rayOrigin: mouse;"
                // raycaster="enabled: false; objects: .ui-clickable"

                look-controls
                wasd-controls
            />
        );
    }

}

// if (window.AFRAME) {
//     window.AFRAME.registerComponent('rotation-reader', {
//         tick: function () {
//
//             // `this.el` is the element.
//             // `object3D` is the three.js object.
//
//             // `rotation` is a three.js Euler using radians. `quaternion` also available.
//             console.log(this.el.object3D.rotation);
//
//             // `position` is a three.js Vector3.
//             console.log(this.el.object3D.position);
//         }
//     });
// }

export default RoomUtils;
