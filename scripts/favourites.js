// When in a toilet card or toilet page, clicking the heart icon will add to user's favourites if the user is logged in
// If the user is not logged in, a pop up will appear asking the user to log in




// When in the user's favourites page, clicking the heart icon will remove from user's favourites 



// Toilet cards have to show up in list as favourited if they are in the user's favourites


//Favourited toilets show up in favourtes page

var toiletDocID = localStorage.getItem("toiletDocID");

document.getElementById("favourite-button").addEventListener("click", function () {
    db.collection("toilets").get()
    var currentURL = window.location.href;
    var urlParams = new URLSearchParams(currentURL);
    var docID = urlParams.get("docID");

    console.log(docID); 

    this.classList.toggle("favourited");


    if (this.classList.contains("favourited")) {
        db.collection("favourites").add({
            user: firebase.auth().currentUser.uid,
            favourites: docID
        });
    } else {
        db.collection("favourites").where("favourites", "array-contains", docID).get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var updatedFavorites = doc.data().favorites.filter(favourite => favourite !== docID);
                    db.collection("favourites").doc(doc.id).update({
                        favorites: updatedFavorites
                    });
                });
            })
            .catch(function (error) {
                console.error("Error removing favourite: ", error);
            });
    }
});

