//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCEd2jl4BSFcPCPNJRdVb2DpBxbA7jixWc",
    authDomain: "comp1800-dtc01.firebaseapp.com",
    projectId: "comp1800-dtc01",
    storageBucket: "comp1800-dtc01.appspot.com",
    messagingSenderId: "91527565419",
    appId: "1:91527565419:web:1bd113bf465325d2b0212e"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const mapboxConfig = {
    accessToken: "pk.eyJ1IjoiZHRjMDEyMDIzMzAiLCJhIjoiY2xvbjE2MjBkMTBscTJrbnJxMjVpbnJiMyJ9.77ZOJBhY6XUKJEvCNs7pjw"
};