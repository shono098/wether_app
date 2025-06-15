import { useState, useEffect } from 'react';
import { WeatherData, WeatherService } from '../services/weather';
import { LocationInfo, LocationService } from '../services/location';

interface UseCachedWeatherReturn {
  weatherData: WeatherData | null;
  locationInfo: LocationInfo | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
}

export const useCachedWeather = (): UseCachedWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // 位置情報を取得
      const location = await LocationService.getCurrentPosition();
      setLocationInfo(location);

      // 天気データを取得
      const weather = await WeatherService.getWeatherData(location.latitude, location.longitude);
      setWeatherData(weather);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(errorMessage);
      console.error('天気データの取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初回マウント時にキャッシュから読み込み
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await WeatherService.getFromCache();
        if (cachedData) {
          setWeatherData(cachedData.data);
          console.log('キャッシュされた天気データを読み込みました');
        }
      } catch (err) {
        console.error('キャッシュの読み込みに失敗:', err);
      }
    };

    loadCachedData();
  }, []);

  return {
    weatherData,
    locationInfo,
    loading,
    error,
    refreshWeather,
  };
}; 