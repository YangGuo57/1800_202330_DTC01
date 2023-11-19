let params = new URL(window.location.href);
console.log(params.toString());
let ID = params.searchParams.get("docID");
console.log(ID);

document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.querySelector('.add-review button');
  submitButton.addEventListener('click', () => {
    const cleanlinessRatings = getRatings('rating1');
    const odourRatings = getRatings('rating2');
    const safenessRatings = getRatings('rating3');
    const accessibleRatings = getRatings('rating4');
    const commentTextarea = document.getElementById('floatingTextarea2');
    const comment = commentTextarea.value;

    const currentUser = firebase.auth().currentUser;

    // Function to set default rating if no rating is selected
    const setDefaultRating = (ratingsArray) => {
      if (ratingsArray.length === 0) {
        ratingsArray.push('1'); // Set default rating to 1
      }
    };

    // Set default ratings if no ratings are selected
    setDefaultRating(cleanlinessRatings);
    setDefaultRating(odourRatings);
    setDefaultRating(safenessRatings);
    setDefaultRating(accessibleRatings);

    if (currentUser) {
      const userId = currentUser.uid;
      const userName = currentUser.displayName || "Unknown"; // Use displayName if available, otherwise default to "Unknown"

      // Add the review to Firestore
      db.collection('reviews')
        .add({
          userId: userId,
          userName: userName,
          DOCId: ID,
          cleanlinessRatings: cleanlinessRatings.join(','),
          odourRatings: odourRatings.join(','),
          safenessRatings: safenessRatings.join(','),
          accessibleRatings: accessibleRatings.join(','),
          comment: comment,
        })
        .then((docRef) => {
          console.log('Review added with ID: ', docRef.id);
          // Clear the textarea
          commentTextarea.value = '';
          clearRatings('rating1');
          clearRatings('rating2');
          clearRatings('rating3');
          clearRatings('rating4');

        })
        .catch((error) => {
          console.error('Error adding review: ', error);
        });
    } else {
      console.error('User not logged in');
    }
  });
});

function clearRatings(radioGroupName) {
  const selectedRadios = document.querySelectorAll(`input[name="${radioGroupName}"]:checked`);
  selectedRadios.forEach((radio) => {
    radio.checked = false;
  });
}

function getRatings(radioGroupName) {
  const selectedRadios = document.querySelectorAll(`input[name="${radioGroupName}"]:checked`);
  return Array.from(selectedRadios, (radio) => radio.value);
}
