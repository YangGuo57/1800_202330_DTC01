document.addEventListener("DOMContentLoaded", function() {
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

function displayReviews(toiletID) {
    const reviewsTemplate = document.getElementById("reviewTemplate");
    const reviewsContainer = document.getElementById("reviewsContainer");

    db.collection("reviews")
        .where("toiletID", "==", toiletID)
        .limit(3) // Fetch only the first 3 reviews
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const review = doc.data();
                const newReview = reviewsTemplate.content.cloneNode(true);

                // Calculate average rating for this review
                const averageRating = calculateAverageRating(review);
                const starRating = getStarRating(averageRating);

                // Populate the template with data
                newReview.querySelector('.review-user').textContent = review.userName;
                newReview.querySelector('.review-rating').textContent = starRating; // Display star rating
                newReview.querySelector('.review-comment').textContent = review.comment;

                reviewsContainer.appendChild(newReview);
            });
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
        });
}

function calculateAverageRating(review) {
    const total = parseInt(review.accessibleRatings) + parseInt(review.cleanlinessRatings) +
                  parseInt(review.odourRatings) + parseInt(review.safenessRatings);
    return total / 4; // Assuming there are 4 rating categories
}

function getStarRating(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "★" : "☆"; // Full star for each whole number rating
    }
    return stars;
}

function getToiletIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('docID'); // "docID" is the name of the query parameter
}

const toiletID = getToiletIdFromUrl();
console.log(toiletID); // This will log the toilet ID from the URL

// Now you can use toiletID to display reviews or any other related data
displayReviews(toiletID);
});
