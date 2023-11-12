// When in a toilet card or toilet page, clicking the heart icon will add to user's favourites if the user is logged in
// If the user is not logged in, a pop up will appear asking the user to log in




// When in the user's favourites page, clicking the heart icon will remove from user's favourites 



// Toilet cards have to show up in list as favourited if they are in the user's favourites


//Favourited toilets show up in favourtes page

// function displayCardsDynamically(collection) {
//     let cardTemplate = document.getElementById("fav-card-template"); 
//     db.collection("favourites").get()
//         .then(allFavourites => {
//             allFavourites.forEach(doc => { 
//                 var title = doc.data().name;
//                 var location = doc.data().geo_local_area;
//                 var disability = doc.data().wheel_access;
//                 var toiletWinter = doc.data().winter_hours;
//                 var docID = doc.id;
//                 let newcard = cardTemplate.content.cloneNode(true); 

//                 //update title and text and image
//                 newcard.querySelector('#ToiletName').innerHTML = title;
//                 newcard.querySelector('#location').innerHTML = "Location: " + location;
//                 newcard.querySelector('#hours').innerHTML = "Hours: " + toiletWinter;
//                 newcard.querySelector('#disability').innerHTML = "Wheelchair Access: " + disability;

//                 document.getElementById(collection + "-go-here").appendChild(newcard);
//             })
//         })
// }
// displayCardsDynamically("favourites"); 

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("fav-card-template"); 
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
        const userUid = currentUser.uid;

        // Query Firestore to get favorites for the specific user
        db.collection("favourites")
            .where("user", "==", userUid)
            .get()
            .then(allFavourites => {
                allFavourites.forEach(doc => { 
                    var title = doc.data().name;
                    var location = doc.data().geo_local_area;
                    var disability = doc.data().wheel_access;
                    var toiletWinter = doc.data().winter_hours;
                    var docID = doc.id;
                    let newcard = cardTemplate.content.cloneNode(true); 

                    // Update title and text and image
                    newcard.querySelector('#ToiletName').innerHTML = title;
                    newcard.querySelector('#location').innerHTML = "Location: " + location;
                    newcard.querySelector('#hours').innerHTML = "Hours: " + toiletWinter;
                    newcard.querySelector('#disability').innerHTML = "Wheelchair Access: " + disability;

                    document.getElementById(collection + "-go-here").appendChild(newcard);
                });
            })
            .catch(error => {
                console.error("Error getting favorites:", error);
            });
    } else {
        console.log("User not logged in.");
    }
}

displayCardsDynamically("favourites");


