# Isometric building asset pipeline test

![Test Watercolour Image](test-watercolour.png)

## Getting Started

### Prerequisites

Node.js

### API Keys Setup

This application requires two API keys to function:

1. **Gemini API Key** - For AI image generation
2. **Google Maps API Key** - For maps and geocoding

#### Option 1: For Local Development (Environment Variables)

Create a `.env.local` file in the project root with your API keys:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

#### Option 2: For Public Deployment (Runtime Configuration)

When deploying publicly or if no environment variables are provided, the application will automatically prompt users to enter their own API keys via a modal dialog. The keys are stored securely in the browser's localStorage and persist across sessions.

### Getting Your API Keys

#### Google Maps API Key
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project or select an existing one.
- Enable the following APIs: Maps JavaScript API, Places API, Geocoding API.
- Create an API key under "Credentials".

#### Gemini API Key
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Installation and Running

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

## Deployment Notes

For public deployments:
- **No .env file needed** - Users will provide their own API keys via the UI
- API keys are stored locally in each user's browser
- Environment variables (if present) take priority over user-provided keys
- The application gracefully handles missing API keys with user-friendly prompts
