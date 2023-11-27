var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user.uid;
            saveToiletDocID();
            const toiletDocID = localStorage.getItem("toiletDocID");
            checkFavourited(toiletDocID);
        } else {
            window.location.href = "login.html";
        }
    });
}
doAll();

//On loading the page check if the toilet is favourited and update the button accordingly
function checkFavourited(toiletDocID) {
    const toiletButton = document.getElementById("favourite-button");

    db.collection("favourites")
        .where("user", "==", currentUser)
        .where("toiletID", "==", toiletDocID)
        .get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                toiletButton.classList.add("favourited");
            } else {
                toiletButton.classList.remove("favourited");
            }
        });
}

//This will toggle the favourites button and add and delete from Firestore
document.getElementById("favourite-button").addEventListener("click", function () {

        const toiletDocID = localStorage.getItem("toiletDocID");

        this.classList.toggle("favourited");

        if (this.classList.contains("favourited")) {
            // Add the toilet to favourites
            db.collection("favourites").add({
                user: currentUser,
                toiletID: toiletDocID
            });
        } else {
            // Remove the toilet from favourites
            db.collection("favourites")
                .where("user", "==", currentUser)
                .where("toiletID", "==", toiletDocID)
                .get()
                .then(querySnapshot => {
                    if (!querySnapshot.empty) {
                    const favID = querySnapshot.docs[0].id;
                    db.collection("favourites").doc(favID).delete();
            }
        })
    } 
});

// Function to save toiletDocID
function saveToiletDocID() {
    try {
        let params = new URL(window.location.href);
        let ID = params.searchParams.get("docID");
        localStorage.setItem('toiletDocID', ID);
    } catch (error) {
        console.error("Error saving toiletDocID:", error);
    }
}
