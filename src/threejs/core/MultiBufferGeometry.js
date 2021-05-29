// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy
// Copyright (c) 2018 David Lenaerts

import {InstancedBufferGeometry} from "three/src/core/InstancedBufferGeometry";
import {InstancedBufferAttribute} from "three/src/core/InstancedBufferAttribute";
import {BufferGeometry} from "three/src/core/BufferGeometry";

export class MultiBufferGeometry extends InstancedBufferGeometry {

    constructor() {

        super();

        // TODO: Wherever needsUpdate is set, we should have to define the update range
        // InstancedBufferGeometry.call(this);

        // to contain the maximum amount of data
        this.numInstances = 0;

        // this will be defined by custom frustum culling
        this.maxInstancedCount = 0;

        // storing matrices as ROWS so we can easily use 4x3 datasets
        this._matAttrib0 = null;    // row 0
        this._matAttrib1 = null;    // row 1
        this._matAttrib2 = null;    // row 2

        this.type = 'MultiBufferGeometry';

    }

    addInstance () {
        ++this.numInstances;
        this._addAttributes();
    }

    removeInstance () {
        --this.numInstances;
        this._addAttributes();
    }

    // TODO: inline this in MultiMesh?
    setMatrix (index, matrix) {
        var m = matrix.elements;
        var ma0 = this._matAttrib0.array;
        var ma1 = this._matAttrib1.array;
        var ma2 = this._matAttrib2.array;

        index <<= 2;

        ma0[index] = m[0];
        ma1[index] = m[1];
        ma2[index] = m[2];
        ++index;
        ma0[index] = m[4];
        ma1[index] = m[5];
        ma2[index] = m[6];
        ++index;
        ma0[index] = m[8];
        ma1[index] = m[9];
        ma2[index] = m[10];
        ++index;
        ma0[index] = m[12];
        ma1[index] = m[13];
        ma2[index] = m[14];
    }

    fromBufferGeometry (geometry) {
        BufferGeometry.prototype.copy.call(this, geometry);
        this.numInstances = 0;
        this._addAttributes();
        this.computeBoundingBox();
    }

    invalidateTransforms (attributes, renderer) {
        var gl = renderer.context;
        this._matAttrib0.needsUpdate = true;
        this._matAttrib1.needsUpdate = true;
        this._matAttrib2.needsUpdate = true;

        attributes.update(this._matAttrib0, gl.ARRAY_BUFFER);
        attributes.update(this._matAttrib1, gl.ARRAY_BUFFER);
        attributes.update(this._matAttrib2, gl.ARRAY_BUFFER);
    }

    _addAttributes() {
        this._matAttrib0 = this._createMatrixAttrib(this._matAttrib0);
        this._matAttrib1 = this._createMatrixAttrib(this._matAttrib1);
        this._matAttrib2 = this._createMatrixAttrib(this._matAttrib2);

        this.setAttribute("instanceMatrix0", this._matAttrib0);
        this.setAttribute("instanceMatrix1", this._matAttrib1);
        this.setAttribute("instanceMatrix2", this._matAttrib2);
    }

    _createMatrixAttrib (old)  {
        var length = this.numInstances? this.numInstances << 2 : 4;
        var data = new Float32Array(length);
        return new InstancedBufferAttribute(data, 4, false).setUsage(window.THREE.DynamicDrawUsage);
    }

}

export default MultiBufferGeometry;
