const geoViewport = require('@mapbox/geo-viewport');
const createCluster = require('supercluster');
const initialData = require('./data.json');
const fs = require('fs');

const data = initialData.map(({ X, Y, GLOBALID, ...rest }) => {
    const id = parseInt(GLOBALID, 10);
    const latitude = parseFloat(X);
    const longitude = parseFloat(Y);
    return ({
        type: 'Feature',
        id,
        geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        properties: {
            cluster: false,
            point_count: 0,
            item: rest
        }
    });
});

const DIMENSIONS = [600, 400];
const viewport = [55.8352157, 37.6424593];
const zoom = 9;

const MIN_ZOOM = 1;
const MAX_ZOOM = 20;

const cluster = createCluster({
    log: true,
    radius: 100,
    maxZoom: MAX_ZOOM,
    minZoom: MIN_ZOOM,
    extent: 512
});

cluster.load(data);

const bbox = geoViewport.bounds(viewport, zoom, DIMENSIONS);
console.log(bbox);
const clusters = cluster.getClusters(bbox, zoom);

fs.writeFile('clusters.json', JSON.stringify(clusters, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved!');
});
