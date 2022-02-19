# 🗞️ My News API 🗞️

![Imgur](https://i.imgur.com/YmjOXbH.jpg)

_Image via https://flic.kr/p/65rC2n under [(CC BY-NC-SA 2.0)](https://creativecommons.org/licenses/by-nc-sa/2.0/)_

Hello! 👋 Welcome to my news API.

## 💭 Description

This API allows users to create, read, update and delete information by interacting with the database. To view all available endpoints, please visit the hosted version using the URL below.

---

## 🏠 Hosted version

https://davidc-nc-news.herokuapp.com/api

Following this URL will produce a JSON file that will list all available endpoints: with available queries, example request bodies, and example responses.

For example 👇:

![Imgur](https://i.imgur.com/UXPAooX.png)

---

## 🖥️ Running the API Locally

🚧 Before beginning setup, please check you have _at least_ these versions of the following:

- `Node.js` - v. 17.5.0
- `Postgres` - v. 14.1

After doing so, perform each step, in order:

### 💻 ➡️ 💻 Cloning the repository:

```
git clone https://github.com/davidptclark/be-nc-news.git
```

### 🏗️ Install required packages:

Simply run `npm install` to install the necessary dependencies required.

### 🌐 Environment setup:

This repository does not contain the necessary .env files that set the value of PGDATABASE to a specific database, as they are part of the gitignore and will only be stored locally. After cloning, you will need to create two .env files in the root directory:

`.env.development`

![.env.development](https://i.imgur.com/rpHqxYq.png)

`.env.test`

![.env.test](https://i.imgur.com/kgTX2Cx.png)

### 🌱 Seeding local databases:

To start the API, run the command `npm start`. This will instruct the API to listen on the default port: 9090.

If you would like to reinitialise the database, use the command `npm run setup-db` followed by `npm run seed` to re-seed the database.

### 🧪 Running tests:

The available endpoint have been created using Jest and pre-written tests are found in `./__tests__/`. The test files are configured to re-seed the database after each test is complete; to run these tests, as well as any you have written, use the command `npm test FILENAME`.

---
