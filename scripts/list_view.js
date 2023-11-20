var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user.uid;
            displayCardsDynamically("toilets");
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

//Shows a list view of all toilets
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("toiletCardTemplate");

    db.collection(collection).get()
        .then(allToilets => {
            allToilets.forEach(doc => {
                var title = doc.data().name;
                var location = doc.data().geo_local_area;
                var disability = doc.data().wheel_access;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-location').innerHTML = "Location: " + location;
                newcard.querySelector('.card-accessibility').innerHTML = "Wheelchair Access: " + disability;
                newcard.querySelector('a').href = "toilet.html?docID=" + docID;

                newcard.querySelector('button').id = 'favourite-' + docID;
                newcard.querySelector('button').onclick = () => updateFavourite(docID);

                //On loading the page check if the toilet is favourited and update the button accordingly
                db.collection("favourites")
                    .where("user", "==", currentUser)
                    .where("toiletID", "==", docID)
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            console.log("toilet is favourited");
                            newcard.querySelector('button').classList.toggle("favourited");
                        } else {
                            console.log("toilet is not favourited");
                        }
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
})}

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
}}
