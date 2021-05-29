// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy
// Copyright (c) 2018 David Lenaerts

import { Mesh } from "three/src/objects/Mesh";
import { MultiBufferGeometry } from "../core/MultiBufferGeometry";
import { Matrix4 } from "three/src/math/Matrix4";

/**
 * this uses an instanced buffer geometry in order to draw clones of objects (the only per-instance data is the transform)
 * WARNING: geometry is not shared, but a unique instance of BufferGeometry is created. This is because the geometry will
 * need to store instance-dependent transforms. This is acceptable, since the MultiMesh's purpose is to be shared itself,
 * and as such replaces the purpose of a shared geometry.
 */
export class MultiMesh extends Mesh {

    isMesh: true;
    isMultiMesh: true;

    constructor(geometry, material) {

        var bufferGeometry = new MultiBufferGeometry();
        bufferGeometry.fromBufferGeometry(geometry);

        super(bufferGeometry, material);

        this.type = 'MultiMesh';
        this.frustumCulled = false;
        this.internalFrustumCulling = true;
        this._entries = [];
        this._idToIndex = {};
        this._idCounter = 0;
        this._attributes = null;

    }

    // wrapper functions:
    // linkedObject is optional, it's there to link a scene graph object directly to an instance, removing the need for setMatrix
    createInstance(linkedObject) {
        var id = this._idCounter++;

        // update the index
        this._idToIndex[id] = this._entries.length;

        var entry = {
            matrix: linkedObject? null : new Matrix4(),
            link: linkedObject,
            id: id,
            bounds: this.geometry.boundingBox.clone(),
            originalUpdateMatrixWorld: null
        };
        this._entries.push(entry);

        var geometry = this.geometry;

        if (linkedObject) {
            entry.originalUpdateMatrixWorld = linkedObject._updateMatrixWorld;
            linkedObject._updateMatrixWorld = function()
            {
                entry.originalUpdateMatrixWorld.call(this);
                entry.bounds.copy(geometry.boundingBox).applyMatrix4(this._matrixWorld);
            }
        }

        this.geometry.addInstance();
        return id;
    }

    destroyInstance(id) {
        var index = this._idToIndex[id];
        var entry = this._entries[index];

        if (entry.link) {
            entry.link._updateMatrixWorld = entry.originalUpdateMatrixWorld;
        }

        this._entries.splice(index, 1);
        this.geometry.removeInstance();
        delete this._idToIndex[id];

        // all objects from index on now have 1 lower index, so reflect this in the lookup
        for (var key in this._idToIndex) {
            if (this._idToIndex[key] > index) {
                --this._idToIndex[key];
            }
        }
    }

    updateBuffers (renderer, frustum) {
        // this is only the first frame, thanks to how three works
        if (!this._attributes) return;

        // handle frustum culling
        var geometry = this.geometry;
        var numInstances = geometry.numInstances;
        var entries = this._entries;
        var numVisible = 0;
        var doCulling = this.internalFrustumCulling;

        var visible, linked;
        for (var i = 0; i < numInstances; ++i) {
            var entry = entries[i];
            var matrix = entry.link? entry.link.matrixWorld : entry.matrix;
            var bounds = entry.bounds;
            linked = entry.link;
            visible = true;

            var inFrustum = !doCulling || frustum.intersectsBox(bounds);

            if (!inFrustum) continue;

            while (visible && linked) {
                visible = visible && linked.visible;
                linked = linked.parent;
            }
            if (!visible) continue;

            geometry.setMatrix(numVisible, matrix);
            ++numVisible;
        }

        this.geometry.maxInstancedCount = numVisible;
        this.geometry.invalidateTransforms(this._attributes, renderer);
    }

    setMatrix (id, matrix) {
        var index = this._idToIndex[id];
        var entry = this._entries[index];
        entry.matrix = matrix;
        entry.bounds.copy(this.geometry.boundingBox).applyMatrix4(matrix);
    }

    getMatrix (id) {
        var index = this._idToIndex[id];
        return this._entries[index].matrix;
    }

    raycast( raycaster, intersects ) {
        var entries = this._entries;
        var len = entries.length;
        var matWorld = this.matrixWorld;
        for (var i = 0; i < len; ++i) {
            // temporarily override matrix with instance's local matrix
            this._matrixWorld = entries[i].matrix;
            Mesh.prototype.raycast.call(this, raycaster, intersects);
        }
        this._matrixWorld = matWorld;
    }

    _setAttributes(value) {
        this._attributes = value;
    }

}

export default MultiMesh;
