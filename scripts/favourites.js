// When in a toilet card or toilet page, clicking the heart icon will add to user's favourites if the user is logged in
// If the user is not logged in, a pop up will appear asking the user to log in




// When in the user's favourites page, clicking the heart icon will remove from user's favourites 



// Toilet cards have to show up in list as favourited if they are in the user's favourites


// Toggle the "favorited" state when the button is clicked
// document.getElementById("favorite-button").addEventListener("click", function () {
//     var docID = doc.id;
//     this.classList.toggle("favorited");
//     if (docID not in db.collection("users")) {
//     db.collection("users").add({
//         favourites: docID
//     });
// }
// });


// document.getElementById("favorite-button").addEventListener("click", function () {
//     var docID = doc.id;
//     this.classList.toggle("favorited");
//     if document.getElementById("favorite-button") has class "favorited":
//         db.collection("users").add({
//             favourites: docID
//         });
//     else:
//     db.collection("users").remove({
//             favourites: docID
//         })

// });

document.getElementById("favorite-button").addEventListener("click", function () {
    db.collection("toilets").get()
    var docID = doc.id
    this.classList.toggle("favorited"); // Toggle the 'favorited' class on the button

    // Check if the button has the "favorited" class
    if (this.classList.contains("favorited")) {
        db.collection("users").add({
            favorites: [docID] 
        });
    } else {
        db.collection("users").where("favorites", "array-contains", docID).get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var updatedFavorites = doc.data().favorites.filter(favorite => favorite !== docID);
                    db.collection("users").doc(doc.id).update({
                        favorites: updatedFavorites
                    });
                });
            })
            .catch(function (error) {
                console.error("Error removing favorite: ", error);
            });
    }
});

