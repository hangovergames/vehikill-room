// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy

export const RenderLayers =
{
    // renderable stuff
    DEFAULT: 0,

    // non-renderable stuff
    AUDIO_POOL: 2,

    // Putting the grabbable gltf scene objects in their own layer so they don't take up any processing power while
    // rendering, as this is purely handled by the MultiMesh objects
    GRABBABLE_GLTF_SCENE: 10
};
