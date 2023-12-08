## CapWise

- [Project Title](#project-title)
- [Project Description](#project-description)
- [Contributor Bios](#contributor-bios)
- [Technologies and Resources Used](#technologies-and-resources-used)
- [Acknowledgements](#acknowledgements)
- [Usage](#usage)
- [Bugs and Limitations](#bugs-and-limitations)
- [Features for Future](#features-for-future)
- [Contents of Folder](#contents-of-folder)
- [Contact](#contact)

# Project Title

FlushFinder

## Project Description

Our team DTC01 is developing the FlushFinder to help everyone to find a public washroom by letting them use an app that maps out the public toilets in the city.

## Contributor Bios

- Hi, my name is Yang! I am so excited to start this project! Let's go FlushFinder!
- Hi, my name is Patricia and I am excited to share with everyone my vision for a toilet-ful Vancouver!
- Hi, my name is Shaun. I am passionate about the accessibility of public washrooms!

## Technologies and Resources Used

List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

- HTML, CSS, JavaScript
- Bootstrap 5.0 (Frontend library)
- Firebase 8.0 (BAAS - Backend as a Service)
- MapBox API
- Vancouver Public Washroom API
- Google Icons
- Google Fonts

## Acknowledgements

- <a href="https://fonts.google.com/">Google Fonts</a>
- <a href="https://fonts.google.com/icons">Google Icons<a>
- <a href="https://unsplash.com/">Unsplash Free Images </a>
- <a href="https://getbootstrap.com/">Bootstrap</a>
- <a href="https://stackoverflow.com/">StackOverflow</a>

## Usage

State what a user needs to do when they come to your project. How do others start using your code or application?
Here are the steps ...

- Users go to this link: https://comp1800-dtc01.web.app/
- Users then need to sign up for an account and login
- User can then use all core functions

## Bugs and Limitations

Here are some known bugs:

- Once you choose a location and ask to be directed there, when you click on another pin you are immediately directed there without clicking the direction
- The list-view takes some time to load because it does the calculation based on the users location for all washrooms in the database before sorting.

## Features for Future

What we'd like to build in the future:

- Having a payment feature in case there are toilets that
- We would like a world-wide database for all the toilets
- Support different languages for other countries
- Add photos feature to give users a better idea of the location

## Contents of Folder

Content of the project folder:

```
Top level of project folder:
├── .firebase                # Folder for firebase configuration
├── .vscode                  # Folder for VSCode settings
├── images                   # Folder for images
│   ├── logo-white.svg       # White logo image
│   ├── logo.svg             # Standard logo image
│   ├── review.jpg           # Review image
│   ├── toilet_icon.png      # Toilet icon image
│   ├── user_icon.png        # User icon image
│   ├── washroom.jpg         # Washroom image
│   └── welcome.jpg          # Welcome image
├── scripts                  # Folder for scripts
│   ├── authentication.js    # Authentication script
│   ├── favourite_button.js  # Favourite button script
│   ├── favourites.js        # Favourites script
│   ├── firebaseAPI_DTC01.js # Firebase API script
│   ├── list_view.js         # List view script
│   ├── main.js              # Main script
│   ├── maps.js              # Maps script
│   ├── myaccount.js         # My account script
│   ├── review.js            # Review script
│   ├── script.js            # General script
│   ├── skeleton.js          # Skeleton script
│   ├── toilet_API.js        # Toilet API script
│   ├── toilet_read_more.js  # Toilet read more script
│   └── write_review.js      # Write review script
├── styles                   # Folder for styles
│   ├── about_us.css         # About us stylesheet
│   ├── favourites.css       # Favourites stylesheet
│   ├── list_view.css        # List view stylesheet
│   ├── login.css            # Login stylesheet
│   ├── map.css              # Map stylesheet
│   ├── my_account.css       # My account stylesheet
│   ├── nav.css              # Navigation stylesheet
│   ├── normalize.css        # Normalize stylesheet
│   ├── review.css           # Review stylesheet
│   ├── toilet.css           # Toilet stylesheet
│   └── write_review.css     # Write review stylesheet
└── text                     # Folder for text files
│    ├── footer_after_login.html   # Footer after login HTML
│    ├── footer_before_login.html  # Footer before login HTML
│    ├── nav_after_login.html      # Navigation after login HTML
│    ├── nav_before_login.html     # Navigation before login HTML
├── 404.html                  # 404 Error page
├── about_us.html             # About us page
├── favourites.html           # Favourites page
├── firebase.json             # Firebase configuration JSON
├── firestore.indexes.json    # Firestore indexes JSON
├── firestore.rules           # Firestore rules
├── index.html                # Index page
├── list_view.html            # List view page
├── login.html                # Login page
├── main.html                 # Main page
├── my_account.html           # My account page
├── README.md                 # README file
├── review.html               # Review page
├── Team DTC-01_pitch.pdf     # Team pitch document
├── template.html             # Template HTML
├── toilet.html               # Toilet page
└── write_review.html         # Write review page
```

## Contact

- Patricia Lo - pkwlo1992@gmail.com
- Shaun Sy - ssy7@my.bcit.ca
- Yang Guo - guoyang711@gmail.com
