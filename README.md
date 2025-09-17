# Isometric building asset pipeline test

![Test Watercolour Image](test-watercolour.png)

### Prerequisites ###

Node.js

### Google Maps API Key
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project.
- Enable the following APIs: Maps JavaScript API, Places API, Geocoding API.
- Create an API key under "Credentials".

### Gemini API Key
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

Set both keys in a `.env.local` file in the project root as `GOOGLE_MAPS_API_KEY` and `GEMINI_API_KEY`.

Install dependencies:

```npm install```

Run the app:

```npm run dev```
