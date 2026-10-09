import { useState } from 'react'
import './App.css'

type City = {
  id: number
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

type Forecast = {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    wind_speed_10m: number
    weather_code: number
    is_day: number
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: (number | null)[]
  }
}

function getWeatherScene(code: number, isDay: number) {
  if (code === 45 || code === 48) return 'fog'

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
  ) {
    return 'rain'
  }

  if ([95, 96, 99].includes(code)) return 'storm'

  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'

  if (code === 2 || code === 3) return 'cloudy'

  if (code === 0 || code === 1) {
    return isDay === 1 ? 'sunny' : 'night'
  }

  return 'cloudy'
}

function WeatherAnimation({
  code,
  isDay,
}: {
  code: number
  isDay: number
}) {
  const scene = getWeatherScene(code, isDay)

  return (
    <div
      className={`weather-scene weather-scene--${scene}`}
      data-period={isDay === 1 ? 'day' : 'night'}
      aria-hidden="true"
    >
      <div className={isDay === 1 ? 'weather-sun' : 'weather-moon'} />

      {['cloudy', 'rain', 'storm', 'snow'].includes(scene) && (
        <>
          <div className="weather-cloud weather-cloud--one" />
          <div className="weather-cloud weather-cloud--two" />
        </>
      )}

      {['rain', 'storm', 'snow'].includes(scene) && (
        <div className="weather-particles">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className={scene === 'snow' ? 'weather-snowflake' : 'weather-raindrop'}
              style={{
                left: `${5 + index * 5}%`,
                animationDelay: `${(index % 6) * -0.4}s`,
                animationDuration: `${scene === 'snow' ? 4 + index % 3 : 0.8 + (index % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {scene === 'fog' && (
        <div className="weather-fog">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  )
}



function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [city, setCity] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

    async function loadWeather(location: City) {
    if (weatherLoading) return

    setSelectedCity(location)
    setForecast(null)
    setWeatherLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
      })

      const response = await fetch(`/api/forecast/?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Weather request failed.')
      }

      setForecast(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Please try again.',
      )
    } finally {
      setWeatherLoading(false)
    }
  }
  async function searchCities() {
    const query = city.trim()
    if (query.length < 2 || loading || weatherLoading) return

    setLoading(true)
    setError('')
    setResults([])
    setSelectedCity(null)
    setForecast(null)
    setSearched(false)

    try {
      const response = await fetch(
        `/api/cities/?city=${encodeURIComponent(query)}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'City search failed.')
      }

      setResults(data.results)
      setSearched(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>WeatherWatch</h1>
      <p>Your weather, clearly explained.</p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void searchCities()
        }}
      >
        <label htmlFor="city">City name</label>
        <input
          id="city"
          type="text"
          placeholder="Enter a city, e.g. Guntur"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          minLength={2}
          maxLength={100}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={city.trim().length < 2 || loading || weatherLoading}
        >
          {loading ? 'Searching…' : 'Search cities'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      <section aria-live="polite" aria-busy={loading}>
        {loading && <p>Finding matching cities…</p>}

        {searched && results.length === 0 && (
          <p>No cities found. Try another name.</p>
        )}

        {results.length > 0 && (
          <>
            <h2>Matching locations</h2>
            <ul>
              {results.map((location) => (
                 <li key={location.id}>
  <button
    type="button"
    onClick={() => void loadWeather(location)}
    disabled={loading || weatherLoading}
  >
    {[location.name, location.admin1, location.country]
      .filter(Boolean)
      .join(', ')}
  </button>
</li>
              ))}
            </ul>
          </>
        )}
      </section>
            <section aria-live="polite" aria-busy={weatherLoading}>
        {weatherLoading && <p>Loading weather…</p>}

        {selectedCity && forecast && (
          <>
          <WeatherAnimation
  code={forecast.current.weather_code}
  isDay={forecast.current.is_day}
/>
            <h2>
              {[selectedCity.name, selectedCity.admin1, selectedCity.country]
                .filter(Boolean)
                .join(', ')}
            </h2>

            <p>Temperature: {forecast.current.temperature_2m}°C</p>
            <p>Feels like: {forecast.current.apparent_temperature}°C</p>
            <p>Humidity: {forecast.current.relative_humidity_2m}%</p>
            <p>Wind speed: {forecast.current.wind_speed_10m} km/h</p>
                        <h3>7-day forecast</h3>

            <ul>
              {forecast.daily.time.map((date, index) => (
                <li key={date}>
                  <strong>
                    {new Date(`${date}T12:00:00`).toLocaleDateString(
                      'en-IN',
                      {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      },
                    )}
                  </strong>
                  <p>
                    High: {forecast.daily.temperature_2m_max[index]}°C
                    {' · '}
                    Low: {forecast.daily.temperature_2m_min[index]}°C
                  </p>
                  <p>
                    Chance of rain:{' '}
                    {forecast.daily.precipitation_probability_max[index]
                      == null
                      ? 'Unavailable'
                      : `${forecast.daily.precipitation_probability_max[index]}%`}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
            <footer>
        <p>
          Weather data by{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo
          </a>
        </p>
      </footer>
    </main>
  )
}

export default App