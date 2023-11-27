mapboxgl.accessToken = mapboxConfig.accessToken;
const defaultCenter = [-123.11499773770726, 49.28378165988785];

function createMyLocationControl() {
  return {
    onAdd: function (map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mapbox-control-container';

      this._button = document.createElement('button');
      this._button.innerHTML = "my_location"
      this._button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-my-location material-icons';
      this._button.type = 'button';

      this._button.onclick = function () {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function (position) {
            const userLocation = [position.coords.longitude, position.coords.latitude];
            directionsControl.setOrigin(userLocation);
          map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15
            });
          }, function (error) {
            console.error('Error occurred while retrieving location:', error);
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      };

      this._container.appendChild(this._button);

      return this._container;
    },

    onRemove: function () {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  };
}

function createDirectionsControl() {
  return new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/walking',
    controls: {}
  });
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
          if (disability == "Yes") { disability = '<span class="material-icons disability">accessible</span>' }
          else if (disability == "No") { disability = '<span class="material-icons disability">not_accessible</span>' }

          let markerLocation = [lon, lat];

          let marker = new mapboxgl.Marker()
            .setLngLat(markerLocation)
            .addTo(map);
          
          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent further event propagation
            directionsControl.setDestination(markerLocation);
          });

          const popup = new mapboxgl.Popup()
            .setHTML(`
              <div class = "popup">
                <strong class="popup-title">${title}</strong><br>
                Location: ${location}
              </div>
              <div class="popup-buttons">
              
              <button class="disability-button"><span class="material-icons">${disability}</span></button>
                <button class="more-info-button"><a href="toilet.html?docID=${docID}"><span class="material-icons">more_horiz</span></a></button>
                <button class="navigate-button"><a href="navigate.html?docID=${docID}"><span class="material-icons">directions</span></a></button>
              </div>
            `);

          marker.setPopup(popup);

          marker.getElement().addEventListener('click', () => {
            popup.addTo(map);
          });
        });

        // Check if the Geolocation API is available
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function (position) {
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

          }, function (error) {
            console.error('Error occurred while retrieving location: ', error);
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      });
  });

  var directionsControl = createDirectionsControl();
  map.addControl(directionsControl, 'top-left');

  if (setUserLocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      directionsControl.setOrigin(userLocation);
      map.flyTo({ center: userLocation, zoom: 15 });
    }, function (error) {
      console.error('Error occurred while retrieving location:', error);
    });
  }
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    initializeMap([position.coords.longitude, position.coords.latitude], true);
  }, function (error) {
    console.error('Error occurred while retrieving location:', error);
    initializeMap(defaultCenter);
  });
} else {
  console.log('Geolocation is not supported by this browser.');
  initializeMap(defaultCenter);
}