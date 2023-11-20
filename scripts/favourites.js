function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            insertNameFromFirestore(user);
            displayCardsDynamically(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

// This will insert the user's name into the page
function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        userName = userDoc.data().name;
        document.getElementById("name-goes-here").innerHTML = userName + "'s Favourite Toilets";
    })

}

// Favourited toilets show up in favourites page
function displayCardsDynamically(user) {
    let cardTemplate = document.getElementById("fav-card-template");
    currentUser = user.uid;
    console.log(currentUser);
    db.collection("favourites").where("user", "==", currentUser).get()
        .then(favouritesSnapshot => {
            favouritesSnapshot.forEach(favDoc => {
                var toiletID = favDoc.data().toiletID;
                db.collection("toilets").doc(toiletID).get()
                    .then(toiletDoc => {
                        var title = toiletDoc.data().name;
                        var location = toiletDoc.data().geo_local_area;
                        var disability = toiletDoc.data().wheel_access;
                        var toiletWinter = toiletDoc.data().winter_hours;
                        localStorage.setItem('toiletId', toiletID);

                        let newcard = cardTemplate.content.cloneNode(true);

                        //update title and text and image
                        newcard.querySelector('#toiletName').innerHTML = title;
                        newcard.querySelector('#location').innerHTML = "Location: " + location;
                        newcard.querySelector('#hours').innerHTML = "Hours: " + toiletWinter;
                        newcard.querySelector('#disability').innerHTML = "Wheelchair Access: " + disability;
                        newcard.querySelector('#more-info').href = "toilet.html?docID=" + toiletID;
                        const favouriteButton = newcard.querySelector('#favourite-button');
                        favouriteButton.classList.toggle("favourited");
                        favouriteButton.addEventListener('click', function () {
                            remove(toiletID, currentUser);
                        });

                        document.getElementById("favourites" + "-go-here").appendChild(newcard);
                    })
            })
        })
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
