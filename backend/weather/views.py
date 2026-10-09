import requests
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import search_cities, get_forecast


@require_GET
def health(request):
    return JsonResponse({
        "status": "ok",
        "service": "WeatherWatch API",
    })


@api_view(["GET"])
def cities(request):
    city = request.query_params.get("city", "").strip()

    if not 2 <= len(city) <= 100:
        return Response(
            {"error": "Enter a city name between 2 and 100 characters."},
            status=400,
        )

    try:
        results = search_cities(city)
    except requests.exceptions.Timeout:
        return Response(
            {"error": "City search timed out. Please try again."},
            status=504,
        )
    except (requests.exceptions.RequestException, ValueError):
        return Response(
            {"error": "City search is unavailable. Please try again."},
            status=502,
        )

    return Response({"results": results})


@api_view(["GET"])
def forecast(request):
    try:
        latitude = float(request.query_params.get("latitude", ""))
        longitude = float(request.query_params.get("longitude", ""))
    except (TypeError, ValueError):
        return Response(
            {"error": "Provide valid latitude and longitude."},
            status=400,
        )

    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        return Response(
            {"error": "Latitude or longitude is out of range."},
            status=400,
        )

    try:
        data = get_forecast(latitude, longitude)
    except requests.exceptions.Timeout:
        return Response(
            {"error": "Weather request timed out. Please try again."},
            status=504,
        )
    except (requests.exceptions.RequestException, ValueError):
        return Response(
            {"error": "Weather data is unavailable. Please try again."},
            status=502,
        )

    return Response(data)