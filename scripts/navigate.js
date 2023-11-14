mapboxgl.accessToken = mapboxConfig.accessToken;

let toiletID = localStorage.getItem("toiletId");

db.collection("toilets")
    .doc(toiletID)
    .get()
    .then(doc => {
        // var docID = doc.id;
        var lon = doc.data().lon;
        var lat = doc.data().lat;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lon, lat],
            zoom: 15
        });
    });



map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

map.on('load', function () {
    let toiletID = localStorage.getItem("toiletId");

    db.collection("toilets")
        .doc(toiletID)
        .get()
        .then(doc => {
                // var docID = doc.id;
                var lon = doc.data().lon;
                var lat = doc.data().lat;
                // var title = doc.data().name;
                // var location = doc.data().geo_local_area;
                // var disability = doc.data().wheel_access;

                let markerLocation = [lon, lat];

                let marker = new mapboxgl.Marker()
                    .setLngLat(markerLocation)
                    .addTo(map);

                marker.getElement().addEventListener('click', () => {
                    popup.addTo(map);
                });
            });
        });
