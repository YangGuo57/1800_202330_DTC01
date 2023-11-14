// DEMO SECTION used only for demo_toilet_cards_for_testing_only.html

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("toiletCardTemplate"); // Retrieve the HTML element with the ID "toiletCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()
        .then(allToilets => {
            //var i = 1;  //Optional: if you want to have a unique ID for each toilet
            allToilets.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;
                var location = doc.data().geo_local_area;
                var disability = doc.data().wheel_access;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = "Location: " + location;
                newcard.querySelector('.card-text').innerHTML = "Wheelchair Access: " + disability;
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

displayCardsDynamically("toilets");  //input param is the name of the collection


// FOR SHOWING TOILET READ MORE INFO IN DEMO
function displayToiletInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
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
