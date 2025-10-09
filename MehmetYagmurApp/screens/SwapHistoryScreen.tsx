import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SwapTransaction {
  id: string;
  type: 'sent' | 'received';
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
  
  // Items
  myItems: SwapItem[];
  theirItems: SwapItem[];
  cashAmount?: number;
  
  // Partner info
  partnerId: string;
  partnerName: string;
  partnerImage: string;
  partnerRating: number;
  
  // Transaction details
  totalValue: number;
  serviceFee: number;
  shippingCost?: number;
  trackingNumber?: string;
  
  // Messages
  lastMessage?: string;
  unreadCount: number;
}

interface SwapItem {
  id: string;
  title: string;
  condition: string;
  estimatedValue: number;
  images: string[];
}

export default function SwapHistoryScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState<SwapTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SwapTransaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Mock data
    setTransactions([
      {
        id: 'tx1',
        type: 'sent',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        myItems: [
          {
            id: 'my1',
            title: 'Samsung Galaxy S23 Ultra',
            condition: 'good',
            estimatedValue: 850,
            images: ['https://picsum.photos/300/300?random=601'],
          }
        ],
        theirItems: [
          {
            id: 'their1',
            title: 'iPhone 14 Pro - Space Black',
            condition: 'like-new',
            estimatedValue: 900,
            images: ['https://picsum.photos/300/300?random=501'],
          }
        ],
        cashAmount: 50,
        partnerId: 'user1',
        partnerName: 'Alex Tech',
        partnerImage: 'https://picsum.photos/50/50?random=1',
        partnerRating: 4.8,
        totalValue: 900,
        serviceFee: 27,
        shippingCost: 25,
        lastMessage: 'Thanks for the offer! Let me think about it.',
        unreadCount: 1,
      },
      {
        id: 'tx2',
        type: 'received',
        status: 'accepted',
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        myItems: [
          {
            id: 'my2',
            title: 'Vintage Leather Jacket',
            condition: 'good',
            estimatedValue: 150,
            images: ['https://picsum.photos/300/300?random=504'],
          }
        ],
        theirItems: [
          {
            id: 'their2',
            title: 'Designer Handbag',
            condition: 'like-new',
            estimatedValue: 180,
            images: ['https://picsum.photos/300/300?random=602'],
          }
        ],
        partnerId: 'user2',
        partnerName: 'Fashion Lover',
        partnerImage: 'https://picsum.photos/50/50?random=2',
        partnerRating: 4.6,
        totalValue: 180,
        serviceFee: 0,
        lastMessage: 'Great! I accepted your trade request.',
        unreadCount: 0,
      },
      {
        id: 'tx3',
        type: 'sent',
        status: 'shipped',
        createdAt: '2024-01-10T12:00:00Z',
        updatedAt: '2024-01-14T16:30:00Z',
        myItems: [
          {
            id: 'my3',
            title: 'Complete Harry Potter Book Set',
            condition: 'like-new',
            estimatedValue: 120,
            images: ['https://picsum.photos/300/300?random=506'],
          }
        ],
        theirItems: [
          {
            id: 'their3',
            title: 'Lord of the Rings Set',
            condition: 'good',
            estimatedValue: 100,
            images: ['https://picsum.photos/300/300?random=603'],
          }
        ],
        cashAmount: 0,
        partnerId: 'user3',
        partnerName: 'Book Collector',
        partnerImage: 'https://picsum.photos/50/50?random=3',
        partnerRating: 4.9,
        totalValue: 120,
        serviceFee: 4,
        shippingCost: 25,
        trackingNumber: 'TRK123456789',
        lastMessage: 'Package shipped! Tracking number: TRK123456789',
        unreadCount: 0,
      },
      {
        id: 'tx4',
        type: 'received',
        status: 'completed',
        createdAt: '2024-01-05T09:20:00Z',
        updatedAt: '2024-01-12T14:45:00Z',
        myItems: [
          {
            id: 'my4',
            title: 'Gaming Setup - Monitor & Accessories',
            condition: 'good',
            estimatedValue: 450,
            images: ['https://picsum.photos/300/300?random=508'],
          }
        ],
        theirItems: [
          {
            id: 'their4',
            title: 'PlayStation 5',
            condition: 'like-new',
            estimatedValue: 500,
            images: ['https://picsum.photos/300/300?random=604'],
          }
        ],
        cashAmount: 50,
        partnerId: 'user4',
        partnerName: 'Gaming Pro',
        partnerImage: 'https://picsum.photos/50/50?random=4',
        partnerRating: 4.7,
        totalValue: 500,
        serviceFee: 15,
        shippingCost: 30,
        trackingNumber: 'TRK987654321',
        lastMessage: 'Amazing trade! Both items received in perfect condition.',
        unreadCount: 0,
      },
      {
        id: 'tx5',
        type: 'sent',
        status: 'rejected',
        createdAt: '2024-01-08T14:15:00Z',
        updatedAt: '2024-01-09T10:30:00Z',
        myItems: [
          {
            id: 'my5',
            title: 'Professional Camera Lens',
            condition: 'like-new',
            estimatedValue: 300,
            images: ['https://picsum.photos/300/300?random=511'],
          }
        ],
        theirItems: [
          {
            id: 'their5',
            title: '85mm Camera Lens',
            condition: 'good',
            estimatedValue: 350,
            images: ['https://picsum.photos/300/300?random=605'],
          }
        ],
        cashAmount: 50,
        partnerId: 'user5',
        partnerName: 'Photo Expert',
        partnerImage: 'https://picsum.photos/50/50?random=5',
        partnerRating: 4.9,
        totalValue: 350,
        serviceFee: 11,
        lastMessage: 'Sorry, I found a better trade offer.',
        unreadCount: 0,
      },
      {
        id: 'tx6',
        type: 'received',
        status: 'cancelled',
        createdAt: '2024-01-03T11:45:00Z',
        updatedAt: '2024-01-04T16:20:00Z',
        myItems: [
          {
            id: 'my6',
            title: 'Antique Wooden Chair',
            condition: 'fair',
            estimatedValue: 80,
            images: ['https://picsum.photos/300/300?random=512'],
          }
        ],
        theirItems: [
          {
            id: 'their6',
            title: 'Vintage Lamp',
            condition: 'good',
            estimatedValue: 90,
            images: ['https://picsum.photos/300/300?random=606'],
          }
        ],
        partnerId: 'user6',
        partnerName: 'Antique Hunter',
        partnerImage: 'https://picsum.photos/50/50?random=6',
        partnerRating: 4.5,
        totalValue: 80,
        serviceFee: 3,
        lastMessage: 'Transaction cancelled by mutual agreement.',
        unreadCount: 0,
      },
    ]);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    switch (activeTab) {
      case 'sent':
        return transaction.type === 'sent';
      case 'received':
        return transaction.type === 'received';
      case 'completed':
        return transaction.status === 'completed';
      default:
        return true;
    }
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'accepted': return '#2196f3';
      case 'rejected': return '#f44336';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#9e9e9e';
      case 'shipped': return '#9c27b0';
      case 'delivered': return '#4caf50';
      default: return '#666';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return '⏱️';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      case 'completed': return '🎉';
      case 'cancelled': return '🚫';
      case 'shipped': return '📦';
      case 'delivered': return '🏠';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const handleTransactionPress = (transaction: SwapTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleAcceptTrade = (transactionId: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === transactionId ? { ...tx, status: 'accepted' as const, updatedAt: new Date().toISOString() } : tx
    ));
    setShowDetailsModal(false);
    Alert.alert('Trade Accepted!', 'The other user has been notified.');
  };

  const handleRejectTrade = (transactionId: string) => {
    Alert.alert(
      'Reject Trade',
      'Are you sure you want to reject this trade offer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setTransactions(prev => prev.map(tx => 
              tx.id === transactionId ? { ...tx, status: 'rejected' as const, updatedAt: new Date().toISOString() } : tx
            ));
            setShowDetailsModal(false);
            Alert.alert('Trade Rejected', 'The other user has been notified.');
          }
        },
      ]
    );
  };

  const handleCancelTrade = (transactionId: string) => {
    Alert.alert(
      'Cancel Trade',
      'Are you sure you want to cancel this trade?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            setTransactions(prev => prev.map(tx => 
              tx.id === transactionId ? { ...tx, status: 'cancelled' as const, updatedAt: new Date().toISOString() } : tx
            ));
            setShowDetailsModal(false);
            Alert.alert('Trade Cancelled', 'The trade has been cancelled.');
          }
        },
      ]
    );
  };

  const renderTransaction = (transaction: SwapTransaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={styles.transactionCard}
      onPress={() => handleTransactionPress(transaction)}
    >
      {/* Header */}
      <View style={styles.transactionHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
            <Text style={styles.statusIcon}>{getStatusIcon(transaction.status)}</Text>
            <Text style={styles.statusText}>{getStatusText(transaction.status)}</Text>
          </View>
          <Text style={styles.transactionType}>
            {transaction.type === 'sent' ? '📤 Sent Offer' : '📥 Received Offer'}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.dateText}>{formatDate(transaction.createdAt)}</Text>
          {transaction.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{transaction.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Partner Info */}
      <View style={styles.partnerSection}>
        <Image source={{ uri: transaction.partnerImage }} style={styles.partnerImage} />
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{transaction.partnerName}</Text>
          <Text style={styles.partnerRating}>⭐ {transaction.partnerRating}</Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        <View style={styles.itemsSection}>
          <Text style={styles.itemsSectionTitle}>Your Items ({transaction.myItems.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {transaction.myItems.map((item, index) => (
              <View key={index} style={styles.itemPreview}>
                <Image source={{ uri: item.images[0] }} style={styles.itemPreviewImage} />
                <Text style={styles.itemPreviewTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemPreviewValue}>
                  {formatCurrency(item.estimatedValue)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.swapIcon}>
          <Text style={styles.swapIconText}>⇄</Text>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.itemsSectionTitle}>Their Items ({transaction.theirItems.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {transaction.theirItems.map((item, index) => (
              <View key={index} style={styles.itemPreview}>
                <Image source={{ uri: item.images[0] }} style={styles.itemPreviewImage} />
                <Text style={styles.itemPreviewTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemPreviewValue}>
                  {formatCurrency(item.estimatedValue)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Transaction Summary */}
      <View style={styles.transactionSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Value:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(transaction.totalValue)}</Text>
        </View>
        
        {transaction.cashAmount && transaction.cashAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>+ Cash:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(transaction.cashAmount)}</Text>
          </View>
        )}
        
        {transaction.serviceFee > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(transaction.serviceFee)}</Text>
          </View>
        )}
        
        {transaction.shippingCost && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(transaction.shippingCost)}</Text>
          </View>
        )}
      </View>

      {/* Last Message */}
      {transaction.lastMessage && (
        <View style={styles.lastMessage}>
          <Text style={styles.messageIcon}>💬</Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {transaction.lastMessage}
          </Text>
        </View>
      )}

      {/* Tracking */}
      {transaction.trackingNumber && (
        <View style={styles.trackingInfo}>
          <Text style={styles.trackingLabel}>📦 Tracking: {transaction.trackingNumber}</Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ChatScreen', { 
            userId: transaction.partnerId,
            userName: transaction.partnerName 
          })}
        >
          <Text style={styles.actionButtonText}>💬 Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleTransactionPress(transaction)}
        >
          <Text style={styles.actionButtonText}>👁️ Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Swap History</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'all', label: 'All', count: transactions.length },
          { key: 'sent', label: 'Sent', count: transactions.filter(t => t.type === 'sent').length },
          { key: 'received', label: 'Received', count: transactions.filter(t => t.type === 'received').length },
          { key: 'completed', label: 'Completed', count: transactions.filter(t => t.status === 'completed').length },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
            <Text style={[styles.tabCount, activeTab === tab.key && styles.activeTabCount]}>
              ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptyMessage}>
              {activeTab === 'all' 
                ? "You haven't made any trades yet. Start exploring items to swap!"
                : `No ${activeTab} transactions to show.`
              }
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('SwapScreen')}
            >
              <Text style={styles.browseButtonText}>Browse Items</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTransactions.map(renderTransaction)
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {selectedTransaction && (
            <>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <Text style={styles.modalCancel}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <View style={styles.modalButton} />
              </View>

              <ScrollView style={styles.modalContent}>
                {/* Status & Partner */}
                <View style={styles.detailsSection}>
                  <View style={[
                    styles.statusBadgeLarge, 
                    { backgroundColor: getStatusColor(selectedTransaction.status) }
                  ]}>
                    <Text style={styles.statusIconLarge}>{getStatusIcon(selectedTransaction.status)}</Text>
                    <Text style={styles.statusTextLarge}>{getStatusText(selectedTransaction.status)}</Text>
                  </View>

                  <View style={styles.partnerDetailsCard}>
                    <Image source={{ uri: selectedTransaction.partnerImage }} style={styles.partnerImageLarge} />
                    <View style={styles.partnerDetailsInfo}>
                      <Text style={styles.partnerNameLarge}>{selectedTransaction.partnerName}</Text>
                      <Text style={styles.partnerRatingLarge}>⭐ {selectedTransaction.partnerRating}</Text>
                      <Text style={styles.transactionTypeLarge}>
                        {selectedTransaction.type === 'sent' ? 'You sent an offer' : 'You received an offer'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Items Detail */}
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Items</Text>
                  
                  {/* Your Items */}
                  <View style={styles.itemsDetailSection}>
                    <Text style={styles.itemsDetailTitle}>Your Items</Text>
                    {selectedTransaction.myItems.map((item, index) => (
                      <View key={index} style={styles.itemDetailCard}>
                        <Image source={{ uri: item.images[0] }} style={styles.itemDetailImage} />
                        <View style={styles.itemDetailInfo}>
                          <Text style={styles.itemDetailTitle}>{item.title}</Text>
                          <Text style={styles.itemDetailCondition}>Condition: {item.condition}</Text>
                          <Text style={styles.itemDetailValue}>Value: {formatCurrency(item.estimatedValue)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Their Items */}
                  <View style={styles.itemsDetailSection}>
                    <Text style={styles.itemsDetailTitle}>Their Items</Text>
                    {selectedTransaction.theirItems.map((item, index) => (
                      <View key={index} style={styles.itemDetailCard}>
                        <Image source={{ uri: item.images[0] }} style={styles.itemDetailImage} />
                        <View style={styles.itemDetailInfo}>
                          <Text style={styles.itemDetailTitle}>{item.title}</Text>
                          <Text style={styles.itemDetailCondition}>Condition: {item.condition}</Text>
                          <Text style={styles.itemDetailValue}>Value: {formatCurrency(item.estimatedValue)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Transaction Details */}
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Transaction Summary</Text>
                  <View style={styles.transactionDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Value:</Text>
                      <Text style={styles.detailValue}>{formatCurrency(selectedTransaction.totalValue)}</Text>
                    </View>
                    
                    {selectedTransaction.cashAmount && selectedTransaction.cashAmount > 0 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Cash Addition:</Text>
                        <Text style={styles.detailValue}>{formatCurrency(selectedTransaction.cashAmount)}</Text>
                      </View>
                    )}
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Service Fee:</Text>
                      <Text style={styles.detailValue}>{formatCurrency(selectedTransaction.serviceFee)}</Text>
                    </View>
                    
                    {selectedTransaction.shippingCost && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Shipping Cost:</Text>
                        <Text style={styles.detailValue}>{formatCurrency(selectedTransaction.shippingCost)}</Text>
                      </View>
                    )}
                    
                    <View style={styles.detailDivider} />
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabelBold}>Created:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedTransaction.createdAt)}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabelBold}>Last Updated:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedTransaction.updatedAt)}</Text>
                    </View>
                  </View>
                </View>

                {/* Tracking Info */}
                {selectedTransaction.trackingNumber && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsSectionTitle}>Shipping</Text>
                    <View style={styles.trackingCard}>
                      <Text style={styles.trackingNumberLabel}>Tracking Number</Text>
                      <Text style={styles.trackingNumber}>{selectedTransaction.trackingNumber}</Text>
                      <TouchableOpacity style={styles.trackButton}>
                        <Text style={styles.trackButtonText}>Track Package</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Actions</Text>
                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={[styles.detailActionButton, styles.messageButton]}
                      onPress={() => {
                        setShowDetailsModal(false);
                        navigation.navigate('ChatScreen', { 
                          userId: selectedTransaction.partnerId,
                          userName: selectedTransaction.partnerName 
                        });
                      }}
                    >
                      <Text style={styles.detailActionText}>💬 Message</Text>
                    </TouchableOpacity>

                    {selectedTransaction.type === 'received' && selectedTransaction.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={[styles.detailActionButton, styles.acceptButton]}
                          onPress={() => handleAcceptTrade(selectedTransaction.id)}
                        >
                          <Text style={styles.detailActionTextWhite}>✅ Accept Trade</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.detailActionButton, styles.rejectButton]}
                          onPress={() => handleRejectTrade(selectedTransaction.id)}
                        >
                          <Text style={styles.detailActionTextWhite}>❌ Reject Trade</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {(selectedTransaction.status === 'pending' || selectedTransaction.status === 'accepted') && (
                      <TouchableOpacity
                        style={[styles.detailActionButton, styles.cancelButton]}
                        onPress={() => handleCancelTrade(selectedTransaction.id)}
                      >
                        <Text style={styles.detailActionTextWhite}>🚫 Cancel Trade</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>
            </>
          )}
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerButton: {
    fontSize: 16,
    color: '#2196f3',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2196f3',
  },
  tabCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activeTabCount: {
    color: '#2196f3',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  transactionType: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  partnerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  partnerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  partnerRating: {
    fontSize: 14,
    color: '#ff9800',
  },
  itemsPreview: {
    marginBottom: 16,
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemPreview: {
    width: 80,
    marginRight: 8,
    alignItems: 'center',
  },
  itemPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginBottom: 4,
  },
  itemPreviewTitle: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  itemPreviewValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
    textAlign: 'center',
  },
  swapIcon: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapIconText: {
    fontSize: 20,
    color: '#2196f3',
  },
  transactionSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  lastMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  trackingInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  trackingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4caf50',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
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
  browseButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
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
  modalButton: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 16,
  },
  statusIconLarge: {
    fontSize: 20,
    marginRight: 8,
  },
  statusTextLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  partnerDetailsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  partnerImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  partnerDetailsInfo: {
    flex: 1,
  },
  partnerNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  partnerRatingLarge: {
    fontSize: 16,
    color: '#ff9800',
    marginBottom: 4,
  },
  transactionTypeLarge: {
    fontSize: 14,
    color: '#666',
  },
  itemsDetailSection: {
    marginBottom: 16,
  },
  itemsDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemDetailCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemDetailImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  itemDetailInfo: {
    flex: 1,
  },
  itemDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDetailCondition: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  transactionDetails: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailLabelBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  trackingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  trackingNumberLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  trackButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  trackButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  detailActions: {
    gap: 8,
  },
  detailActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  cancelButton: {
    backgroundColor: '#ff9800',
  },
  detailActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailActionTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});