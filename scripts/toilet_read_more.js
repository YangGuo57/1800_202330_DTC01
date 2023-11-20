// FOR SHOWING TOILET READ MORE INFO
function displayToiletInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"

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

            document.getElementById("toiletName").innerHTML = toiletName;
            document.getElementById("details-go-here").innerHTML = toiletLocation + "<br>" + toiletAddress + "<br>" + toiletType + "<br>" + "Wheelchair Access: " + toiletWheelchair + "<br>" + "Summer Hours: " + toiletSummer + "<br>" + "Winter Hours: " + toiletWinter;
            document.getElementById("add-review").innerHTML = "<a href='write_review.html?docID=" + ID + "' class='btn'>Add Review</a>";
            document.getElementById("more-review").innerHTML = "<a href='review.html?toiletID=" + ID + "' class='btn'>All Reviews</a>";
        });
}
displayToiletInfo();
