import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface OutfitListProps {
  items: string[];
}

export const OutfitList = ({ items }: OutfitListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👕 おすすめの服装</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.outfitItem}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  outfitItem: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1976d2',
  },
}); 