import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WidgetData } from './weather';

export class WidgetBridge {
  private static readonly WIDGET_DATA_KEY = 'weather_data';

  /**
   * ウィジェット用データを保存する
   */
  static async saveWidgetData(widgetData: WidgetData): Promise<void> {
    try {
      const jsonData = JSON.stringify(widgetData);
      
      if (Platform.OS === 'android') {
        // Android: AsyncStorage経由でGlanceウィジェットに共有
        await AsyncStorage.setItem(WidgetBridge.WIDGET_DATA_KEY, jsonData);
        console.log('Android ウィジェット用データを保存しました');
      } else if (Platform.OS === 'ios') {
        // iOS: App Group経由でWidgetKitに共有
        // TODO: iOS実装時にApp Group設定が必要
        await AsyncStorage.setItem(WidgetBridge.WIDGET_DATA_KEY, jsonData);
        console.log('iOS ウィジェット用データを保存しました');
      }
    } catch (error) {
      console.error('ウィジェット用データの保存に失敗:', error);
    }
  }

  /**
   * ウィジェット用データを取得する
   */
  static async getWidgetData(): Promise<WidgetData | null> {
    try {
      const jsonData = await AsyncStorage.getItem(WidgetBridge.WIDGET_DATA_KEY);
      if (jsonData) {
        return JSON.parse(jsonData) as WidgetData;
      }
    } catch (error) {
      console.error('ウィジェット用データの取得に失敗:', error);
    }
    return null;
  }

  /**
   * ウィジェットを更新する
   */
  static async updateWidget(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        // Android: Glanceウィジェットの更新をトリガー
        // TODO: ネイティブモジュール経由でウィジェット更新
        console.log('Android ウィジェット更新をリクエスト');
      } else if (Platform.OS === 'ios') {
        // iOS: WidgetKitの更新をトリガー
        // TODO: ネイティブモジュール経由でウィジェット更新
        console.log('iOS ウィジェット更新をリクエスト');
      }
    } catch (error) {
      console.error('ウィジェット更新に失敗:', error);
    }
  }
} 