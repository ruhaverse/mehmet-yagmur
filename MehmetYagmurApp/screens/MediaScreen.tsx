import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  uri: string;
  thumbnail?: string;
  duration?: string;
  createdAt: Date;
}

export default function MediaScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'images' | 'videos'>('all');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      uri: 'https://picsum.photos/300/300?random=1',
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'video',
      uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/300/300?random=2',
      duration: '1:30',
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'image',
      uri: 'https://picsum.photos/300/300?random=3',
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: '4',
      type: 'image',
      uri: 'https://picsum.photos/300/300?random=4',
      createdAt: new Date(Date.now() - 10800000),
    },
    {
      id: '5',
      type: 'video',
      uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail: 'https://picsum.photos/300/300?random=5',
      duration: '2:45',
      createdAt: new Date(Date.now() - 14400000),
    },
    {
      id: '6',
      type: 'image',
      uri: 'https://picsum.photos/300/300?random=6',
      createdAt: new Date(Date.now() - 18000000),
    },
  ]);

  const filteredMedia = mediaItems.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'images') return item.type === 'image';
    if (selectedTab === 'videos') return item.type === 'video';
    return true;
  });

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity 
      style={styles.mediaItem}
      onPress={() => openMediaViewer(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.thumbnail || item.uri }} 
        style={styles.mediaImage}
        resizeMode="cover"
      />
      
      {item.type === 'video' && (
        <>
          <View style={styles.videoOverlay}>
            <Icon name="play-circle-filled" size={40} color="rgba(255,255,255,0.9)" />
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </>
      )}
      
      <View style={styles.dateOverlay}>
        <Text style={styles.dateText}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const openMediaViewer = (item: MediaItem) => {
    // Medya görüntüleyicisini aç
    console.log('Opening media viewer for:', item.id);
  };

  const openCamera = () => {
    // Kamera ekranını aç
    console.log('Opening camera');
  };

  const openGallery = () => {
    // Galeri seçicisini aç
    console.log('Opening gallery picker');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medya Galerisi</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCamera}>
          <Icon name="add-a-photo" size={24} color="#2196f3" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Icon 
            name="collections" 
            size={20} 
            color={selectedTab === 'all' ? '#2196f3' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            Tümü
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'images' && styles.activeTab]}
          onPress={() => setSelectedTab('images')}
        >
          <Icon 
            name="photo" 
            size={20} 
            color={selectedTab === 'images' ? '#2196f3' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'images' && styles.activeTabText]}>
            Fotoğraflar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'videos' && styles.activeTab]}
          onPress={() => setSelectedTab('videos')}
        >
          <Icon 
            name="videocam" 
            size={20} 
            color={selectedTab === 'videos' ? '#2196f3' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'videos' && styles.activeTabText]}>
            Videolar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media Grid */}
      <FlatList
        data={filteredMedia}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        style={styles.mediaGrid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="photo-library" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Henüz medya yok</Text>
          <Text style={styles.emptyMessage}>
            İlk fotoğraf veya videonuzu eklemek için + butonuna dokunun
          </Text>
          <TouchableOpacity style={styles.addMediaButton} onPress={openCamera}>
            <Icon name="add" size={24} color="#ffffff" />
            <Text style={styles.addMediaText}>Medya Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  mediaGrid: {
    flex: 1,
  },
  gridContainer: {
    padding: 2,
  },
  mediaItem: {
    width: (width - 8) / 3,
    height: (width - 8) / 3,
    margin: 1,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  dateOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addMediaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});