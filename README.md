# News and Weather API

## Prerequisites:

- **node.js**
- **express**
- **mongoDB**
- **mongoose**
- **jest**
- **jsonwebtoken**

{% hint style="warning" %}
Make sure that you are using node 10 or above
{% endhint %}

## Setup Instructions

- **Clone the repository**
- **npm install**
- **Add your weather API key to credentials/api.js**
- **Add your news API key credentials/api.js**

{% hint style="info" %}
To get your weather and news API key, visit (https://openweathermap.org/) and (https://newsapi.org/) respectively.
{% endhint %}

## API Endpoints

- **/signup**
- **/login**
- **/logout**
- **/news**
- **/news?search={category}**
- **/weather**
- **/weather?location={cityname}**

## Basic Workflow

- **/signup** User Registration

  - User get a 200 `success` message if they provide their `username`, valid `email`, `password` (minimum 8 length)
  - User get a 400 response with `success : false` if they do not provide a `email` address
  - If more than one user use same email address for registration then they will get 400 reponse with `email exists` message

- **/login** User Login

  - If user passed email that is not in database then they will get `email not found` message
  - If user passed wrong password then error will show as `password doesn't match`
  - If user provide both `validated` field then they will be `successfully` logged in using our API and a `token` will be generated in the database.
  - Now if the user again try to login then error message will be shown `You're already logged in`

- **/logout** User Logout

  - For this we have to do nothing but just make a get request and the user will be `logged out`.

- **/news** User Logout

  - We will see the top headlines of already `logged-in` user

- **/news?search={category}** User Logout

  - We will see the top headlines for a `speciefic` category `i.e technology` of already `logged-in` user

- **/weather** User Logout

  - We will see the over next 5 timestamp weather data for default `city : Bengaluru` without any `authentication`

- **/weather?location={cityname}** User Logout

  - We will see the over next 5 timestamp weather data for `speciefic` city without any `authentication`

## Postman Collection

{% hint style="info" %}
https://documenter.getpostman.com/view/10183149/U16krk1u
{% endhint %}
