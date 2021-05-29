import {ImageType, ModelType, SoundType} from "./Scene";

export const ASSETS_URL : string = '/assets';

export const IMAGE_ASSET_URL = (type: ImageType) : string => `${ASSETS_URL}/images/${type}`;
export const MODEL_ASSET_URL = (type: ModelType) : string => `${ASSETS_URL}/models/${type}`;
export const SOUND_ASSET_URL = (type: SoundType) : string => `${ASSETS_URL}/sounds/${type}`;
