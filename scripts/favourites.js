function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            insertNameFromFirestore(user);
            displayCardsDynamically(user)
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

// This will insert the user's name into the page
function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        userName = userDoc.data().name;
        document.getElementById("name-goes-here").innerHTML = `<h1> ${userName}'s Favourites</h1>`;
    })

}

// Favourited toilets show up in favourites page
function displayCardsDynamically(user) {
    let cardTemplate = document.getElementById("favCardTemplate");
    const currentUser = user.uid;
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
                        if (disability == "Yes") {disability = '<span class="material-symbols-outlined">accessible</span>'}
                        else if (disability == "No") {disability = '<span class="material-symbols-outlined">not_accessible</span>'}

                        let newcard = cardTemplate.content.cloneNode(true);

                        //update title and text and image
                        newcard.querySelector('.card-title').innerHTML = title;
                        newcard.querySelector('.card-location').innerHTML = location;
                        newcard.querySelector('.card-accessibility').innerHTML = disability;
                        newcard.querySelector('.card-distance').innerHTML = "distance placeholder";
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
