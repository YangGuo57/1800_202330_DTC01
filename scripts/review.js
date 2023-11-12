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
                    <ul class="list-unstyled d-flex">
                      ${starsHtml}
                    </ul>
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

const mainStarContainer = document.getElementById('main-star');
mainStarContainer.innerHTML = generateStarRating();

document.addEventListener('DOMContentLoaded', function () {
  displayAverageRating();
  displayReviews();
});
