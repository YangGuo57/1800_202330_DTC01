var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user.uid;
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                insertNameFromFirestore(currentUser);
                displayCardsDynamically(currentUser, userLocation);
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

// This will insert the user's name into the page
function insertNameFromFirestore(currentUser) {
    db.collection("users").doc(currentUser).get().then(userDoc => {
        userName = userDoc.data().name;
        document.getElementById("name-goes-here").innerHTML = `<h1> ${userName}'s Favourites</h1>`;
    })

}

// Favourited toilets show up in favourites page by distance
async function displayCardsDynamically(currentUser, userLocation = null) {
    try {
        const cardTemplate = document.getElementById("favCardTemplate");
        const favouritesSnapshot = await db.collection("favourites").where("user", "==", currentUser).get();
        const toilets = [];

        for (const favDoc of favouritesSnapshot.docs) {
            const toiletID = favDoc.data().toiletID;
            localStorage.setItem('toiletId', toiletID);
            const toiletDoc = await db.collection("toilets").doc(toiletID).get();

            const toilet = {
                title: toiletDoc.data().name,
                location: toiletDoc.data().geo_local_area,
                disability: toiletDoc.data().wheel_access,
                distance: userLocation ? calculateDistance(userLocation, toiletDoc.data().lat, toiletDoc.data().lon) : null
            };
            toilets.push(toilet);
        }

        if (userLocation) {
            toilets.sort((a, b) => a.distance - b.distance);
        }

        for (const toilet of toilets) {
            toiletID = toilet.docID;
            const newcard = cardTemplate.content.cloneNode(true);

            if (toilet.disability == "Yes") { toilet.disability = '<span class="material-symbols-outlined">accessible</span>' }
            else if (toilet.disability == "No") { toilet.disability = '<span class="material-symbols-outlined">not_accessible</span>' }

            newcard.querySelector('.card-title').innerHTML = toilet.title;
            newcard.querySelector('.card-location').innerHTML = toilet.location;
            newcard.querySelector('.card-accessibility').innerHTML = toilet.disability;
            newcard.querySelector('.card-distance').innerHTML = userLocation ? toilet.distance.toFixed(2) + " km away" : "";
            newcard.querySelector('#more-info').href = "toilet.html?docID=" + toiletID;
            const favouriteButton = newcard.querySelector('#favourite-button'); 
            favouriteButton.classList.toggle("favourited");
            favouriteButton.addEventListener('click', function () {
                remove(toiletID, currentUser);
            });

            document.getElementById("favourites" + "-go-here").appendChild(newcard);
        }
    } catch (error) {
        console.error("Error fetching and displaying toilets:", error);
    }
}

// This will delete from Firestore
function remove(toiletID, currentUser) {
    db.collection("favourites").where("user", "==", currentUser).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                db.collection("favourites").where("toiletID", "==", toiletID).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            db.collection("favourites").doc(doc.id).delete()
                                .then(() => {
                                    document.getElementById("favourite-button").classList.remove("favourited");
                                    location.reload();
                                })
                        })
                    })
            })
        })
};

//calculates distance between user and toilet
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
