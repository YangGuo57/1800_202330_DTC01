mapboxgl.accessToken = mapboxConfig.accessToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-123.11499773770726, 49.28378165988785],
  zoom: 15
});

map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
  })
  );


const markerLocation = [-123.11499773770726, 49.28378165988785];


const marker = new mapboxgl.Marker()
  .setLngLat(markerLocation)
  .addTo(map);