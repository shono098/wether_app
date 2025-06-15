import * as Location from 'expo-location';

export interface LocationInfo {
  name: string;
  coords: string;
  latitude: number;
  longitude: number;
}

export class LocationService {
  /**
   * 現在位置を取得する
   */
  static async getCurrentPosition(): Promise<LocationInfo> {
    // 位置情報の許可を要求
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('位置情報の許可が必要です');
    }

    // 現在位置を取得
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    // 地名を取得
    const locationName = await LocationService.getLocationName(latitude, longitude);

    return {
      name: locationName,
      coords: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      latitude,
      longitude,
    };
  }

  /**
   * 座標から地名を取得する
   */
  static async getLocationName(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ja`
      );
      
      if (!response.ok) {
        throw new Error('地名の取得に失敗しました');
      }

      const data = await response.json();
      
      // 日本語の地名を優先的に取得
      const address = data.address || {};
      const locationName = 
        address.city || 
        address.town || 
        address.village || 
        address.county || 
        address.state || 
        '不明な場所';

      return locationName;
    } catch (error) {
      console.error('地名取得エラー:', error);
      return `緯度: ${latitude.toFixed(2)}, 経度: ${longitude.toFixed(2)}`;
    }
  }
} 