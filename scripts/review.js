function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star text-info"></i>';
  }

  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt text-info"></i>';
  }

}

function displayAverageRating() {
  const db = firebase.firestore();

  db.collection('reviews')
    .get()
    .then((querySnapshot) => {
      let totalRating = 0;
      let reviewCount = 0;

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();

        totalRating += parseFloat(reviewData.cleanlinessRatings) +
          parseFloat(reviewData.odourRatings) +
          parseFloat(reviewData.safenessRatings) +
          parseFloat(reviewData.accessibleRatings);
        reviewCount++;
      });

      const averageRating = totalRating / (reviewCount * 4);

      document.getElementById('averageRating').textContent = averageRating.toFixed(1);
    })
    .catch((error) => {
      console.error('Error fetching reviews: ', error);
    });
}

function displayReviews() {
  const reviewsContainer = document.getElementById('reviewsContainer');

  const db = firebase.firestore();

  db.collection('reviews')
    .get()
    .then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();

        const reviewElement = document.createElement('div');
        reviewElement.classList.add('col-md-4', 'mb-4', 'text-center', 'review');

        const starsHtml = generateStarRating(reviewData.rating);

        reviewElement.innerHTML = `
          <div class="card">
            <div class="card-body py-01 mt-0">
              <div class="d-flex align-items-left mb-">
                <div class="user-icon"><img src="${reviewData.userIcon}" class="rounded-circle shadow-1-strong" width="100" height="100" /></div>
                <div class="d-flex flex-column ">
                  <p class="name">${reviewData.userName}</p>
                  <div class="stars-days">
                    <div class="days">
                      <p>Posted ${reviewData.daysAgo} days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <p class="mb-2">
                <i class="fas fa-quote-left pe-2"></i>${reviewData.comment}
              </p>
            </div>
          </div>
        `;

        reviewsContainer.appendChild(reviewElement);
      });

      // Add this line to update dynamic progress bars
      displayDynamicProgressBars(querySnapshot);
    })
    .catch((error) => {
      console.error('Error fetching reviews: ', error);
    });
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star text-info"></i>';
  }

  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt text-info"></i>';
  }

  return starsHtml;
}

// New function to calculate average rating for each category
function calculateAverageRating(querySnapshot, category) {
  let totalRating = 0;
  let reviewCount = 0;

  querySnapshot.forEach((doc) => {
    const reviewData = doc.data();

    // Get the rating for the specified category
    const categoryRating = parseFloat(reviewData[`${category.toLowerCase()}Ratings`]);

    totalRating += categoryRating;
    reviewCount++;
  });

  // Return the average rating for the category
  return (totalRating / reviewCount);
}

// New function to get rating color based on value
function getRatingColor(value) {
  if (value >= 75) {
    return 'danger';
  } else if (value >= 50) {
    return 'warning';
  } else if (value >= 25) {
    return 'info';
  } else {
    return 'success';
  }
}

// New function to display dynamic progress bars
function displayDynamicProgressBars(querySnapshot) {
  const progressContainer = document.querySelector('.review-progress');

  const ratingItems = ['Cleanliness', 'Odour', 'Safeness', 'Accessible'];

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
    progressInnerBar.classList.add('progress-bar', `bg-${getRatingColor(calculateAverageRating(querySnapshot, item))}`);
    progressInnerBar.style.width = `${(calculateAverageRating(querySnapshot, item) / 5) * 100}%`;

    progressBar.appendChild(progressInnerBar);
    reviewBar.appendChild(progressBar);
    reviewPair.appendChild(reviewTitle);
    reviewPair.appendChild(reviewBar);
    reviewItem.appendChild(reviewPair);
    progressContainer.appendChild(reviewItem);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  displayReviews();
  displayAverageRating();
});
