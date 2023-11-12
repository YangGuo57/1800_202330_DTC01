document.addEventListener("DOMContentLoaded", () => {
    saveToiletDocID();
});

function saveToiletDocID() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    localStorage.setItem('toiletDocID', ID);
}

//check if toilet in favourites
document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = firebase.auth().currentUser;
    const toiletDocID = localStorage.getItem("toiletDocID");

    if (currentUser) {
        const userUid = currentUser.uid;

        // check Firestore to check if the current toilet is favourited by the user
        const toiletButton = document.getElementById("favourite-button");
        const querySnapshot = await db.collection("favourites")
        console.log(querySnapshot);
            .where("toiletID", "==", toiletDocID)
            .where("user", "==", userUid)
            .get();

        // Check if a matching entry is found and update the button accordingly
        if (!querySnapshot.empty) {
            console.log("toilet is favourited");
            toiletButton.classList.add("favourited");
        } else {
            console.log("toilet is not favourited");
            toiletButton.classList.remove("favourited");
        }
    }
});


document.getElementById("favourite-button").addEventListener("click", async function () {
    db.collection("toilets").get()
    const toiletButton = document.getElementById("favourite-button");
    const toiletDocID = localStorage.getItem("toiletDocID");

    this.classList.toggle("favourited");

    if (this.classList.contains("favourited")) {
        db.collection("favourites").add({
            user: firebase.auth().currentUser.uid,
            toiletID: toiletDocID
        });
    }
    else {
        const currentUser = firebase.auth().currentUser;
        const userUid = currentUser.uid;

        // Query Firestore to find the specific entry
        const querySnapshot = await db
            .collection("favourites")
            .where("user", "==", userUid)
            .where("toiletID", "==", toiletDocID)
            .get();

        // Check if there is a matching entry
        if (!querySnapshot.empty) {
            // If a matching entry is found, delete it
            const docId = querySnapshot.docs[0].id;
            await db.collection("favourites").doc(docId).delete();
        }

        // Remove the "favourited" class from the button
        toiletButton.classList.remove("favourited");
    };
});
