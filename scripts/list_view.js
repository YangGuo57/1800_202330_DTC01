//Shows a list view of all toilets
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("toiletCardTemplate"); // Retrieve the HTML element with the ID "toiletCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).limit(10).get()
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

