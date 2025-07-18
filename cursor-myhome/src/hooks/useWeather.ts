import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

interface OpenWeatherResponse {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    name: string;
    sys: {
        country: string;
    };
}

const weatherDescriptionKo: { [key: string]: string } = {
    'clear sky': '맑음',
    'few clouds': '구름 조금',
    'scattered clouds': '구름 낌',
    'broken clouds': '구름 많음',
    'shower rain': '소나기',
    rain: '비',
    thunderstorm: '천둥번개',
    snow: '눈',
    mist: '안개',
    'overcast clouds': '흐림',
    'light rain': '가벼운 비',
    'moderate rain': '보통 비',
    'heavy intensity rain': '강한 비',
    'very heavy rain': '매우 강한 비',
    'extreme rain': '폭우',
    'freezing rain': '얼어붙는 비',
    'light intensity shower rain': '가벼운 소나기',
    'heavy intensity shower rain': '강한 소나기',
    'light snow': '가벼운 눈',
    'heavy snow': '강한 눈',
    sleet: '진눈깨비',
    'light shower sleet': '가벼운 진눈깨비',
    'shower sleet': '진눈깨비 소나기',
    'light rain and snow': '가벼운 비와 눈',
    'rain and snow': '비와 눈',
    'light shower snow': '가벼운 눈 소나기',
    'shower snow': '눈 소나기',
    'heavy shower snow': '강한 눈 소나기',
    fog: '안개',
    haze: '실안개',
};

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 서울의 위도/경도 사용
                const lat = 37.5665;
                const lon = 126.978;
                const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

                if (!API_KEY) {
                    throw new Error('OpenWeather API 키가 설정되지 않았습니다');
                }

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`,
                );

                if (!response.ok) {
                    throw new Error('날씨 정보를 가져오는데 실패했습니다');
                }

                const data: OpenWeatherResponse = await response.json();

                // API 응답을 WeatherData 타입에 맞게 매핑
                const weatherData: WeatherData = {
                    main: {
                        temp: Math.round(data.main.temp),
                        feels_like: data.main.feels_like,
                        humidity: data.main.humidity,
                    },
                    weather: data.weather.map(w => ({
                        main: w.main,
                        description:
                            weatherDescriptionKo[w.description] ||
                            w.description,
                        icon: w.icon,
                    })),
                    name: data.name,
                    sys: {
                        country: data.sys.country,
                    },
                };

                setWeather(weatherData);
                setLoading(false);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : '알 수 없는 에러가 발생했습니다',
                );
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 1800000); // 30분마다 갱신

        return () => clearInterval(interval);
    }, []);

    return { weather, loading, error };
};
