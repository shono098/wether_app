import { WeatherData } from './weather';

export class OutfitService {
  /**
   * 天気データと体感温度調整に基づいて服装を提案する
   */
  static getSuggestion(weatherData: WeatherData, feelTempAdjustment: number = 0): string[] {
    const { today } = weatherData;
    const adjustedTemp = today.maxTemp + feelTempAdjustment;
    const rainProbability = today.rainProbability;

    const items: string[] = [];

    // 基本の服装を決定
    if (adjustedTemp >= 25) {
      items.push('半袖シャツ', '短パン', 'サンダル');
      if (adjustedTemp >= 30) {
        items.push('帽子', '日焼け止め');
      }
    } else if (adjustedTemp >= 20) {
      items.push('半袖シャツ', '長ズボン', 'スニーカー');
    } else if (adjustedTemp >= 15) {
      items.push('長袖シャツ', '長ズボン', 'スニーカー');
    } else if (adjustedTemp >= 10) {
      items.push('薄手のセーター', '長ズボン', 'スニーカー');
    } else if (adjustedTemp >= 5) {
      items.push('厚手のセーター', 'ジャケット', '長ズボン', 'ブーツ');
    } else {
      items.push('コート', 'セーター', '長ズボン', 'ブーツ', '手袋', 'マフラー');
    }

    // 雨具を追加
    if (rainProbability >= 70) {
      items.push('傘', 'レインコート');
    } else if (rainProbability >= 30) {
      items.push('折りたたみ傘');
    }

    // 特別な天気条件
    if (today.weatherCode >= 71 && today.weatherCode <= 75) {
      // 雪の場合
      items.push('防水ブーツ', '厚手の靴下');
    }

    return items;
  }

  /**
   * 温度帯に基づく基本的な服装カテゴリを取得
   */
  static getClothingCategory(temperature: number): string {
    if (temperature >= 25) return '夏服';
    if (temperature >= 20) return '春秋服（軽装）';
    if (temperature >= 15) return '春秋服';
    if (temperature >= 10) return '秋冬服（軽装）';
    if (temperature >= 5) return '秋冬服';
    return '冬服';
  }

  /**
   * 雨確率に基づく雨具の提案
   */
  static getRainGear(rainProbability: number): string[] {
    if (rainProbability >= 70) {
      return ['傘', 'レインコート', '防水靴'];
    } else if (rainProbability >= 50) {
      return ['傘', 'レインコート'];
    } else if (rainProbability >= 30) {
      return ['折りたたみ傘'];
    }
    return [];
  }
} 