// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
//
// Note! If you need something which is available in AFrame or ThreeJS, but missing from this definition, just
// add it here and submit a pull request.
//
// Resources referenced here as `/assets/{path}` are available from https://de1.vehikill.io/assets/{path} (but not
// under MIT license).
//
// You may add new resources. However these must be free to publish as open source in this project.
//

/**
 * Color code, eg. `#ffffff` for white.
 */
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

/**
 * @see https://aframe.io/docs/1.2.0/components/geometry.html#built-in-geometries
 */
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

/**
 * @see https://aframe.io/docs/1.2.0/components/shadow.html
 */
export interface Shadow {

    type    ?: ShadowType;
    receive ?: boolean;
    cast    ?: boolean;

}

/**
 * @see https://aframe.io/docs/1.2.0/components/fog.html
 */
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

/**
 * @see https://aframe.io/docs/1.2.0/components/position.html
 */
export type Position = string;

/**
 * @see https://aframe.io/docs/1.2.0/components/rotation.html
 */
export type Rotation = string;

/**
 * @see https://aframe.io/docs/1.2.0/components/scale.html
 */
export type Scale = string;

export interface Model {
    type: ModelType;
}

/**
 * @see https://aframe.io/docs/1.2.0/components/light.html#configuring-shadows
 */
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

/**
 * @See https://aframe.io/docs/1.2.0/components/geometry.html
 */
export interface Geometry {

    primitive : Primitive;
    width     : number;
    height    : number;
    depth     : number;

}

export enum Side {

    /**
     * This is AFRAME.THREE.DoubleSide
     *
     * @see Probably same as https://threejs.org/docs/#api/en/materials/Material.shadowSide
     */
    DOUBLE_SIDE = "DOUBLE_SIDE"

}

export interface InstancedMaterialModifier {
    side: Side;
}

/**
 *
 * @See https://aframe.io/docs/1.2.0/core/entity.html
 */
export interface BaseEntity {

    description      : string;
    type             : EntityType;
    id              ?: EntityId;
    primitive       ?: Primitive;
    staticBody      ?: Body;
    dynamicBody     ?: Body;
    collisionSound  ?: Sound;
    shadow          ?: Shadow;
    nid             ?: number;
    position        ?: Position;
    rotation        ?: Rotation;
    scale           ?: Scale;

    /**
     * @see https://aframe.io/docs/1.2.0/components/visible.html#sidebar
     */
    visible         ?: boolean;

    geometry        ?: Geometry;
    loadingTracker  ?: LoadingTracker;
    cachedGltfModel ?: Model;
    class           ?: string;

    /**
     * @see https://aframe.io/docs/1.2.0/core/mixins.html
     */
    mixin           ?: MixinType;

    receiveShadow             ?: boolean;

    /**
     * This is custom feature from Vehikill code
     */
    instancedMaterialModifier ?: InstancedMaterialModifier;

    /**
     * This is custom feature from Vehikill code
     */
    instancedGltfModel        ?: Model;

}

export interface ReactEntity extends BaseEntity {

    type             : EntityType.REACT;

    /**
     * Might be available for BaseEntity, but wasn't used in current code.
     */
    traverseShadows ?: TraverseShadows;

}

export interface StandardEntity extends BaseEntity {

    type             : EntityType.STANDARD;

}

/**
 * @See https://aframe.io/docs/1.2.0/core/entity.html
 */
export type Entity = ReactEntity | StandardEntity;

/**
 * @See https://aframe.io/docs/1.2.0/core/scene.html
 */
export interface Scene {

    shadow      : Shadow;
    fog         : Fog;

    /**
     * Assets will be but inside `<a-assets></a-assets>` block as one of the first elements
     */
    assets      : Entity[];

    elements    : Entity[];

}

export default Scene;
