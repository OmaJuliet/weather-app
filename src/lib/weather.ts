const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export async function fetchCurrentWeather(lat: number, lon: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  return res.json();
}

export async function fetchForecast(lat: number, lon: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();
  return data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
}
