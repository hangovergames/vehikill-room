// Copyright (c) 2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.

/* global AFRAME */
/**
 * instanced glTF model loader.
 */
export default AFRAME.registerComponent('instanced-gltf-model', {
  schema: { type: 'model' },

  init: function () {
    this.model = null
    this.el.hasModelLoaded = false
  },

  update: function () {
    const src = this.data

    if (!src) return
    if (this.model) return // already loaded

    this.el.hasModelLoaded = false

    this.system.getOrLoadModel(
      this,
      src,
      (model) => {
        this.model = model
        this.el.hasModelLoaded = true
        this.el.setObject3D('mesh', this.model)
        this.el.emit('model-loaded', { format: 'gltf', model: this.model })
      },
      (error) => {
        console.error(`Error loading model ${src}`, error)
        this.el.emit('model-error', { format: 'gltf', src: src })
        this.el.hasModelLoaded = false
      }
    )
  },

  remove: function () {
    this.removed = true
    if (!this.model) { return }
    this.system.unuseModel(this.model, this.data)
    this.model = null
    this.el.removeObject3D('mesh')
    this.el.hasModelLoaded = false
  }
})
