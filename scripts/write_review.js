document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.querySelector('.add-review button');
  submitButton.addEventListener('click', () => {
    const cleanlinessRatings = getRatings('rating1');
    const odourRatings = getRatings('rating2');
    const safenessRatings = getRatings('rating3');
    const accessibleRatings = getRatings('rating4');
    const comment = document.getElementById('floatingTextarea2').value;

    // Create a new review object with individual ratings
    const review = {
      cleanlinessRatings: cleanlinessRatings,
      odourRatings: odourRatings,
      safenessRatings: safenessRatings,
      accessibleRatings: accessibleRatings,
      comment: comment,
    };

    // Add the review to Firestore
    db.collection('reviews')
      .add(review)
      .then((docRef) => {
        console.log('Review added with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding review: ', error);
      });
  });
});

function getRatings(radioGroupName) {
  const selectedRadios = document.querySelectorAll(`input[name="${radioGroupName}"]:checked`);
  return Array.from(selectedRadios, (radio) => parseInt(radio.value));
}
