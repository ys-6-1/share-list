# ShareList

Welcome to ShareList!

## Introduction

This application was created during my time as a student at [Code Chrysalis](https://www.codechrysalis.io/ "Code Chrysalis Website").

ShareList is a checklist sharing application. It allows users to make checklists, organize them with folders, and share them with other users who have accounts in the app, by typing in their email address. User authentication is implemented with JWT.

## Using the Application

To use the application online, please visit the deployed app at: [https://share-list-prod.herokuapp.com/](https://share-list-prod.herokuapp.com/)

### Run it in the development mode

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

## Tech Stack

### Back-end:

Python3 / Django / Django Rest Framework\
SQLite3

### Front-end

React \
Sass
