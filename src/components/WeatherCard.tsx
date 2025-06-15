import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData, WeatherService } from '../services/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
  isFahrenheit?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weatherData, 
  isFahrenheit = false 
}) => {
  const { today, tomorrow } = weatherData;

  const formatTemp = (temp: number) => {
    const displayTemp = isFahrenheit ? WeatherService.toFahrenheit(temp) : temp;
    const unit = isFahrenheit ? '°F' : '°C';
    return `${displayTemp}${unit}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardRow}>
        {/* 今日の天気 */}
        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>今日</Text>
          <Text style={styles.temperature}>{formatTemp(today.maxTemp)}</Text>
          <Text style={styles.detail}>降水確率: {today.rainProbability}%</Text>
          <Text style={styles.detail}>
            {WeatherService.getWeatherDescription(today.weatherCode)}
          </Text>
        </View>

        {/* 明日の天気 */}
        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>明日</Text>
          <Text style={styles.temperature}>{formatTemp(tomorrow.maxTemp)}</Text>
          <Text style={styles.detail}>降水確率: {tomorrow.rainProbability}%</Text>
          <Text style={styles.detail}>
            {WeatherService.getWeatherDescription(tomorrow.weatherCode)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  weatherCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
}); 