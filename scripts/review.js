// Calculate rating
function displayAverageRating(toiletID) {
  const db = firebase.firestore();

  db.collection('reviews')
    .where('toiletID', '==', toiletID)
    .get()
    .then((querySnapshot) => {
      let totalRating = 0;
      let reviewCount = 0;

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();

        totalRating +=
          parseFloat(reviewData.cleanlinessRatings) +
          parseFloat(reviewData.odourRatings) +
          parseFloat(reviewData.safenessRatings) +
          parseFloat(reviewData.accessibleRatings);
        reviewCount++;
      });

      const averageRating = reviewCount > 0 ? totalRating / (reviewCount * 4) : 0;

      document.getElementById('averageRating').textContent = averageRating.toFixed(1) + "/5";
    })
    .catch((error) => {
      console.error('Error fetching reviews: ', error);
    });
}

// Display toilet reviews according to toiletID
function displayReviews(toiletID) {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const db = firebase.firestore();

  db.collection('reviews')
    .where('toiletID', '==', toiletID)
    .get()
    .then((querySnapshot) => {
      reviewsContainer.innerHTML = '';

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const averageRating = calculateAverageRatingEach(reviewData);
        const starRating = getStarRatingEach(averageRating);

        const reviewElement = document.createElement('div');
        reviewElement.classList.add('col-md-4', 'mb-2', 'text-center', 'review');

        reviewElement.innerHTML = `
          <div class="card">
            <div class="card-body py-01 mt-0">
              <div class="top">
                <div class="user-icon"><img src="../images/user-icon.png" class="rounded-circle"/></div>
                <div class="name">${reviewData.userName}</div>
                <div class="rating">${starRating}</div>
              </div>
              <p class="mb-3">
                <b>${reviewData.title}</b>
              </p>
              <p class="mb-2">
                ${reviewData.comment}
              </p>
            </div>
          </div>
        `;

        reviewsContainer.appendChild(reviewElement);
      });

      displayDynamicProgressBars(querySnapshot);
    })
    .catch((error) => {
      console.error('Error fetching reviews: ', error);
    });
}

// Calculate average rating for each category
function calculateAverageRating(querySnapshot, category) {
  let totalRating = 0;
  let reviewCount = 0;

  querySnapshot.forEach((doc) => {
    const reviewData = doc.data();
    const categoryRating = parseFloat(reviewData[`${category.toLowerCase()}Ratings`]);

    totalRating += categoryRating;
    reviewCount++;
  });

  return (totalRating / reviewCount);
}

// Display dynamic progress bar
function displayDynamicProgressBars(querySnapshot) {
  const progressContainer = document.querySelector('.review-progress');
  const ratingItems = ['Cleanliness', 'Odour', 'Safeness', 'Accessible'];

  const categoryColors = {
    'Cleanliness': 'info',
    'Odour': 'info',
    'Safeness': 'info',
    'Accessible': 'info'
  };

  ratingItems.forEach((item) => {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');

    const reviewPair = document.createElement('div');
    reviewPair.classList.add('review-pair');

    const reviewTitle = document.createElement('div');
    reviewTitle.classList.add('review-title');
    reviewTitle.innerHTML = `<p>${item}</p>`;

    const reviewBar = document.createElement('div');
    reviewBar.classList.add('review-bar');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', `${item} example`);
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');

    const progressInnerBar = document.createElement('div');
    progressInnerBar.classList.add('progress-bar', `bg-${categoryColors[item]}`);

    progressInnerBar.style.width = `${(calculateAverageRating(querySnapshot, item) / 5) * 100}%`;

    progressBar.appendChild(progressInnerBar);
    reviewBar.appendChild(progressBar);
    reviewPair.appendChild(reviewTitle);
    reviewPair.appendChild(reviewBar);
    reviewItem.appendChild(reviewPair);
    progressContainer.appendChild(reviewItem);
  });
}

// Displays reviews and average rating on page load
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const toiletID = urlParams.get('toiletID');

  if (toiletID) {
    displayReviews(toiletID);
    displayAverageRating(toiletID);
  } else {
    console.error('ToiletID not found in URL or write review button not found.');
  }
});

// Calculate average rating for each category
function calculateAverageRatingEach(review) {
  const total = parseInt(review.accessibleRatings) + parseInt(review.cleanlinessRatings) +
                parseInt(review.odourRatings) + parseInt(review.safenessRatings);
  return total / 4; 
}

// Display star rating for each review
function getStarRatingEach(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? "★" : "☆"; 
  }
  return stars;
}