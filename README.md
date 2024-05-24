# Automation Code Challenge for Leonardo.ai using Playwright

The goal for this challenge was to automate the flow that generates a simple image based on a defined prompt.

## Requirements and project setup

It requires a **new Leonardo.ai account** to run the test script. As the timespan to write the solution was only 2h, older accounts or premium might behave differently, which wasn't tested.
Apart from Playwright, there are no other dependencies needed.

To install the dependencies:

```
npm install
npx playwright install --with-deps
```

Following that, update the .env file with the credentials required - email, username and password.
The username is quite important as it is used to click the logout button at the end of the flow.

```
ENV = PROD
WEB_URL = https://app.leonardo.ai
USERNAME = YOURUSERNAMEHERE
EMAIL = YOUREMAILHERE
PASSWORD = YOURPASSWORDHERE

```

## Features

As requested, the project was written in Typescript and uses the Page Object Model pattern.

On the main spec file, instances of the pages are created and then the methods are called inside Test Steps for better code and report readability.
Each page is created as a class and the elements are properties of the class. The pages are located inside the Pages folder

```
\pages
  login.ts
  ai-generation.ts
  landing.ts
```

## How to run the test

Once the setup is done, to run the tests in headless mode:

```
npx playwright test
```

To run in headed mode and see the actual script running or running just in chromium:

```
npx playwright test --headed
npx playwright test --headed --project=chromium
```

# Improvements and TODOs

With more time, some improvements that I would do to this project:
- Investigate a bit more different options for some locators to improve the test stability
- Investigate, improve and add the remaining locators for the number of images, pipeline used, etc using ENUMs or other options
- Investigate a better way to validate the image created in the test is present (without the use of the timestamp)
- Improve the logic that compares the quantity of images generated to be more dynamic
- Improve the way to identify the profile button for logout to dynamically gets the text
- Move the instances of the classes to a custom fixture to clean up even more the test spec file
