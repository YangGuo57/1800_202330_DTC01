var currentUser;              
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    var userName = userDoc.data().name;
                    var userCity = userDoc.data().city;
                    var userCountry = userDoc.data().country;
                    var userEmail = userDoc.data().email;
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userCountry != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                })
        } else {
            console.log("No user is signed in");
        }
    });
}
populateUserInfo();

function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;
    userCity = document.getElementById('cityInput').value;
    userCountry = document.getElementById('countryInput').value;

    currentUser.update({
        name: userName,
        city: userCity,
        country: userCountry
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    //disable the document
    document.getElementById('personalInfoFields').disabled = true;

}