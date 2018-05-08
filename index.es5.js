'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var geoViewport = require('@mapbox/geo-viewport');
var createCluster = require('supercluster');
var initialData = require('./data.json');
var fs = require('fs');

var data = initialData.map(function (_ref) {
    var X = _ref.X,
        Y = _ref.Y,
        GLOBALID = _ref.GLOBALID,
        rest = _objectWithoutProperties(_ref, ['X', 'Y', 'GLOBALID']);

    var id = parseInt(GLOBALID, 10);
    var latitude = parseFloat(X);
    var longitude = parseFloat(Y);
    return {
        type: 'Feature',
        id: id,
        geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        properties: {
            point_count: 0, item: rest
        }
    };
});

var DIMENSIONS = [600, 400];
var viewport = [55.8352157, 37.6424593];
var zoom = 9;

var MIN_ZOOM = 1;
var MAX_ZOOM = 20;

var cluster = createCluster({
    log: true,
    radius: 100,
    maxZoom: MAX_ZOOM,
    minZoom: MIN_ZOOM,
    extent: 512
});

cluster.load(data);

var bbox = geoViewport.bounds(viewport, zoom, DIMENSIONS);
console.log(bbox);
var clusters = cluster.getClusters(bbox, zoom);

fs.writeFile('clusters.json', JSON.stringify(clusters, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved!');
});
