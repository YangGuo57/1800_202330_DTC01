var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        console.log("Auth state changed");
        if (user) {
            currentUser = user.uid;
            navigator.geolocation.getCurrentPosition(position => {
                console.log("Geolocation success");
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                displayCardsDynamically("toilets", userLocation);
            }, () => {
                console.log("Error getting location");
                displayCardsDynamically("toilets");
            });
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

//Shows a list view of all toilets
function displayCardsDynamically(collection, userLocation = null) {
    let cardTemplate = document.getElementById("toiletCardTemplate");
    let toilets = [];

    db.collection(collection).get()
        .then(allToilets => {
            allToilets.forEach(doc => {
                let toilet = {
                    docID: doc.id,
                    title: doc.data().name,
                    location: doc.data().geo_local_area,
                    disability: doc.data().wheel_access,
                    distance: userLocation ? calculateDistance(userLocation, doc.data().lat, doc.data().lon) : null
                };
                toilets.push(toilet);
                console.log(toilet.distance);
            });

            if (userLocation) {
                toilets = toilets.sort((a, b) => a.distance - b.distance).slice(0, 10);

            }

            //create toilet cards
            toilets.forEach(toilet => {
                let newcard = cardTemplate.content.cloneNode(true);
                if (toilet.disability == "Yes") {disability = '<span class="material-symbols-outlined">accessible</span>'}
                else if (toilet.disability == "No") {disability = '<span class="material-symbols-outlined">not_accessible</span>'}

                newcard.querySelector('.card-title').innerHTML = toilet.title;
                newcard.querySelector('.card-location').innerHTML = toilet.location;
                newcard.querySelector('.card-accessibility').innerHTML = disability;
                newcard.querySelector('.card-distance').innerHTML = userLocation ? toilet.distance.toFixed(2) + " km away" : "";
                newcard.querySelector('a').href = "toilet.html?docID=" + toilet.docID;

                newcard.querySelector('button').id = 'favourite-' + toilet.docID;
                newcard.querySelector('button').onclick = () => updateFavourite(toilet.docID);
                console.log(toilet.docID)
                db.collection("favourites")
                    .where("user", "==", currentUser)
                    .where("toiletID", "==", toilet.docID)
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            console.log("toilet is favourited");
                            document.getElementById('favourite-' + toilet.docID).classList.add("favourited");
                        } else {
                            console.log("toilet is not favourited");
                        }
                    });
                document.getElementById(collection + "-go-here").appendChild(newcard);
            });
        })
        .catch(error => {
            console.error("Error fetching documents: ", error);
        });
}

function calculateDistance(userLocation, lat, lon) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat - userLocation.latitude);
    const dLon = degreesToRadians(lon - userLocation.longitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(userLocation.latitude)) * Math.cos(degreesToRadians(lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


//This will toggle the favourites button and add and delete from Firestore
function updateFavourite(docID) {
    const buttonID = document.getElementById('favourite-' + docID)
    console.log(buttonID);
    buttonID.classList.toggle("favourited");

    if (buttonID.classList.contains("favourited")) {
        // Add the toilet to favourites
        console.log("adding to favourites");
        db.collection("favourites").add({
            user: currentUser,
            toiletID: docID
        });
    } else {
        // Remove the toilet from favourites
        console.log("removing from favourites");
        db.collection("favourites")
            .where("user", "==", currentUser)
            .where("toiletID", "==", docID)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const favID = querySnapshot.docs[0].id;
                    db.collection("favourites").doc(favID).delete();
                }
            })
    }
}
