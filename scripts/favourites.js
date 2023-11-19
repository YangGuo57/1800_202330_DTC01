// Favourited toilets show up in favourites page
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("fav-card-template");
    const userUid = localStorage.getItem("userID");

    db.collection("favourites").where("user", "==", userUid).get()
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
                            remove(toiletID);
                        });

                        document.getElementById(collection + "-go-here").appendChild(newcard);
                    })
            })
        })
}

displayCardsDynamically("favourites");

// This will delete from Firestore
function remove(toiletID) {
    const currentUser = firebase.auth().currentUser.uid;
    console.log(toiletID);

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
