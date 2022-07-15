# ShareList

Welcome to ShareList!
![image_1](https://user-images.githubusercontent.com/72680138/179153549-ecfc2653-fcaa-4354-ba6c-d800c21e6c87.png)

![image_2](https://user-images.githubusercontent.com/72680138/179153613-b17c0a9b-f12d-416b-bcf9-6e9bc9a40174.png)

![image_3](https://user-images.githubusercontent.com/72680138/179153678-ad080efa-3ab5-4ea6-b1e7-30cfd730e14b.png)

![image_4](https://user-images.githubusercontent.com/72680138/179153747-b9676c9a-f5f3-49a1-916b-91d269a2ac05.png)

# Introduction

This application was created during my time as a student at [Code Chrysalis](https://www.codechrysalis.io/ "Code Chrysalis Website").

ShareList is a checklist sharing application. It allows users to make checklists, organize them with folders, and securely share their private folders with designated users who have accounts in the app. User authentication is implemented with JWT.

## Demo Video

Demo video is available on [YouTube](https://www.youtube.com/watch?v=VSKCjHRJIlI)

## Deployed Application

Deployed application is available at: [https://share-list-app.herokuapp.com](https://share-list-app.herokuapp.com)

## Features

- Simple, minimalistic, and easy-to-use UI
- User registration with JWT
- User sign-in / sign-out with JWT
- CRUD features for checklist items and folders
- Feature to manage checklist by folder
- Folder sharing with specific users (users can be searched with their email)
- Feature to choose whether or not to accept shared folders
- Notification UI displayed when a folder is shared by other user

# Run it in the development mode

To use the application locally, please follow the steps below.

**1: Create virtual environment**

Pleaase fork this repository and in the root directory, launch virtual environment by running:

`source venv/bin/activate`

**2: Install dependencies**

Install the dependencies by running:

`pip install -r requirements.txt`

**3: Migrate Database**

Migrate the database by running:

`python3 manage.py migrate`

**4: Start server**

Start the server by running:

`python3 manage.py runserver`

**5: Start front-end**

You can run front-end by running:

`npm start`

**6: Open in browser**

Open [http://localhost:3000](http://localhost:3000) in your browser.

# Tech Stack

## Back-end:

Python\
Django\
Django Rest Framework\
SQLite3 / Postgres (for producton)\
JWT authentication

## Front-end

React \
Axios \
Sass \
Material UI
