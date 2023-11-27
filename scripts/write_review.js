document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.querySelector('.add-review button');
  submitButton.addEventListener('click', () => {
    const cleanlinessRatings = getRatings('rating1');
    const odourRatings = getRatings('rating2');
    const safenessRatings = getRatings('rating3');
    const accessibleRatings = getRatings('rating4');
    const commentTextarea = document.getElementById('floatingTextarea2');
    const titleTextarea = document.getElementById('floatingTextarea1');
    const comment = commentTextarea.value;
    const title = titleTextarea.value;

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
      const userName = currentUser.displayName || 'Unknown'; // Use displayName if available, otherwise default to "Unknown"
      const params = new URL(window.location.href);
      const ID = params.searchParams.get('docID'); // Get the toilet ID from URL

      // Get toilet data to retrieve the toilet ID
      db.collection('toilets')
        .doc(ID)
        .get()
        .then((toiletDoc) => {
          const toiletID = toiletDoc.id; // Retrieve the toilet ID
          // Add the review to Firestore with the corresponding toilet ID
          db.collection('reviews')
            .add({
              userId: userId,
              userName: userName,
              toiletID: toiletID, // Use the retrieved toilet ID here
              cleanlinessRatings: cleanlinessRatings.join(','),
              odourRatings: odourRatings.join(','),
              safenessRatings: safenessRatings.join(','),
              accessibleRatings: accessibleRatings.join(','),
              title: title,
              comment: comment,
            })
            .then((docRef) => {
              console.log('Review added with ID: ', docRef.id);
              // Clear the textarea and ratings after adding the review
              commentTextarea.value = '';
              clearRatings('rating1');
              clearRatings('rating2');
              clearRatings('rating3');
              clearRatings('rating4');
            })
            .catch((error) => {
              console.error('Error adding review: ', error);
            });
        })
        .catch((error) => {
          console.error('Error getting toilet document:', error);
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

// Add an event listener to the close button of the success modal
const closeSuccessModalButton = document.getElementById('closeSuccessModalButton');
closeSuccessModalButton.addEventListener('click', () => {
  // Get the toilet ID from the URL
  const params = new URLSearchParams(window.location.search);
  const toiletID = params.get('docID');

  // Redirect to the toilets page with the toilet ID as a query parameter
  window.location.href = `toilet.html?docID=${toiletID}`; // Replace with your toilets page URL
});