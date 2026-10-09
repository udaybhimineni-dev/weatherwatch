# WeatherWatch

A full-stack weather app built with React, TypeScript, and Django. Search for a city, check current conditions, and view a seven-day forecast. Animated weather scenes change with the weather and the location’s day or night status.

## Features

- City search with location results to distinguish places with similar names.
- Current temperature, feels-like temperature, humidity, and wind speed.
- Seven-day forecast with daily highs, lows, and rain probability.
- Animated sun, moon, clouds, rain, snow, and fog.
- Responsive layout for desktop and mobile screens.
- Reduced-motion support for weather animations.
- Loading states, input validation, and error messages.
- Django backend that requests weather data from Open-Meteo.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, CSS
- **Backend:** Python, Django, Django REST Framework, Requests
- **Weather data:** Open-Meteo Forecast and Geocoding APIs
- **Development database:** SQLite
- **Version control:** Git and GitHub

## How It Works

The React frontend sends requests to the Django API. Django validates the input, requests data from Open-Meteo, and returns JSON to the frontend.

During local development, Vite forwards `/api` requests to Django.

## Run Locally

The commands below are for macOS or Linux. This version was developed using Node.js 24 and Python 3.14.

### 1. Clone the repository

```bash
git clone https://github.com/udaybhimineni-dev/weatherwatch.git
cd weatherwatch
```

### 2. Set up the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Generate a Django secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the generated value into `backend/.env`:

```dotenv
DJANGO_SECRET_KEY='paste-your-generated-key-here'
```

Keep `.env` private. It is excluded from Git.

Apply migrations and start Django:

```bash
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`.

### 3. Start the frontend

Open a second Terminal window:

```bash
cd weatherwatch/frontend
npm ci
npm run dev
```

Use the path to your cloned `weatherwatch` folder if the second Terminal opens elsewhere.

Open the local URL printed by Vite, usually `http://localhost:5173`. Keep both servers running.

## API Endpoints

- `GET /api/health/` — checks whether the backend is running.
- `GET /api/cities/?city=Guntur` — searches for matching locations.
- `GET /api/forecast/?lat=16.3&lon=80.4` — returns weather data for coordinates.

## Development Checks

Backend configuration check, with the virtual environment active:

```bash
cd backend
python manage.py check
```

Frontend production build:

```bash
cd frontend
npm run build
```

Run each command from the repository root, in separate Terminal sessions.

## Current Status

City search, current conditions, forecasts, and weather animations are implemented. The app currently runs locally and has not yet been deployed.

Django settings are configured for development. Production deployment will require separate security and hosting configuration.

## Planned Improvements

- User accounts and saved cities.
- Comparison of weather across cities.
- Weather alerts based on user-defined thresholds.
- Backend caching and automated tests.
- A publicly accessible live demo.

## Data Attribution

Weather and location data are provided by [Open-Meteo](https://open-meteo.com/).

## Author

[Uday Bhimineni](https://github.com/udaybhimineni-dev)
