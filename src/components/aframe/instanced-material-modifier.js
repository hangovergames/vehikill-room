// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy

export default function registerInstancedMaterialModifier(AFRAME) {
  // NB: this is an experimental stub
  const LISTENER_OPTS = { once: true }
  AFRAME.registerComponent('instanced-material-modifier', {
    dependencies: ['instanced-gltf-material'],

    schema: {
      side: { type: 'int', default: -1 },
      castShadows: { type: 'string', default: '' },
    },

    init() {
      this.applyMaterialProperties = this.applyMaterialProperties.bind(this)
      if (!this.el.hasModelLoaded) {
        this.el.addEventListener('model-loaded', this.applyMaterialProperties, LISTENER_OPTS)
      } else {
        this.applyMaterialProperties()
      }
    },

    remove() {
      this.el.removeEventListener('model-loaded', this.applyMaterialProperties, LISTENER_OPTS)
    },

    applyMaterialProperties() {
      const o3d = this.el.object3D

      const multimeshInstances = new Set()

      o3d.traverse(obj => {
        if (obj.isMesh && ('multiMeshID' in obj.userData)) {
          multimeshInstances.add(obj.userData.multiMeshID)
        }
      })

      const mm = Array.from(multimeshInstances)
      if (!mm.length) {
        return console.error('instanced-material-modifier: found no multimesh?', o3d)
      }

      let multiMeshID
      const sys = this.el.components['instanced-gltf-model'].system
      while (multiMeshID = mm.pop()) {  // eslint-disable-line no-cond-assign
        const multiMesh = sys.multiMeshes[multiMeshID]
        const mat = multiMesh.material
        if (this.data.side > -1) mat.side = this.data.side
        if (this.data.castShadows) mat.castShadows = (this.data.castShadows.toLowerCase() === 'true')
        // NB: receiveShadows costs a draw call at this time, use cached-gltf-model instead
        mat.needsUpdate = true
      }
    }
  })
}
