mapboxgl.accessToken = mapboxConfig.accessToken;
const defaultCenter = [-123.11499773770726, 49.28378165988785];

let map;
let directionsControl;
let desiredDestination = null;

function createMyLocationControl() {
  const control = {
    onAdd: function (map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mapbox-control-container';
      this._button = document.createElement('button');
      this._button.innerHTML = "my_location";
      this._button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-my-location material-icons';
      this._button.type = 'button';
      this._button.onclick = () => setUserLocation();
      this._container.appendChild(this._button);
      return this._container;
    },
    onRemove: function () {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  };
  return control;
}

function setUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      map.flyTo({ center: userLocation, zoom: 15 });
      new mapboxgl.Marker({ color: '#FF8C00' }).setLngLat(userLocation).addTo(map);
      directionsControl.setOrigin(userLocation);
    }, function (error) {
      console.error('Error occurred while retrieving location:', error);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

function createDirectionsControl() {
  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/walking',
    controls: { inputs: false, instructions: false, profileSwitcher: false }
  });

  directions.on('load', function() {
    console.log('Directions control loaded');
  });

  return directions;
}

function initializeMap(center) {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: center,
    zoom: 15
  });

  map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl }));
  map.addControl(createMyLocationControl(), 'top-right');
  
  directionsControl = createDirectionsControl();
  map.addControl(directionsControl, 'top-left');

  map.on('load', () => {
    loadToiletMarkers();
     if ('geolocation' in navigator) {
      setUserLocation(); // Set user location on map load
    }
  });
}

function loadToiletMarkers() {
  db.collection("toilets").get().then(allToilets => {
    allToilets.forEach(doc => {
      const { lon, lat, name: title, geo_local_area: location, wheel_access: disability } = doc.data();
      let markerLocation = [lon, lat];
      new mapboxgl.Marker().setLngLat(markerLocation).addTo(map).setPopup(createPopup(doc.id, title, location, disability, lon, lat));
    });
  });
}

function createPopup(docID, title, location, disability, lon, lat) {
  const popupContent = `
    <div class = "popup">
      <strong class="popup-title">${title}</strong><br>
      Location: ${location}
    </div>
    <div class="popup-buttons">
      <button class="disability-button"><span class="material-icons disability">${disability === "Yes" ? 'accessible' : 'not_accessible'}</span></button>
      <button class="more-info-button"><a href="toilet.html?docID=${docID}" target="_blank"><span class="material-icons">more_horiz</span></a></button>
      <button class="navigate-button" data-lon="${lon}" data-lat="${lat}"><span class="material-icons">directions</span></button>
    </div>
  `;
  return new mapboxgl.Popup().setHTML(popupContent);
}

document.addEventListener('click', function(event) {
  const navButton = event.target.closest('.navigate-button');
  if (navButton) {
    event.stopPropagation();
    event.preventDefault();


    const lon = parseFloat(navButton.getAttribute('data-lon'));
    const lat = parseFloat(navButton.getAttribute('data-lat'));
    desiredDestination = [lon, lat];

    if (directionsControl) {
      directionsControl.setDestination(desiredDestination);
    }
  }
});

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    position => initializeMap([position.coords.longitude, position.coords.latitude]),
    error => {
      console.error('Error occurred while retrieving location:', error);
      initializeMap(defaultCenter);
    }
  );
} else {
  console.log('Geolocation is not supported by this browser.');
  initializeMap(defaultCenter);
}
