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

map.on('load', function () {
  db.collection("toilets").get()
    .then(allToilets => {
      allToilets.forEach(doc => {
        var docID = doc.id;
        var lon = doc.data().lon;
        var lat = doc.data().lat;
        var title = doc.data().name;
        var location = doc.data().geo_local_area;
        var disability = doc.data().wheel_access;

        let markerLocation = [lon, lat];

        let marker = new mapboxgl.Marker()
          .setLngLat(markerLocation)
          .addTo(map);

        const popup = new mapboxgl.Popup()
          .setHTML(`
          <div class = "popup">
            <strong class="popup-title">${title}</strong><br>
            Location: ${location}<br>
            Wheelchair Access: ${disability}
          </div>
          <button class="more-info-button"><a href="toilet.html?docID=${docID}">More Info</a></button>
          `);

        marker.setPopup(popup)

        marker.getElement().addEventListener('click', () => {
          popup.addTo(map);
        });
      });
    });
});
