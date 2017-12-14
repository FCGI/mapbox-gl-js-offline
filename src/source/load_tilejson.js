// @flow

const util = require('../util/util');
const ajax = require('../util/ajax');
const browser = require('../util/browser');
const normalizeURL = require('../util/mapbox').normalizeSourceURL;

import type {RequestTransformFunction} from '../ui/map';
import type {Callback} from '../types/callback';
import type {TileJSON} from '../types/tilejson';

module.exports = function(options: any, requestTransformFn: RequestTransformFunction, callback: Callback<TileJSON>) {
    const loaded = function(err, tileJSON: any) {
        if (err) {
            return callback(err);
        } else if (tileJSON) {
            const result: any = util.pick(tileJSON, ['tiles', 'minzoom', 'maxzoom', 'attribution', 'mapbox_logo', 'bounds']);

            if (tileJSON.vector_layers) {
                result.vectorLayers = tileJSON.vector_layers;
                result.vectorLayerIds = result.vectorLayers.map((layer) => { return layer.id; });
            }

            callback(null, result);
        }
    };

    if (options.url) {
        //fc-offline-start
        if(options.attribution){
            console.log(options);
            loaded(null, options.attribution);
        }else{
        //fc-offline-end
            ajax.getJSON(requestTransformFn(normalizeURL(options.url), ajax.ResourceType.Source), loaded);
        //fc-offline-start
        }
        //fc-offline-end
    } else {
        browser.frame(() => loaded(null, options));
    }
};
