// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy

export default class AssetCache
{
    constructor(loaderType)
    {
        this._loaderType = loaderType;
        this.cache = {};
        this.cacheCount = {};
        this.loadRequested = {};

        // an optional method to change the loaded asset before it goes in the cache
        this.processLoaded = null;

        // an optional method that is called when an asset is removed from the cache
        this.processDestroyed = null;

        this._responseType = null;
    }

    setResponseType(value)
    {
        this._responseType = value;
    }

    clear()
    {
        this.cache = {};
        this.cacheCount = {};
        this.loadRequested = {};
    }

    freeUsage(src)
    {
        if (!this.cache[src]) { return; }
        this._decrementCacheCount(src);
    }

    getOrLoad(src, onLoaded, onFail)
    {
        var cache = this.cache;
        var cachedAsset = cache[src];

        this._incrementCacheCount(src);

        if (cachedAsset) {
            // This was changed from a window.nextTick call to
            // Promise.resolve.then to allow loading to happen
            // even when the page is not visible.
            Promise.resolve().then(onLoaded.bind(undefined, cachedAsset));
            return;
        }

        // check if a load is already requested
        var isLoading = !!this.loadRequested[src];

        if (!isLoading)
            this.loadRequested[src] = [];

        this.loadRequested[src].push({onLoaded: onLoaded, onFail: onFail});

        if (!isLoading)
            this._load(src);
    }

    _load(src) {
        var cache = this.cache;
        var self = this;
        var loadRequested = this.loadRequested;
        var loader = new this._loaderType();

        if (this._responseType)
            loader.setResponseType(this._responseType);

        function onLoaded(asset) {
            console.log("Loaded asset " + src)

            if (!loadRequested[src]) return;

            function onProcessComplete(newAsset) {
                cache[src] = newAsset;

                for (var i = 0; i < loadRequested[src].length; ++i) {
                    loadRequested[src][i].onLoaded(newAsset);
                }

                delete loadRequested[src];
            }

            if (self.processLoaded)
                self.processLoaded(asset, onProcessComplete);
            else
                onProcessComplete(asset);
        }

        function onFailed(error) {
          console.error(`Failed to load asset ${src}`)
          if (!loadRequested[src]) return
          for (var i = 0; i < loadRequested[src].length; ++i)
              loadRequested[src][i].onFail(error);
        }

        loader.load(src, onLoaded, undefined /* onProgress */, onFailed);
    }

    _incrementCacheCount(src)
    {
        this.cacheCount[src] = this.cacheCount[src] === undefined ? 1 : this.cacheCount[src] + 1;
    }

    _decrementCacheCount (src)
    {
        var count = --this.cacheCount[src];

        if (count === 0) {
            /*
            console.log("Destroying cached asset " + src)
            // Keep all loaded & processed assets in memory for now,
            // until we have game objects that are short-lived.
            // if (this.processDestroyed) this.processDestroyed(this.cache[src]);
            // delete this.cache[src];
            */
            delete this.loadRequested[src];
            delete this.cacheCount[src];
        }
    }
}
