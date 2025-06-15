import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { WidgetBridge } from './widget-bridge';

export interface WeatherData {
  today: DayWeather;
  tomorrow: DayWeather;
}

export interface DayWeather {
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  weatherCode: number;
}

export interface WeatherCache {
  data: WeatherData;
  cachedAt: number;
}

export interface WidgetData {
  temperature: number;
  rainProbability: number;
  weatherCode: number;
  dogImage: string;
  lastUpdated: string;
}

export class WeatherService {
  private static readonly CACHE_KEY = 'weatherCache';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30分

  /**
   * 天気データを取得する
   */
  static async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Asia/Tokyo&forecast_days=2`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('天気情報の取得に失敗しました');
      }

      const data = await response.json();
      const weatherData = WeatherService.processWeatherData(data);
      
      // キャッシュに保存
      await WeatherService.saveToCache(weatherData);
      
      // ウィジェット用データを保存
      await WeatherService.saveForWidget(weatherData);
      
      // ウィジェットブリッジ経由でも保存
      const widgetData: WidgetData = {
        temperature: weatherData.today.maxTemp,
        rainProbability: weatherData.today.rainProbability,
        weatherCode: weatherData.today.weatherCode,
        dogImage: WeatherService.getDogImageForWeather(weatherData.today.maxTemp, weatherData.today.rainProbability),
        lastUpdated: new Date().toISOString(),
      };
      await WidgetBridge.saveWidgetData(widgetData);
      
      return weatherData;
    } catch (error) {
      // API エラー時はキャッシュから取得を試行
      const cachedData = await WeatherService.getFromCache();
      if (cachedData) {
        console.log('API エラー: キャッシュデータを使用');
        // ウィジェット用データも更新
        await WeatherService.saveForWidget(cachedData.data);
        return cachedData.data;
      }
      throw error;
    }
  }

  /**
   * 天気データを処理する
   */
  static processWeatherData(data: any): WeatherData {
    const { daily } = data;
    const today: DayWeather = {
      maxTemp: Math.round(daily.temperature_2m_max[0]),
      minTemp: Math.round(daily.temperature_2m_min[0]),
      rainProbability: daily.precipitation_probability_max[0] || 0,
      weatherCode: daily.weather_code[0],
    };

    const tomorrow: DayWeather = {
      maxTemp: Math.round(daily.temperature_2m_max[1]),
      minTemp: Math.round(daily.temperature_2m_min[1]),
      rainProbability: daily.precipitation_probability_max[1] || 0,
      weatherCode: daily.weather_code[1],
    };

    return { today, tomorrow };
  }

  /**
   * 天気コードから天気の説明を取得する
   */
  static getWeatherDescription(weatherCode: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: '快晴',
      1: '晴れ',
      2: '一部曇り',
      3: '曇り',
      45: '霧',
      48: '霧氷',
      51: '小雨',
      53: '雨',
      55: '大雨',
      61: '小雨',
      63: '雨',
      65: '大雨',
      71: '小雪',
      73: '雪',
      75: '大雪',
      95: '雷雨',
    };
    return weatherCodes[weatherCode] || '不明';
  }

  /**
   * 摂氏から華氏に変換する
   */
  static toFahrenheit(celsius: number): number {
    return Math.round((celsius * 9 / 5) + 32);
  }

  /**
   * キャッシュに保存する
   */
  static async saveToCache(weatherData: WeatherData): Promise<void> {
    const cacheData: WeatherCache = {
      data: weatherData,
      cachedAt: Date.now()
    };
    await AsyncStorage.setItem(WeatherService.CACHE_KEY, JSON.stringify(cacheData));
    console.log('天気データをキャッシュに保存しました');
  }

  /**
   * キャッシュから取得する
   */
  static async getFromCache(): Promise<WeatherCache | null> {
    try {
      const cached = await AsyncStorage.getItem(WeatherService.CACHE_KEY);
      if (cached) {
        const cacheData: WeatherCache = JSON.parse(cached);
        // キャッシュの有効期限をチェック
        if (Date.now() - cacheData.cachedAt < WeatherService.CACHE_DURATION) {
          return cacheData;
        }
      }
    } catch (error) {
      console.error('キャッシュの読み込みに失敗:', error);
    }
    return null;
  }

  /**
   * ウィジェット用データを保存する
   */
  static async saveForWidget(weatherData: WeatherData): Promise<void> {
    try {
      const { today } = weatherData;
      const dogImage = WeatherService.getDogImageForWeather(today.maxTemp, today.rainProbability);
      
      const widgetData: WidgetData = {
        temperature: today.maxTemp,
        rainProbability: today.rainProbability,
        weatherCode: today.weatherCode,
        dogImage,
        lastUpdated: new Date().toISOString(),
      };

      const path = `${FileSystem.documentDirectory}weather.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(widgetData));
      console.log('ウィジェット用データを保存しました:', path);
    } catch (error) {
      console.error('ウィジェット用データの保存に失敗:', error);
    }
  }

  /**
   * 天気条件に基づいて柴犬画像を決定する
   */
  static getDogImageForWeather(temperature: number, rainProbability: number): string {
    // レインコート優先（雨確率60%以上）
    if (rainProbability >= 60) {
      return 'dog_raincoat_umbrella';
    }

    // 温度帯別の判定
    if (temperature >= 25) {
      // 25℃以上 - 晴れの場合は帽子
      if (rainProbability < 30) {
        return 'dog_tshirt_hat';
      } else if (rainProbability < 60) {
        return 'dog_tshirt_foldumbrella';
      } else {
        return 'dog_tshirt_umbrella';
      }
    } else if (temperature >= 22) {
      // 22-25℃ - 半袖
      if (rainProbability < 30) {
        return 'dog_tshirt';
      } else if (rainProbability < 60) {
        return 'dog_tshirt_foldumbrella';
      } else {
        return 'dog_tshirt_umbrella';
      }
    } else if (temperature >= 15) {
      // 15-22℃ - 長袖
      if (rainProbability < 30) {
        return 'dog_longsleeve';
      } else if (rainProbability < 60) {
        return 'dog_longsleeve_foldumbrella';
      } else {
        return 'dog_longsleeve_umbrella';
      }
    } else if (temperature >= 5) {
      // 5-15℃ - ジャケット
      if (rainProbability < 30) {
        return 'dog_jacket';
      } else if (rainProbability < 60) {
        return 'dog_jacket_foldumbrella';
      } else {
        return 'dog_jacket_umbrella';
      }
    } else {
      // 5℃未満 - コート
      if (rainProbability < 30) {
        return 'dog_coat_scarf_gloves';
      } else if (rainProbability < 60) {
        return 'dog_coat_foldumbrella_scarf_gloves';
      } else {
        return 'dog_coat_umbrella_scarf_gloves';
      }
    }
  }
} 