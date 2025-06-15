import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface FeelTempSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const FeelTempSlider = ({ value, onValueChange }: FeelTempSliderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>体感温度調整</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>寒がり</Text>
        <Slider
          style={styles.slider}
          minimumValue={-10}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E5E5EA"
          thumbStyle={styles.thumb}
        />
        <Text style={styles.label}>暑がり</Text>
      </View>
      <Text style={styles.valueText}>
        調整: {value >= 0 ? '+' : ''}{value}度
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    minWidth: 60,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 16,
  },
  thumb: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
  },
  valueText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
}); 