// mapboxgl.accessToken = mapboxConfig.accessToken;

// // Initialize your map at a default center
// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v12',
//     center: defaultCenter, // You should define this somewhere if you haven't already
//     zoom: 15
// });

// // Add geocoder control to the map
// map.addControl(
//     new MapboxGeocoder({
//         accessToken: mapboxgl.accessToken,
//         mapboxgl: mapboxgl
//     })
// );

// // Load event for the map
// map.on('load', function () {
//     // Retrieve the toilet ID from local storage
//     let toiletID = localStorage.getItem("toiletId");

//     // Fetch the toilet data from the database
//     db.collection("toilets")
//         .doc(toiletID)
//         .get()
//         .then(doc => {
//             var lon = doc.data().lon;
//             var lat = doc.data().lat;

//             // Set the map center to the toilet location
//             map.flyTo({
//                 center: [lon, lat],
//                 zoom: 15
//             });

//             // Add marker at the toilet location
//             new mapboxgl.Marker()
//                 .setLngLat([lon, lat])
//                 .addTo(map);
//         })
//         .catch(error => {
//             console.error("Error getting toilet location:", error);
//         });
// });
