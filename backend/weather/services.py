import requests


def search_cities(city):
    response = requests.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={
            "name": city,
            "count": 5,
            "language": "en",
            "format": "json",
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("results", [])

def get_forecast(latitude, longitude):
    response = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,relative_humidity_2m,"
                "apparent_temperature,weather_code,wind_speed_10m,is_day"
            ),
            "hourly": "temperature_2m,precipitation_probability",
            "daily": (
                "weather_code,temperature_2m_max,"
                "temperature_2m_min,precipitation_probability_max"
            ),
            "timezone": "auto",
            "forecast_days": 7,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()
