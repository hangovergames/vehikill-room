// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy

/* global AFRAME */
/* global THREE */

import {FlattenSceneGraph} from "../util/FlattenSceneGraph";
import AssetCache from "../util/AssetCache";

/**
 * cached glTF model loader.
 */
export default AFRAME.registerSystem('cached-gltf-model', {
    schema: {},

    init: function () {
        this.cache = new AssetCache(THREE.GLTFLoader);
        this.cache.processLoaded = this._processLoaded.bind(this);
    },

    getOrLoadModel: function(src, onComplete, onFail)
    {
        let self = this;

        function onModelLoaded(model)
        {
            // the cache returns the original loaded object, we need to clone it:
            self.onModelReady(model, onComplete)
        }

        this.cache.getOrLoad(src, onModelLoaded, onFail);
    },

    _processLoaded: function(srcModel, onComplete)
    {
        let model = srcModel.scene || srcModel.scenes[0];

        if (!srcModel.animations || srcModel.animations.length === 0)
            model = FlattenSceneGraph.flatten(model);

        model.animations = srcModel.animations;

        model.traverse(function(obj) {
            if (obj.material)
                obj.material.side = THREE.FrontSide;
        });

        onComplete(model);
    },

    /**
     * Let system know that an entity is no longer using a model.
     */
    unuseModel: function (src) {
        this.cache.freeUsage(src);
    },

    onModelReady: function(srcModel, onComplete)
    {
        // copy over all the onBeforeRender calls (some GLTFs use this), which wouldn't get applied otherwise
        let onBefores = {};
        let skeletons = {};

        srcModel.traverse(function(obj) {
            obj.userData.origUuid = obj.uuid;
            onBefores[obj.uuid] = obj.onBeforeRender;

            if (obj.skeleton)
                skeletons[obj.uuid] = obj.skeleton;
        });

        let clone = srcModel.clone();

        let oldToNew = {};

        clone.traverse(function(obj) {
            // this stores the *cloned* bones under the *old* uuid
            var origUuid = obj.userData.origUuid;
            oldToNew[origUuid] = obj;

            obj.onBeforeRender = onBefores[origUuid];
        });

        // only now can we assign the skeletons, knowing the full old -> new scene mapping
        // because we need to re-assign the old bones to the new ones
        srcModel.traverse(function(srcObj) {
            var origUuid = srcObj.userData.origUuid;
            var obj = oldToNew[origUuid]
            var sourceSkel = skeletons[origUuid];
            if (!sourceSkel) return;

            var bones = [];

            // now we can build a new skellington using the cloned bones
            for (let i = 0, len = sourceSkel.bones.length; i < len; ++i)
                bones[i] = oldToNew[sourceSkel.bones[i].uuid];

            // skeleton contains a list of bones, but these are actually the nodes of the originally loaded skeleton
            var skeleton = new THREE.Skeleton( bones, sourceSkel.boneInverses );

            obj.bind(skeleton, srcObj.bindMatrix);
        });

        clone.animations = srcModel.animations;

        onComplete(clone);
    }
});
