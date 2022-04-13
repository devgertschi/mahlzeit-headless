# mahlzeit-headless

**Headless-browser automation for ordering food via mahlzeit.online lunch provider.**

(Implemented for the @hokify _Monthly Know-How Austausch_ session April 2022, an 'integrations-crew' project.)

🦘 skippy rulez 

---

## Getting started:

### Installation:

Install the dependencies: `npm install`

### Setup:

Set your credentials to the environment variables (depending on your OS): `SECRET_FOOD_EMAIL` and `SECRET_FOOD_PASSWORD` accordingly, how you normally log in to the platform.

---

## Running:

`npm run order [schnitzel]`

...to order your favorite food (if available) for the next day. Enter one string for the food choice as parameter. (Default: Eiernockerl)

---

## Development:

`npm run dev`

...to run the script via nodemon, automatically re-runs the script on code change, for development purposes.

Pro-tip: It might make sense if you change `headless: true` to `headless: false` in the options object, so you see more of what you actually do.