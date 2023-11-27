function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                var userName = userDoc.data().name;
            })
        } else {
            console.log("No user is logged in.");
        }
    })
}
insertNameFromFirestore();
