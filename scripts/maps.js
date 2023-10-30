let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 49.246292, lng: -123.116226 },
    zoom: 8,
  });
}

initMap();