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
            document.getElementById("add-review").innerHTML = "<a href='write_review.html?docID=" + ID + "' class='btn btn-primary'>Add Review</a>";
            // let imgEvent = document.querySelector( ".hike-img" );
            // imgEvent.src = "../images/" + hikeCode + ".jpg";


        });
}
displayToiletInfo();

let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

function getStarRating(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "★" : "☆"; // Filled star for ratings above or equal to 'i', otherwise empty star
  }
  return `<span class="star-rating">${stars}</span>`;
}

// Function to calculate the average rating from review data
function calculateAverageRating(reviewData) {
  // Parse and calculate the average rating based on your review data structure
  const cleanlinessRatings = reviewData.cleanlinessRatings ? parseFloat(reviewData.cleanlinessRatings) : 0;
  const odourRatings = reviewData.odourRatings ? parseFloat(reviewData.odourRatings) : 0;
  const safenessRatings = reviewData.safenessRatings ? parseFloat(reviewData.safenessRatings) : 0;
  const accessibleRatings = reviewData.accessibleRatings ? parseFloat(reviewData.accessibleRatings) : 0;

  // Calculate the average rating
  const totalRatings = cleanlinessRatings + odourRatings + safenessRatings + accessibleRatings;
  const numberOfRatings = (cleanlinessRatings ? 1 : 0) + (odourRatings ? 1 : 0) + (safenessRatings ? 1 : 0) + (accessibleRatings ? 1 : 0);
  return numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;
}


// Function to display reviews for a specific toilet
function displayReviewsForToilet(docID) {
  const reviewsContainer = document.getElementById('reviews-go-here');

  // Clear any existing reviews
  reviewsContainer.innerHTML = '';

  // Query Firestore for reviews with the given docID
  db.collection('reviews')
    .where('DOCId', '==', docID)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');

        // Calculate the average rating
        const averageRating = calculateAverageRating(reviewData);

        // Get the star rating HTML
        const starRating = getStarRating(averageRating);

        // Populate the review element with review data and star rating
        reviewElement.innerHTML = `
          <h3>${reviewData.userName}</h3>
          ${starRating}
          <p>${reviewData.comment}</p>
        `;

        reviewsContainer.appendChild(reviewElement);
      });
    })
    .catch((error) => {
      console.error('Error fetching reviews:', error);
    });
}


displayReviewsForToilet(ID)

// // Toggle the "favorited" state when the button is clicked
// document.getElementById("favourite-button").addEventListener("click", function () {
//     this.classList.toggle("favorited");
// });
