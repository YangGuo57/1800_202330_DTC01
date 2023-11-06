// Run setup() in console to add toilets to database from an API
// DO NOT RUN THIS MORE THAN ONCE
// I already added all 106 public toilets in Vancouver to the database

function add_toilets(toilets) {
    var toiletsRef = db.collection("toilets");
    for (i = 0; i < toilets.results.length; i++) {
        toiletsRef.add({ //add to database, autogen ID
            name: toilets.results[i].name,
            address: toilets.results[i].address,
            type: toilets.results[i].type,
            location: toilets.results[i].location,
            summer_hours: toilets.results[i].summer_hours,
            winter_hours: toilets.results[i].winter_hours,
            wheel_access: toilets.results[i].wheel_access,
            geo_local_area: toilets.results[i].geo_local_area,
            lon: toilets.results[i].geo_point_2d.lon,
            lat: toilets.results[i].geo_point_2d.lat,
            // last_updated: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
}

function setup() {
    console.log("...");
    jQuery.ajax({
        type: "get",
        url: "api_url_goes_here",
        success: add_toilets
    });
}
