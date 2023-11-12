//Shows a list view of all toilets
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("toiletCardTemplate"); // Retrieve the HTML element with the ID "toiletCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()
        .then(allToilets => {
            allToilets.forEach(doc => { 
                var title = doc.data().name;
                var location = doc.data().geo_local_area;
                var disability = doc.data().wheel_access;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); 

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-location').innerHTML = "Location: " + location;
                newcard.querySelector('.card-accessibility').innerHTML = "Wheelchair Access: " + disability;
                newcard.querySelector('a').href = "toilet.html?docID=" + docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}
displayCardsDynamically("toilets"); 

// FOR SHOWING TOILET READ MORE INFO
function displayToiletInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("toilets")
        .doc(ID)
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

            // only populate title, and image
            document.getElementById("toiletName").innerHTML = toiletName;
            document.getElementById("details-go-here").innerHTML = toiletLocation + "<br>" + toiletAddress + "<br>" + toiletType + "<br>" + "Wheelchair Access: " + toiletWheelchair + "<br>" + "Summer Hours: " + toiletSummer + "<br>" + "Winter Hours: " + toiletWinter;
            // let imgEvent = document.querySelector( ".hike-img" );
            // imgEvent.src = "../images/" + hikeCode + ".jpg";


        });
}
displayToiletInfo();


// // Toggle the "favorited" state when the button is clicked
// document.getElementById("favourite-button").addEventListener("click", function () {
//     this.classList.toggle("favorited");
// });
