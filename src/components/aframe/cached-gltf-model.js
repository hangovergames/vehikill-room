// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy

/* global AFRAME */
/**
 * cached glTF model loader.
 */
export default AFRAME.registerComponent('cached-gltf-model', {
  schema: { type: 'model' },

  init: function () {
    this.model = null
    this.el.hasModelLoaded = false
    this.loader = new window.THREE.GLTFLoader()
  },

  update: function () {
    const src = this.data

    if (!src) { return }

    this.el.hasModelLoaded = false

    this.remove()

    this.system.getOrLoadModel(
      src,
      (model) => {
        this.model = model
        this.el.hasModelLoaded = true
        this.el.setObject3D('mesh', this.model)
        this.el.emit('model-loaded', { format: 'gltf', model: this.model })
      },
      (error) => {
        this.el.emit('model-error', { format: 'gltf', src })
      }
    )
  },

  remove: function () {
    if (!this.model) { return }
    this.el.removeObject3D('mesh')
    this.system.unuseModel(this.data)
    this.model = null
    this.el.hasModelLoaded = false
  }
})
