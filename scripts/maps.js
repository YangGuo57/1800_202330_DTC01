mapboxgl.accessToken = mapboxConfig.accessToken;
const defaultCenter = [-123.11499773770726, 49.28378165988785];

function createMyLocationControl() {
  return {
    onAdd: function(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mapbox-control-container';

      this._button = document.createElement('button');
      this._button.innerHTML = "my_location"
      this._button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-my-location material-icons';
      this._button.type = 'button';

      this._button.onclick = function() {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15
            });
          }, function(error) {
            console.error('Error occurred while retrieving location:', error);
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      };

      this._container.appendChild(this._button);

      return this._container;
    },

    onRemove: function() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  };
}


function initializeMap(center) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: center,
    zoom: 15
  });

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })
  );


  var myLocationControl = createMyLocationControl();
  map.addControl(myLocationControl, 'top-right');

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

          marker.setPopup(popup);

          marker.getElement().addEventListener('click', () => {
            popup.addTo(map);
          });
        });

        // Check if the Geolocation API is available
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            // Get user's current position
            const userLocation = [position.coords.longitude, position.coords.latitude];

            // Add a marker to the map at the user's location
            new mapboxgl.Marker({ color: '#04364A' }) // You can customize the marker color or style
              .setLngLat(userLocation)
              .addTo(map);

            map.flyTo({
              center: userLocation,
              zoom: 15
            });

          }, function(error) {
            console.error('Error occurred while retrieving location: ', error);
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      });
  });
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    initializeMap([position.coords.longitude, position.coords.latitude]);
  }, function(error) {
    console.error('Error occurred while retrieving location:', error);
    initializeMap(defaultCenter);
  });
} else {
  console.log('Geolocation is not supported by this browser.');
  initializeMap(defaultCenter);
}