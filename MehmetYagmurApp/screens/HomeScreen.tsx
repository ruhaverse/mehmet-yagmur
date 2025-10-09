import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const posts = useSelector((state: RootState) => state.posts);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#333333',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      textAlign: 'center',
    },
    menuContainer: {
      marginTop: 30,
    },
    menuItem: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
      padding: 20,
      marginBottom: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#333333' : '#e9ecef',
    },
    menuText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#333333',
      textAlign: 'center',
    },
    version: {
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      fontSize: 12,
      color: isDarkMode ? '#666666' : '#999999',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mehmet Yağmur</Text>
          <Text style={styles.subtitle}>
            Modern React Native{'\n'}Mobile Application
          </Text>
          <Text style={styles.subtitle}>
            📊 Redux Store Entegre Edildi
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.menuText}>👤 Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.menuText}>⚙️ Ayarlar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>📱 Özellikler</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>📞 İletişim</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Text style={styles.version}>v1.0.0 - React Native 0.81.4</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;