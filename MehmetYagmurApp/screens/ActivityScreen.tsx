import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share';
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
  message: string;
  timestamp: string;
  isRead: boolean;
  post?: {
    id: string;
    image?: string;
  };
}

export default function ActivityScreen({ navigation }: any) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    // Simulate loading activities
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'like',
        user: {
          id: '1',
          name: 'Alice Johnson',
          profilePicture: 'https://picsum.photos/40/40?random=1',
        },
        message: 'liked your post',
        timestamp: '2 hours ago',
        isRead: false,
        post: {
          id: '1',
          image: 'https://picsum.photos/50/50?random=10',
        },
      },
      {
        id: '2',
        type: 'comment',
        user: {
          id: '2',
          name: 'Bob Smith',
          profilePicture: 'https://picsum.photos/40/40?random=2',
        },
        message: 'commented on your post: "Great photo!"',
        timestamp: '4 hours ago',
        isRead: false,
        post: {
          id: '2',
          image: 'https://picsum.photos/50/50?random=11',
        },
      },
      {
        id: '3',
        type: 'follow',
        user: {
          id: '3',
          name: 'Carol Davis',
          profilePicture: 'https://picsum.photos/40/40?random=3',
        },
        message: 'started following you',
        timestamp: '1 day ago',
        isRead: true,
      },
      {
        id: '4',
        type: 'mention',
        user: {
          id: '4',
          name: 'David Wilson',
          profilePicture: 'https://picsum.photos/40/40?random=4',
        },
        message: 'mentioned you in a post',
        timestamp: '2 days ago',
        isRead: true,
        post: {
          id: '3',
          image: 'https://picsum.photos/50/50?random=12',
        },
      },
      {
        id: '5',
        type: 'share',
        user: {
          id: '5',
          name: 'Eva Brown',
          profilePicture: 'https://picsum.photos/40/40?random=5',
        },
        message: 'shared your post',
        timestamp: '3 days ago',
        isRead: true,
        post: {
          id: '4',
          image: 'https://picsum.photos/50/50?random=13',
        },
      },
    ];
    
    setActivities(mockActivities);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadActivities();
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return { name: 'favorite', color: '#e91e63' };
      case 'comment':
        return { name: 'comment', color: '#2196f3' };
      case 'follow':
        return { name: 'person-add', color: '#4caf50' };
      case 'mention':
        return { name: 'alternate-email', color: '#ff9800' };
      case 'share':
        return { name: 'share', color: '#9c27b0' };
      default:
        return { name: 'notifications', color: '#666' };
    }
  };

  const markAsRead = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isRead: true }
          : activity
      )
    );
  };

  const handleActivityPress = (activity: Activity) => {
    if (!activity.isRead) {
      markAsRead(activity.id);
    }

    // Navigate based on activity type
    if (activity.type === 'follow') {
      navigation.navigate('Profile', { userId: activity.user.id });
    } else if (activity.post) {
      navigation.navigate('PostDetail', { postId: activity.post.id });
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => !activity.isRead);

  const unreadCount = activities.filter(activity => !activity.isRead).length;

  const renderActivityItem = ({ item }: { item: Activity }) => {
    const icon = getActivityIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.activityItem,
          !item.isRead && styles.unreadActivity
        ]}
        onPress={() => handleActivityPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.activityContent}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: item.user.profilePicture }} 
              style={styles.profilePicture}
            />
            <View style={[styles.activityIcon, { backgroundColor: `${icon.color}20` }]}>
              <Icon name={icon.name} size={12} color={icon.color} />
            </View>
          </View>
          
          <View style={styles.activityText}>
            <Text style={styles.activityMessage}>
              <Text style={styles.userName}>{item.user.name}</Text>
              {' ' + item.message}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          
          {item.post?.image && (
            <Image 
              source={{ uri: item.post.image }} 
              style={styles.postThumbnail}
            />
          )}
        </View>
        
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity onPress={() => {/* Mark all as read */}}>
          <Text style={styles.markAllRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'all' && styles.activeFilterTab
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterTabText,
            filter === 'all' && styles.activeFilterTabText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'unread' && styles.activeFilterTab
          ]}
          onPress={() => setFilter('unread')}
        >
          <View style={styles.filterTabWithBadge}>
            <Text style={[
              styles.filterTabText,
              filter === 'unread' && styles.activeFilterTabText
            ]}>
              Unread
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Activities List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivityItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="notifications" size={64} color="#ddd" />
            <Text style={styles.emptyText}>No activities yet</Text>
            <Text style={styles.emptySubText}>
              When someone interacts with your posts, you'll see it here
            </Text>
          </View>
        )}
      />
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  markAllRead: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#2196f3',
  },
  filterTabText: {
    fontSize: 16,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  filterTabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  activityItem: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadActivity: {
    backgroundColor: '#f8f9ff',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    position: 'relative',
    marginRight: 12,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activityIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  activityText: {
    flex: 1,
    marginRight: 12,
  },
  activityMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  userName: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196f3',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});