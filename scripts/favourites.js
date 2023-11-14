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
                        newcard.querySelector('#ToiletName').innerHTML = title;
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


// FOR SHOWING TOILET READ MORE INFO FROM FAV PAGE
function displayToiletInfo() {
    let toiletID = localStorage.getItem("toiletId");
    db.collection("toilets")
        .doc(toiletID)
        .get()
        .then(doc => {
            thisToilet = doc.data();
            toiletName = doc.data().name;
            toiletLocation = doc.data().geo_local_area;
            toiletAddress = doc.data().address;
            toiletWheelchair = doc.data().wheel_access;
            toiletSummer = doc.data().summer_hours;
            toiletWinter = doc.data().winter_hours;
            toiletType = doc.data().type;


            document.getElementById("toiletName").innerHTML = toiletName;
            document.getElementById("details-go-here").innerHTML = toiletLocation + "<br>" + toiletAddress + "<br>" + toiletType + "<br>" + "Wheelchair Access: " + toiletWheelchair + "<br>" + "Summer Hours: " + toiletSummer + "<br>" + "Winter Hours: " + toiletWinter;

        });
}
displayToiletInfo();

//This will delete from Firestore
function remove(toiletID) {
    const currentUser = localStorage.getItem("userID");
    console.log(toiletID);

    try {
        db.collection("favourites").where("user", "==", currentUser).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    (db.collection("favourites").where("toiletID", "==", toiletID)).get() 
                    .then (snapshot => {
                        snapshot.forEach(doc => {
                            db.collection("favourites").doc(doc.id).delete();
                            document.getElementById("favourite_button").classList.remove("favourited");
                            location.reload();
                        })
                    })

                });
            });
        } catch (error) {
            console.error("Error removing toilet from favorites:", error);
        }
    }








