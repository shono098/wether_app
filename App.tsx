import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WeatherCard } from './src/components/WeatherCard';
import { OutfitList } from './src/components/OutfitList';
import { FeelTempSlider } from './src/components/FeelTempSlider';
import { useCachedWeather } from './src/hooks/useCachedWeather';
import { OutfitService } from './src/services/outfit';

export default function App() {
  const { weatherData, locationInfo, loading, error, refreshWeather } = useCachedWeather();
  const [feelTempAdjustment, setFeelTempAdjustment] = useState(0);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  // 初回データ取得
  useEffect(() => {
    refreshWeather();
  }, []);

  // 服装提案を計算
  const outfitSuggestions = weatherData 
    ? OutfitService.getSuggestion(weatherData, feelTempAdjustment)
    : [];

  const handleRefresh = async () => {
    try {
      await refreshWeather();
    } catch (err) {
      Alert.alert('エラー', '天気データの更新に失敗しました');
    }
  };

  const toggleTemperatureUnit = () => {
    setIsFahrenheit(!isFahrenheit);
  };

  if (loading && !weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>天気データを取得中...</Text>
      </View>
    );
  }

  if (error && !weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>再試行</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>天気 × 服装提案</Text>
        {locationInfo && (
          <Text style={styles.locationText}>📍 {locationInfo.name}</Text>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {weatherData && (
          <>
            {/* 天気カード */}
            <WeatherCard 
              weatherData={weatherData} 
              isFahrenheit={isFahrenheit}
            />

            {/* 体感温度調整スライダー */}
            <FeelTempSlider
              value={feelTempAdjustment}
              onValueChange={setFeelTempAdjustment}
            />

            {/* 服装提案リスト */}
            <OutfitList items={outfitSuggestions} />
          </>
        )}

        {/* コントロールボタン */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={toggleTemperatureUnit}
          >
            <Text style={styles.controlButtonText}>
              {isFahrenheit ? '°C' : '°F'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, loading && styles.disabledButton]} 
            onPress={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={styles.controlButtonText}>🔄 更新</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* エラー表示（データがある場合） */}
        {error && weatherData && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>⚠️ {error}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  controlButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  warningContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
}); 