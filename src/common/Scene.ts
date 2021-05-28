
export type Color = string;

export enum EntityId {
    ARENA     = "arena",
    OBJECT    = "object",
    FLOOR     = "floor",
    BUILDINGS = "buildings"
}

export enum CollisionGroup {
    ANY         = -1,
    NONE        = 0,
    DEFAULT     = 1,
    ENVIRONMENT = 2,
    OBJECTS     = 4,
    PLAYERS     = 8,
    LOOT        = 16
}

export enum ShadowType {

    BASIC = "basic"

}

export enum Primitive {

    MIXIN = "a-mixin",
    BOX = "box"

}

export enum FogType {

    LINEAR = "linear"

}

/**
 *
 * The result should be `/assets/sounds/{SoundType}`
 */
export enum SoundType {

    FLOOR_M     = "floor_m.m4a",
    COLLISION_M = "collision-m.m4a"

}

export enum ShapeType {

    BOX = "box"

}

/**
 * The result should be `/assets/models/{ModelType}`
 */
export enum ModelType {
    ARENA      = "arena-new/arena-cleanup.gltf",
    FENCE_WIRE = "fence-wire.gltf",
    BUILDINGS  = "buildings/buildings.gltf"
}

export enum MixinType {
    FLOOR = "floor"
}

export enum Tag {
    LETHAL = "lethal"
}

export interface Shadow {

    type    ?: ShadowType;
    receive ?: boolean;
    cast    ?: boolean;

}

export interface Fog {

    type  : FogType;
    near  : number;
    far   : number;
    color : Color;

}

export interface Body {

    shape                  ?: ShapeType;
    collisionFilterGroup    : CollisionGroup;
    collisionFilterMask     : CollisionGroup;
    collisionResponseGroup  : CollisionGroup;
    collisionResponseMask   : CollisionGroup;
    tags                   ?: Tag[];

}

export interface Sound {

    type: SoundType;

}

export enum EntityType {
    REACT    = 'AEntity',
    STANDARD = 'a-entity'
}


export type Position = string;
export type Scale = string;

export interface Model {
    type: ModelType;
}

export interface TraverseShadows {
    castShadow    : boolean;
    receiveShadow : boolean;
}

export enum LoadingTrackerKey {

    ARENA      = "arena.gltf",
    FENCE_WIRE = "fence-wire.gltf",
    BUILDINGS  = "buildings.gltf",
    INVISIBOX  = "invisibox"

}

export enum SceneEvent {
    LOADED = "loaded"
}

export interface LoadingTracker {

    key    : LoadingTrackerKey;
    event ?: SceneEvent;

}

export interface Geometry {

    primitive : Primitive;
    width     : number;
    height    : number;
    depth     : number;

}

export interface ReactEntity {

    description     ?: string;
    type            ?: EntityType.REACT;
    id              ?: EntityId;
    primitive       ?: Primitive;
    staticBody      ?: Body;
    dynamicBody     ?: Body;
    collisionSound  ?: Sound;
    shadow          ?: Shadow;
    cachedGltfModel ?: Model;
    position        ?: Position;
    rotation        ?: Position;
    scale           ?: Scale;
    loadingTracker  ?: LoadingTracker;
    traverseShadows ?: TraverseShadows;
    nid             ?: number;
    visible         ?: boolean;
    geometry        ?: Geometry;

}

export enum Side {
    DOUBLE_SIDE = "DOUBLE_SIDE"
}

export interface InstancedMaterialModifier {
    side: Side;
}

export interface StandardEntity {

    description     ?: string;
    type            : EntityType.STANDARD;

    id             ?: EntityId;
    primitive      ?: Primitive;
    staticBody     ?: Body;
    dynamicBody    ?: Body;
    collisionSound ?: Sound;
    shadow         ?: Shadow;

    nid             ?: number;
    class           ?: string;
    position        ?: Position;
    rotation        ?: Position;
    scale           ?: Scale;
    receiveShadow   ?: boolean;
    mixin           ?: MixinType;

    instancedMaterialModifier ?: InstancedMaterialModifier;
    instancedGltfModel        ?: Model;
    loadingTracker            ?: LoadingTracker;
    geometry        ?: Geometry;
    visible         ?: boolean;
    cachedGltfModel ?: Model;

}

export type Entity = ReactEntity | StandardEntity;

export interface Scene {

    shadow      : Shadow;
    fog         : Fog;

    assets      : Entity[];

    elements    : Entity[];

}

export default Scene;
