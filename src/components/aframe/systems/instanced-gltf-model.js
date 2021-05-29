// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

/* global AFRAME */
/* global THREE */
import {RenderLayers} from "../RenderLayers";
import {FlattenSceneGraph} from "../util/FlattenSceneGraph";
import AssetCache from "../util/AssetCache";

/**
 * instanced glTF model loader.
 */
export default AFRAME.registerSystem('instanced-gltf-model', {
    schema: {},

    init: function () {
        this.cache = new AssetCache(window.THREE.GLTFLoader);
        // this allows us to change the loaded object before it's moved in the cache
        this.cache.processLoaded = this._processLoaded.bind(this);
        this.cache.processDestroyed = this._processDestroyed.bind(this);
        this.multiMeshes = {};      // maps original GLTF Mesh to MultiMesh
        this.idCounter = 0;
    },

    getOrLoadModel: function(component, src, onComplete, onFail)
    {
        let self = this;

        function onModelLoaded(model)
        {
            // If the component was removed while loading, abort.
            // Prevents ghost instances from being created.
            if (component.removed) {
              self.cache.freeUsage(src);
              return
            }
            // the cache returns the original loaded object,
            // we need to clone and process it.
            self.onModelReady(model, onComplete)
        }

        this.cache.getOrLoad(src, onModelLoaded, onFail);
    },

    _processDestroyed: function(model)
    {
        // NB: callback disabled in AssetCache.
        // when a cached object is destroyed, we must also destroy all MultiMesh objects created for it
        model.traverse(this.traverseOnDestroy.bind(this));
    },

    _processLoaded: function(srcModel, onComplete)
    {
        // select relevant scene, optimize scene graph, and create required MultiMeshes
        let model = srcModel.scene || srcModel.scenes[0];

        if (!srcModel.animations || srcModel.animations.length === 0)
            model = FlattenSceneGraph.flatten(model);

        model.animations = srcModel.animations;

        let clonedMaterials = {};
        model.traverse(this.traverseInitMultiMesh.bind(this, clonedMaterials));
        onComplete(model);
    },

    onModelReady: function(srcModel, onComplete)
    {
        let arr = [];
        srcModel.traverse(function(obj) {
            arr.push(obj.onBeforeRender);
        });

        let clone = srcModel.clone();
        let i = 0;
        let self = this;
        clone.traverse(function(obj) {
            self.traverseCreateInstance(obj);
            obj.onBeforeRender = arr[i++];
        });
        onComplete(clone);
    },

    /**
     * Let system know that an entity is no longer using a model.
     */
    unuseModel: function (model, src) {
        model.traverse(this.traverseOnRemove.bind(this));

        this.cache.freeUsage(src);
    },

    // needs to be passed to the CLONED object
    traverseCreateInstance: function(obj)
    {
        // Putting the grabbable gltf scene objects in their own layer so they don't take up any processing power while
        // rendering, as this is purely handled by the MultiMesh objects
        obj.layers.set(RenderLayers.GRABBABLE_GLTF_SCENE);
        obj.layersRecursive = true;
        obj.userData.isInstanced = true;
        obj.renderOrder = 1000;

        if (obj.isMesh) {

            // create a new multimesh instance and store ID on the original Mesh
            obj.userData.instanceID = this.multiMeshes[obj.userData.multiMeshID].createInstance(obj);
            obj.material.polygonOffset = true;
            obj.material.polygonOffsetFactor = 0;
            obj.material.polygonOffsetUnits = -3;
        }
    },

    // needs to be passed to the CLONED object (on the scene)
    traverseOnRemove: function (obj)
    {
        let multiMeshes = this.multiMeshes;

        if (obj.isMesh) {
            multiMeshes[obj.userData.multiMeshID].destroyInstance(obj.userData.instanceID);
        }
    },

    // needs to be passed to the CACHED object
    traverseOnDestroy: function(obj)
    {
        let multiMeshes = this.multiMeshes;
        let scene = this.sceneEl.object3D;

        if (obj.isMesh) {
            scene.remove(multiMeshes[obj.userData.multiMeshID]);
            delete multiMeshes[obj.userData.multiMeshID];
        }
    },

    // needs to be passed to the CACHED object
    traverseInitMultiMesh: function(materialCache, obj)
    {
        let multiMeshes = this.multiMeshes;
        let scene = this.sceneEl.object3D;

        if (obj.isMesh) {
            // userData.multiMeshID will be cloned along, giving us a reliable key to find the MultiMesh belonging to each mesh
            obj.userData.multiMeshID = ++this.idCounter;

            if (!materialCache[obj.material.uuid]) {
                obj.material.side = THREE.FrontSide;
                let clonedMaterial = obj.material.clone();
                // force single side by default
                clonedMaterial.side = THREE.FrontSide;
                clonedMaterial.instanced = true;
                copyAdditionalMaterialProperties(obj.material, clonedMaterial);
                materialCache[obj.material.uuid] = clonedMaterial;
                // obj.material.visible = false;
            }

            let multiMesh = new THREE.MultiMesh(obj.geometry, materialCache[obj.material.uuid]);
            // make sure multi mesh is rendered last so we can add outlines (and perhaps other things) in between
            multiMesh.onBeforeRender = obj.onBeforeRender;
            multiMesh.frustumCulled = false;
            multiMesh.castShadow = true;
            multiMeshes[obj.userData.multiMeshID] = multiMesh;
            scene.add(multiMesh);
        }
    }
});

function copyAdditionalMaterialProperties(src, dst)
{
    // some potential GLTF specific stuff
    dst.isGLTFSpecularGlossinessMaterial = src.isGLTFSpecularGlossinessMaterial;
    dst.alphaMap = src.alphaMap;
    dst.aoMap = src.aoMap;
    dst.aoMapIntensity = src.aoMapIntensity
    dst.bumpMap = src.bumpMap;
    dst.bumpScale = src.bumpScale;
    dst.color = src.color;
    dst.displacementBias = src.displacementBias;
    dst.displacementMap = src.displacementMap;
    dst.displacementScale = src.displacementScale;
    dst.emissive = src.emissive;
    dst.emissiveIntensity = src.emissiveIntensity;
    dst.emissiveMap = src.emissiveMap;
    dst.envMap = src.envMap;
    dst.envMapIntensity = src.envMapIntensity;
    dst.glossiness = src.glossiness;
    dst.glossinessMap = src.glossinessMap;
    dst.lightMap = src.lightMap;
    dst.lightMapIntensity = src.lightMapIntensity;
    dst.map = src.map;
    dst.normalMap = src.normalMap;
    dst.refractionRatio = src.refractionRatio;
    dst.specular = src.specular;
    dst.specularMap = src.specularMap;
}
