//Review form for users to submit reviews
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
        ratingsArray.push('1'); 
      }
    };

    setDefaultRating(cleanlinessRatings);
    setDefaultRating(odourRatings);
    setDefaultRating(safenessRatings);
    setDefaultRating(accessibleRatings);

    if (currentUser) {
      const userId = currentUser.uid;
      const userName = currentUser.displayName || 'Unknown';
      const params = new URL(window.location.href);
      const ID = params.searchParams.get('docID');

      // Add the review to Firestore
      db.collection('toilets')
        .doc(ID)
        .get()
        .then((toiletDoc) => {
          const toiletID = toiletDoc.id; 
          db.collection('reviews')
            .add({
              userId: userId,
              userName: userName,
              toiletID: toiletID, 
              cleanlinessRatings: cleanlinessRatings.join(','),
              odourRatings: odourRatings.join(','),
              safenessRatings: safenessRatings.join(','),
              accessibleRatings: accessibleRatings.join(','),
              title: title,
              comment: comment,
            })
            .then((docRef) => {
              // Clear the text area and ratings after adding the review
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

// Function to clear ratings
function clearRatings(radioGroupName) {
  const selectedRadios = document.querySelectorAll(`input[name="${radioGroupName}"]:checked`);
  selectedRadios.forEach((radio) => {
    radio.checked = false;
  });
}

// Function to get ratings
function getRatings(radioGroupName) {
  const selectedRadios = document.querySelectorAll(`input[name="${radioGroupName}"]:checked`);
  return Array.from(selectedRadios, (radio) => radio.value);
}

//Send user back to toilet page after submitting review
const closeSuccessModalButton = document.getElementById('closeSuccessModalButton');
closeSuccessModalButton.addEventListener('click', () => {
  const params = new URLSearchParams(window.location.search);
  const toiletID = params.get('docID');

  window.location.href = `toilet.html?docID=${toiletID}`; 
});