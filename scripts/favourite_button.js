
//On loading the page check if the toilet is favourited and update the button accordingly
document.addEventListener("DOMContentLoaded", async () => {
    saveToiletDocID();
    const userUid = localStorage.getItem("userID");
    const toiletDocID = localStorage.getItem("toiletDocID");
    
    const toiletButton = document.getElementById("favourite-button");

    if (toiletDocID) {
        const querySnapshot = await db.collection("favourites").where("user", "==", userUid).where("toiletID", "==", toiletDocID).get();

        if (!querySnapshot.empty) {
            console.log("toilet is favourited");
            toiletButton.classList.add("favourited");
        } else {
            console.log("toilet is not favourited");
            toiletButton.classList.remove("favourited");
        }
    }
});


//This will toggle the favourites button and add and delete from Firestore
document.getElementById("favourite-button").addEventListener("click", async function () {
    try {
        const toiletDocID = localStorage.getItem("toiletDocID");

        // Toggle the "favourited" class
        this.classList.toggle("favourited");

        if (this.classList.contains("favourited")) {
            // Add the toilet to favourites
            await db.collection("favourites").add({
                user: firebase.auth().currentUser.uid,
                toiletID: toiletDocID
            });
        } else {
            // Remove the toilet from favourites
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
        }
    } catch (error) {
        console.error("Error during button click:", error);
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
