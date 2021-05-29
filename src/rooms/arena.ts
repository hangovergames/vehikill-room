// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

import Scene, {
    CollisionGroup,
    EntityId,
    EntityType,
    FogType, ImageType,
    LoadingTrackerKey,
    MixinType,
    ModelType,
    Primitive,
    SceneEvent,
    ShadowType,
    ShapeType,
    Side,
    SoundType,
    Tag
} from "../common/Scene";
import Room from "../common/Room";
import RoomName from "../common/RoomName";

const FOG_COLOR = '#7a8067';

export const SCENE : Scene = {

    shadow: {
        type: ShadowType.BASIC
    },

    fog: {
        type: FogType.LINEAR,
        near: -20,
        far: 321,
        color: FOG_COLOR
    },

    assets: [

        {
            description: 'Floor',
            type: EntityType.REACT,
            id: EntityId.FLOOR,
            primitive: Primitive.MIXIN,
            staticBody: {
                shape: ShapeType.BOX,
                collisionFilterGroup: CollisionGroup.ENVIRONMENT,
                collisionFilterMask: CollisionGroup.ANY,
                collisionResponseGroup: CollisionGroup.ENVIRONMENT,
                collisionResponseMask: CollisionGroup.ANY
            },
            collisionSound: {
                type: SoundType.FLOOR_M
            },
            shadow: {
                cast: false
            }
        },
        {
            description: 'Object',
            type: EntityType.REACT,
            id: EntityId.OBJECT,
            primitive: Primitive.MIXIN,
            dynamicBody: {
                collisionFilterGroup: CollisionGroup.OBJECTS,
                collisionFilterMask: CollisionGroup.ANY,
                collisionResponseGroup: CollisionGroup.OBJECTS,
                collisionResponseMask: CollisionGroup.ANY
            },
            collisionSound: {
                type: SoundType.COLLISION_M
            },
            shadow: {
                receive: false,
                cast: true
            }
        }
    ],

    elements: [

        {
            description: 'floor ramps bridges pillars',
            type: EntityType.REACT,
            id: EntityId.ARENA,
            cachedGltfModel: {
                type: ModelType.ARENA
            },
            position: "0 0 0",
            rotation: "0 0 0",
            scale: "1 1 1",
            loadingTracker: {
                key: LoadingTrackerKey.ARENA
            },
            traverseShadows: {
                castShadow: true,
                receiveShadow: true
            }
        },

        {
            description: 'fence 1',
            type: EntityType.STANDARD,

            mixin: MixinType.FLOOR,
            instancedGltfModel: {type: ModelType.FENCE_WIRE},
            instancedMaterialModifier: {
                side: Side.DOUBLE_SIDE
            },
            nid: 43,
            class: "floor",
            position: "0 5.6 -105",
            rotation: "0 0 0",
            scale: "1 0.9 1",
            receiveShadow: true,
            loadingTracker: {
                key: LoadingTrackerKey.FENCE_WIRE
            }

        },

        {
            description: 'fence 2',
            type: EntityType.STANDARD,

            mixin: MixinType.FLOOR,
            instancedGltfModel: {type: ModelType.FENCE_WIRE},
            nid: 42,
            class: "floor",
            position: "0 5.6 105",
            rotation: "0 180 0",
            scale: "1 0.9 1",
            receiveShadow: true,
            loadingTracker: { key: LoadingTrackerKey.FENCE_WIRE },

        },

        {
            description: 'fence 3',
            type: EntityType.STANDARD,

            mixin: MixinType.FLOOR,
            instancedGltfModel: {
                type: ModelType.FENCE_WIRE
            },
            nid: 41,
            class: "floor",
            position: "105 5.6 0",
            rotation: "0 -90 0",
            scale: "1 0.9 1",
            receiveShadow: true,
            loadingTracker: { key: LoadingTrackerKey.FENCE_WIRE },

        },

        {
            description: 'fence 4',
            type: EntityType.STANDARD,

            mixin: MixinType.FLOOR,
            instancedGltfModel: {
                type: ModelType.FENCE_WIRE
            },
            nid: 40,
            class: "floor",
            position: "-105 5.6 0",
            rotation: "0 90 0",
            scale: "1 0.9 1",
            receiveShadow: true,
            loadingTracker: { key: LoadingTrackerKey.FENCE_WIRE },

        },

        {
            description: 'Buildings',
            type: EntityType.STANDARD,

            id: EntityId.BUILDINGS,
            cachedGltfModel: {
                type: ModelType.BUILDINGS
            },
            position: "0 2 0",
            rotation: "0 0 0",
            scale: "1 1 1",
            receiveShadow: true,
            loadingTracker: { key: LoadingTrackerKey.BUILDINGS },
            visible: true

        },

        {
            description: 'lethal floor that kills players who fall off the arena',
            type: EntityType.REACT,

            nid: 91,
            geometry: {
                primitive: Primitive.BOX,
                width: 2000,
                height: 10,
                depth: 2000
            },
            visible: false,
            position: "0 -20 0",
            staticBody: {
                shape: ShapeType.BOX,
                tags: [Tag.LETHAL],
                collisionFilterGroup: CollisionGroup.ENVIRONMENT,
                collisionFilterMask: CollisionGroup.ANY,
                collisionResponseGroup: CollisionGroup.ENVIRONMENT,
                collisionResponseMask: CollisionGroup.ANY
            },
            shadow: {cast: false}

        },

        {
            description: 'floor 1',
            type: EntityType.STANDARD,

            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
                ,},
            mixin: MixinType.FLOOR,
            nid: 50,
            class: "floor",
            position: "61.549 -7.2 0",
            rotation: "0 90 0",
            scale: "260 15 107",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'floor 2',
            type: EntityType.STANDARD,

            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            nid: 51,
            class: "floor",
            position: "-61.6 -7.2 0",
            rotation: "0 90 0",
            scale: "265 15 107",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            }

        },

        {
            description: 'ramp over pit',
            type: EntityType.STANDARD,

            nid: 47,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "-21 -1 55",
            rotation: "14.9 -90 0",
            scale: "23.9128 5.0546 19.3066",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'ramp over pit other side',
            type: EntityType.STANDARD,

            nid: 46,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "21 -1 -55",
            rotation: "-15 -90 0",
            scale: "23.9128 5.0546 19.3066",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'ramp on the other side',
            type: EntityType.STANDARD,

            nid: 45,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "-67 -2.1 -45",
            rotation: "12 180 0",
            scale: "18.2 7.221 27.581",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'ramp on the other side',
            type: EntityType.STANDARD,

            nid: 44,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "-67 -2.1 -5",
            rotation: "12 0 0",
            scale: "18.2 7.221 27.581",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },


        },

        {
            description: 'platform',
            type: EntityType.STANDARD,

            nid: 39,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "87 0 -9.33",
            rotation: "0 0 0",
            scale: "34.5488m 7.4632m 55.7272m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },


        },

        {
            description: 'ramp-platform 1',
            type: EntityType.STANDARD,

            nid: 38,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "87 -7.72 28.81",
            rotation: "0 90 20",
            scale: "27.1702m 14.4766m 34.349m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },


        },

        {
            description: 'ramp-platform 2',
            type: EntityType.STANDARD,

            nid: 37,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "59.42 -7.72 -9.33",
            rotation: "0 0 20",
            scale: "27.1702m 14.46m 56.2076m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'ramp-platform 3',
            type: EntityType.STANDARD,

            nid: 36,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "87 -7.72 -47.48",
            rotation: "0 90 -20",
            scale: "27.1702m 14.4766m 34.349m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'viaduct pillar 1',
            type: EntityType.STANDARD,

            nid: 35,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "68 6 -39.3",
            rotation: "0 0 0",
            scale: "3.5384m 18.5502m 3.5384m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },


        },

        {
            description: 'viaduct pillar 2',
            type: EntityType.STANDARD,

            nid: 34,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "68 6 20.6",
            rotation: "0 0 0",
            scale: "3.5384m 18.5502m 3.5384m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'viaduct pillar 3',
            type: EntityType.STANDARD,

            nid: 33,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "68 6 73.5",
            rotation: "0 0 0",
            scale: "3.5384m 18.5502m 3.5384m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'viaduct pillar 4',
            type: EntityType.STANDARD,

            nid: 32,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "35.53 6 -72.59",
            rotation: "0 45 0",
            scale: "3.5384m 18.5502m 3.5384m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'Bridge center',
            type: EntityType.STANDARD,

            nid: 31,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "0 -0.3 0",
            rotation: "0 90 0",
            scale: "36.591m 1.1508m 48.6002m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'Bridge side 1',
            type: EntityType.STANDARD,

            nid: 30,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "0 -0.3 -110",
            rotation: "0 90 0",
            scale: "36.591m 1.1508m 48.6002m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },


        },

        {
            description: 'Bridge side 2',
            type: EntityType.STANDARD,

            nid: 29,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "0 -0.3 110",
            rotation: "0 90 0",
            scale: "36.591m 1.1508m 48.6002m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'pillar 1',
            type: EntityType.STANDARD,

            nid: 28,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "68 13.52 17.1504",
            rotation: "90 0 0",
            scale: "3.53841m 116.132m 3.53842m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        },

        {
            description: 'pilar 2',
            type: EntityType.STANDARD,

            nid: 27,
            geometry: {
                primitive: Primitive.BOX,
                width: 1,
                height: 1,
                depth: 1
            },
            mixin: MixinType.FLOOR,
            class: "floor",
            position: "51.32 13.52 -56.79",
            rotation: "90 0 -45",
            scale: "3.5384m 48.045m 3.5384m",
            visible: false,
            loadingTracker: {
                key: LoadingTrackerKey.INVISIBOX,
                event: SceneEvent.LOADED
            },

        }

    ]

}

export const ROOM : Room = {
    name: RoomName.arena,
    image: ImageType.DERBY,
    description: 'New arena battleground!',
    scene: SCENE
};

export default ROOM;

