import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SwapItem {
  id: string;
  title: string;
  description: string;
  category: 'electronics' | 'clothing' | 'books' | 'furniture' | 'sports' | 'games' | 'collectibles' | 'other';
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerImage: string;
  ownerRating: number;
  location: string;
  distance?: number;
  createdAt: string;
  isAvailable: boolean;
  tags: string[];
  wantedItems?: string[];
  swapType: 'direct' | 'multi' | 'cash-plus';
  featured: boolean;
  viewCount: number;
  interestedCount: number;
}

interface SwapCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SwapScreen({ navigation }: any) {
  const [swapItems, setSwapItems] = useState<SwapItem[]>([]);
  const [categories, setCategories] = useState<SwapCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'distance' | 'value' | 'popular'>('recent');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data
  useEffect(() => {
    setCategories([
      { id: 'all', name: 'All Items', icon: '📦', count: 150 },
      { id: 'electronics', name: 'Electronics', icon: '📱', count: 42 },
      { id: 'clothing', name: 'Clothing', icon: '👕', count: 35 },
      { id: 'books', name: 'Books', icon: '📚', count: 28 },
      { id: 'furniture', name: 'Furniture', icon: '🪑', count: 20 },
      { id: 'sports', name: 'Sports', icon: '⚽', count: 18 },
      { id: 'games', name: 'Games', icon: '🎮', count: 25 },
      { id: 'collectibles', name: 'Collectibles', icon: '💎', count: 12 },
    ]);

    setSwapItems([
      {
        id: 'swap1',
        title: 'iPhone 14 Pro - Space Black',
        description: 'Excellent condition iPhone 14 Pro with all original accessories. Screen protector applied since day one. Looking to swap for Samsung Galaxy S24 Ultra or similar Android flagship.',
        category: 'electronics',
        condition: 'like-new',
        estimatedValue: 900,
        images: [
          'https://picsum.photos/300/300?random=501',
          'https://picsum.photos/300/300?random=502',
          'https://picsum.photos/300/300?random=503',
        ],
        ownerId: 'user1',
        ownerName: 'Alex Tech',
        ownerImage: 'https://picsum.photos/50/50?random=1',
        ownerRating: 4.8,
        location: 'San Francisco, CA',
        distance: 2.5,
        createdAt: '2024-01-15',
        isAvailable: true,
        tags: ['smartphone', 'apple', 'flagship', 'unlocked'],
        wantedItems: ['Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro'],
        swapType: 'direct',
        featured: true,
        viewCount: 125,
        interestedCount: 8,
      },
      {
        id: 'swap2',
        title: 'Vintage Leather Jacket',
        description: 'Genuine leather jacket from the 80s. Classic style, fits medium size. Some wear but adds character. Perfect for collectors or vintage enthusiasts.',
        category: 'clothing',
        condition: 'good',
        estimatedValue: 150,
        images: [
          'https://picsum.photos/300/300?random=504',
          'https://picsum.photos/300/300?random=505',
        ],
        ownerId: 'user2',
        ownerName: 'Sarah Vintage',
        ownerImage: 'https://picsum.photos/50/50?random=2',
        ownerRating: 4.6,
        location: 'New York, NY',
        distance: 5.2,
        createdAt: '2024-01-14',
        isAvailable: true,
        tags: ['vintage', 'leather', 'jacket', 'retro'],
        wantedItems: ['Designer handbag', 'Vintage boots'],
        swapType: 'multi',
        featured: false,
        viewCount: 89,
        interestedCount: 5,
      },
      {
        id: 'swap3',
        title: 'Complete Harry Potter Book Set',
        description: 'All 7 Harry Potter books in hardcover. Excellent condition, barely used. Perfect for collectors or fans who want to own the physical collection.',
        category: 'books',
        condition: 'like-new',
        estimatedValue: 120,
        images: [
          'https://picsum.photos/300/300?random=506',
          'https://picsum.photos/300/300?random=507',
        ],
        ownerId: 'user3',
        ownerName: 'Book Lover',
        ownerImage: 'https://picsum.photos/50/50?random=3',
        ownerRating: 4.9,
        location: 'Los Angeles, CA',
        distance: 1.8,
        createdAt: '2024-01-13',
        isAvailable: true,
        tags: ['books', 'harry-potter', 'hardcover', 'collection'],
        wantedItems: ['Lord of the Rings set', 'Game of Thrones books'],
        swapType: 'direct',
        featured: false,
        viewCount: 67,
        interestedCount: 12,
      },
      {
        id: 'swap4',
        title: 'Gaming Setup - Monitor & Accessories',
        description: '27" 4K gaming monitor + mechanical keyboard + gaming mouse. Perfect setup for serious gamers. Monitor has excellent color accuracy and low input lag.',
        category: 'games',
        condition: 'good',
        estimatedValue: 450,
        images: [
          'https://picsum.photos/300/300?random=508',
          'https://picsum.photos/300/300?random=509',
          'https://picsum.photos/300/300?random=510',
        ],
        ownerId: 'user4',
        ownerName: 'Pro Gamer',
        ownerImage: 'https://picsum.photos/50/50?random=4',
        ownerRating: 4.7,
        location: 'Austin, TX',
        distance: 8.1,
        createdAt: '2024-01-12',
        isAvailable: true,
        tags: ['gaming', 'monitor', 'keyboard', 'mouse', '4k'],
        wantedItems: ['PlayStation 5', 'Xbox Series X', 'VR Headset'],
        swapType: 'cash-plus',
        featured: true,
        viewCount: 156,
        interestedCount: 15,
      },
      {
        id: 'swap5',
        title: 'Professional Camera Lens',
        description: 'Canon EF 50mm f/1.4 lens in excellent condition. Perfect for portraits and low light photography. Includes original box and lens caps.',
        category: 'electronics',
        condition: 'like-new',
        estimatedValue: 300,
        images: [
          'https://picsum.photos/300/300?random=511',
        ],
        ownerId: 'user5',
        ownerName: 'Photo Pro',
        ownerImage: 'https://picsum.photos/50/50?random=5',
        ownerRating: 4.9,
        location: 'Seattle, WA',
        distance: 12.3,
        createdAt: '2024-01-11',
        isAvailable: true,
        tags: ['camera', 'lens', 'canon', 'photography', '50mm'],
        wantedItems: ['85mm lens', 'Camera flash', 'Tripod'],
        swapType: 'direct',
        featured: false,
        viewCount: 94,
        interestedCount: 7,
      },
      {
        id: 'swap6',
        title: 'Antique Wooden Chair',
        description: 'Beautiful antique wooden chair from early 1900s. Solid wood construction, some minor scratches but structurally sound. Great for collectors.',
        category: 'furniture',
        condition: 'fair',
        estimatedValue: 80,
        images: [
          'https://picsum.photos/300/300?random=512',
          'https://picsum.photos/300/300?random=513',
        ],
        ownerId: 'user6',
        ownerName: 'Antique Hunter',
        ownerImage: 'https://picsum.photos/50/50?random=6',
        ownerRating: 4.5,
        location: 'Boston, MA',
        distance: 15.7,
        createdAt: '2024-01-10',
        isAvailable: false,
        tags: ['antique', 'furniture', 'wooden', 'vintage', 'chair'],
        wantedItems: ['Vintage lamp', 'Old paintings'],
        swapType: 'multi',
        featured: false,
        viewCount: 43,
        interestedCount: 3,
      },
    ]);
  }, []);

  const filteredItems = swapItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = filterCondition === 'all' || item.condition === filterCondition;
    const isAvailable = item.isAvailable;

    return matchesSearch && matchesCategory && matchesCondition && isAvailable;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      case 'value':
        return b.estimatedValue - a.estimatedValue;
      case 'popular':
        return b.interestedCount - a.interestedCount;
      default:
        return 0;
    }
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleItemPress = (item: SwapItem) => {
    navigation.navigate('SwapItemDetail', { itemId: item.id, itemData: item });
  };

  const handleInterest = (itemId: string) => {
    setSwapItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, interestedCount: item.interestedCount + 1 }
        : item
    ));
    Alert.alert('Interest Sent!', 'The owner has been notified of your interest.');
  };

  const formatValue = (value: number): string => {
    return `$${value.toLocaleString()}`;
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Unknown distance';
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`;
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'new': return '#4caf50';
      case 'like-new': return '#8bc34a';
      case 'good': return '#ff9800';
      case 'fair': return '#ff5722';
      case 'poor': return '#f44336';
      default: return '#666';
    }
  };

  const renderSwapItem = (item: SwapItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.itemCard, item.featured && styles.featuredCard]}
      onPress={() => handleItemPress(item)}
    >
      {/* Item Images */}
      <View style={styles.imageContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
          {item.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.itemImage} />
          ))}
        </ScrollView>
        
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}

        {item.swapType === 'cash-plus' && (
          <View style={styles.cashPlusBadge}>
            <Text style={styles.cashPlusText}>💰 Cash+</Text>
          </View>
        )}

        <View style={styles.imageOverlay}>
          <Text style={styles.imageCount}>{item.images.length} photos</Text>
        </View>
      </View>

      {/* Item Info */}
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemValue}>{formatValue(item.estimatedValue)}</Text>
        </View>

        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.itemMeta}>
          <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) }]}>
            <Text style={styles.conditionText}>{item.condition}</Text>
          </View>
          <Text style={styles.categoryText}>{categories.find(c => c.id === item.category)?.name}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTags}>+{item.tags.length - 3}</Text>
          )}
        </View>

        {/* Owner Info */}
        <View style={styles.ownerInfo}>
          <Image source={{ uri: item.ownerImage }} style={styles.ownerImage} />
          <View style={styles.ownerDetails}>
            <Text style={styles.ownerName}>{item.ownerName}</Text>
            <View style={styles.ownerMeta}>
              <Text style={styles.rating}>⭐ {item.ownerRating}</Text>
              <Text style={styles.location}>📍 {formatDistance(item.distance)}</Text>
            </View>
          </View>
        </View>

        {/* Wanted Items */}
        {item.wantedItems && item.wantedItems.length > 0 && (
          <View style={styles.wantedSection}>
            <Text style={styles.wantedTitle}>Looking for:</Text>
            <Text style={styles.wantedItems} numberOfLines={1}>
              {item.wantedItems.join(', ')}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.itemStats}>
          <Text style={styles.statText}>👁 {item.viewCount} views</Text>
          <Text style={styles.statText}>💝 {item.interestedCount} interested</Text>
          <Text style={styles.statText}>
            📅 {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.interestButton}
        onPress={() => handleInterest(item.id)}
      >
        <Text style={styles.interestButtonText}>I'm Interested</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Swap & Trade</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('SwapHistoryScreen')}
          >
            <Text style={styles.headerIcon}>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.headerIcon}>➕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search items to swap..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.activeCategoryTab
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'recent', label: 'Recent', icon: '🕐' },
            { key: 'distance', label: 'Nearest', icon: '📍' },
            { key: 'value', label: 'Value', icon: '💰' },
            { key: 'popular', label: 'Popular', icon: '🔥' },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[
                styles.sortTab,
                sortBy === sort.key && styles.activeSortTab
              ]}
              onPress={() => setSortBy(sort.key as any)}
            >
              <Text style={styles.sortIcon}>{sort.icon}</Text>
              <Text style={[
                styles.sortText,
                sortBy === sort.key && styles.activeSortText
              ]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items List */}
      <ScrollView
        style={styles.itemsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sortedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery 
                ? "Try searching with different keywords"
                : "Be the first to list an item for swap!"
              }
            </Text>
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addItemText}>Add Item to Swap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedItems.map(renderSwapItem)
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Item to Swap</Text>
            <TouchableOpacity onPress={() => {
              setShowAddModal(false);
              navigation.navigate('AddSwapItem');
            }}>
              <Text style={styles.modalNext}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              List your items and start swapping with the community! 
              You can trade for other items, add cash, or find exactly what you're looking for.
            </Text>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>📱</Text>
                <Text style={styles.quickActionText}>Electronics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>👕</Text>
                <Text style={styles.quickActionText}>Clothing</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>📚</Text>
                <Text style={styles.quickActionText}>Books</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🎮</Text>
                <Text style={styles.quickActionText}>Games</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => {
              setSelectedCategory('all');
              setFilterCondition('all');
              setSortBy('recent');
              setShowFilters(false);
            }}>
              <Text style={styles.modalReset}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Condition</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'All Conditions' },
                  { key: 'new', label: 'New' },
                  { key: 'like-new', label: 'Like New' },
                  { key: 'good', label: 'Good' },
                  { key: 'fair', label: 'Fair' },
                  { key: 'poor', label: 'Poor' },
                ].map((condition) => (
                  <TouchableOpacity
                    key={condition.key}
                    style={[
                      styles.filterOption,
                      filterCondition === condition.key && styles.activeFilterOption
                    ]}
                    onPress={() => setFilterCondition(condition.key)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filterCondition === condition.key && styles.activeFilterOptionText
                    ]}>
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categories: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  activeCategoryTab: {
    backgroundColor: '#e3f2fd',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeCategoryText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  sortContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sortTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeSortTab: {
    backgroundColor: '#2196f3',
  },
  sortIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  activeSortText: {
    color: '#ffffff',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  itemImage: {
    width: screenWidth - 32,
    height: 200,
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ff9800',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  cashPlusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cashPlusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCount: {
    fontSize: 12,
    color: '#ffffff',
  },
  itemInfo: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  itemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4caf50',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#2196f3',
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 11,
    color: '#666',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ownerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ownerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#ff9800',
    marginRight: 12,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  wantedSection: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  wantedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 4,
  },
  wantedItems: {
    fontSize: 14,
    color: '#333',
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: '#888',
  },
  interestButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  interestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  addItemButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addItemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalNext: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalReset: {
    fontSize: 16,
    color: '#f44336',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  activeFilterOptionText: {
    color: '#2196f3',
    fontWeight: '600',
  },
});