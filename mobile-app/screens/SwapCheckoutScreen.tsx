import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SwapItem {
  id: string;
  title: string;
  description: string;
  condition: string;
  estimatedValue: number;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerImage: string;
  ownerRating: number;
}

interface MyItem {
  id: string;
  title: string;
  condition: string;
  estimatedValue: number;
  images: string[];
}

interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  lastFour?: string;
  brand?: string;
  isDefault: boolean;
}

export default function SwapCheckoutScreen({ navigation, route }: any) {
  const { itemId, itemData } = route.params;
  
  const [selectedMyItems, setSelectedMyItems] = useState<MyItem[]>([]);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [includeShipping, setIncludeShipping] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'John Smith',
    streetAddress: '123 Main St, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phoneNumber: '+1 (555) 123-4567',
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for user's items
  const [myItems, setMyItems] = useState<MyItem[]>([
    {
      id: 'my1',
      title: 'Samsung Galaxy S23 Ultra',
      condition: 'good',
      estimatedValue: 850,
      images: ['https://picsum.photos/300/300?random=601'],
    },
    {
      id: 'my2',
      title: 'MacBook Air M2',
      condition: 'like-new',
      estimatedValue: 1100,
      images: ['https://picsum.photos/300/300?random=602'],
    },
    {
      id: 'my3',
      title: 'Nintendo Switch OLED',
      condition: 'good',
      estimatedValue: 280,
      images: ['https://picsum.photos/300/300?random=603'],
    },
    {
      id: 'my4',
      title: 'Sony WH-1000XM4 Headphones',
      condition: 'like-new',
      estimatedValue: 220,
      images: ['https://picsum.photos/300/300?random=604'],
    },
    {
      id: 'my5',
      title: 'Apple Watch Series 8',
      condition: 'good',
      estimatedValue: 350,
      images: ['https://picsum.photos/300/300?random=605'],
    },
  ]);

  useEffect(() => {
    setPaymentMethods([
      {
        id: 'card1',
        type: 'card',
        lastFour: '4242',
        brand: 'Visa',
        isDefault: true,
      },
      {
        id: 'paypal1',
        type: 'paypal',
        isDefault: false,
      },
      {
        id: 'apple1',
        type: 'apple-pay',
        isDefault: false,
      },
    ]);
    setSelectedPayment('card1');
  }, []);

  const targetItem: SwapItem = itemData || {
    id: itemId,
    title: 'iPhone 14 Pro - Space Black',
    description: 'Excellent condition iPhone 14 Pro with all accessories',
    condition: 'like-new',
    estimatedValue: 900,
    images: ['https://picsum.photos/300/300?random=501'],
    ownerId: 'user1',
    ownerName: 'Alex Tech',
    ownerImage: 'https://picsum.photos/50/50?random=1',
    ownerRating: 4.8,
  };

  const myItemsValue = selectedMyItems.reduce((sum, item) => sum + item.estimatedValue, 0);
  const totalMyValue = myItemsValue + cashAmount;
  const valueDifference = targetItem.estimatedValue - totalMyValue;
  const shippingCost = includeShipping ? 25 : 0;
  const serviceFee = Math.max(totalMyValue * 0.03, 5); // 3% or minimum $5
  const totalCost = Math.max(cashAmount + shippingCost + serviceFee, 0);

  const handleSelectMyItem = (item: MyItem) => {
    setSelectedMyItems(prev => {
      const isSelected = prev.find(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleCompleteSwap = async () => {
    if (selectedMyItems.length === 0 && cashAmount === 0) {
      Alert.alert('Invalid Swap', 'Please select items or add cash to complete the swap.');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions.');
      return;
    }

    if (cashAmount > 0 && !selectedPayment) {
      Alert.alert('Payment Required', 'Please select a payment method.');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Swap Request Sent!',
        `Your swap request has been sent to ${targetItem.ownerName}. You'll be notified when they respond.`,
        [
          {
            text: 'View Status',
            onPress: () => navigation.navigate('SwapHistoryScreen'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const getPaymentIcon = (type: string): string => {
    switch (type) {
      case 'card': return '💳';
      case 'paypal': return '🅿️';
      case 'apple-pay': return '🍎';
      case 'google-pay': return '🟢';
      default: return '💳';
    }
  };

  const renderSelectedItem = (item: MyItem) => (
    <View key={item.id} style={styles.selectedItem}>
      <Image source={{ uri: item.images[0] }} style={styles.selectedItemImage} />
      <View style={styles.selectedItemInfo}>
        <Text style={styles.selectedItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.selectedItemCondition}>{item.condition}</Text>
        <Text style={styles.selectedItemValue}>{formatCurrency(item.estimatedValue)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeItemButton}
        onPress={() => handleSelectMyItem(item)}
      >
        <Text style={styles.removeItemText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMyItemOption = (item: MyItem) => {
    const isSelected = selectedMyItems.find(selected => selected.id === item.id);
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.myItemOption, isSelected && styles.selectedItemOption]}
        onPress={() => handleSelectMyItem(item)}
      >
        <Image source={{ uri: item.images[0] }} style={styles.myItemImage} />
        <View style={styles.myItemInfo}>
          <Text style={styles.myItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.myItemCondition}>{item.condition}</Text>
          <Text style={styles.myItemValue}>{formatCurrency(item.estimatedValue)}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap Checkout</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Target Item */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Want</Text>
          <View style={styles.targetItem}>
            <Image source={{ uri: targetItem.images[0] }} style={styles.targetItemImage} />
            <View style={styles.targetItemInfo}>
              <Text style={styles.targetItemTitle}>{targetItem.title}</Text>
              <Text style={styles.targetItemCondition}>{targetItem.condition}</Text>
              <Text style={styles.targetItemValue}>{formatCurrency(targetItem.estimatedValue)}</Text>
              
              <View style={styles.ownerInfo}>
                <Image source={{ uri: targetItem.ownerImage }} style={styles.ownerImage} />
                <View>
                  <Text style={styles.ownerName}>{targetItem.ownerName}</Text>
                  <Text style={styles.ownerRating}>⭐ {targetItem.ownerRating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* My Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Offer</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowItemsModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add Items</Text>
            </TouchableOpacity>
          </View>

          {selectedMyItems.length > 0 ? (
            <View style={styles.selectedItems}>
              {selectedMyItems.map(renderSelectedItem)}
            </View>
          ) : (
            <View style={styles.emptyItems}>
              <Text style={styles.emptyItemsText}>No items selected</Text>
              <TouchableOpacity
                style={styles.selectItemsButton}
                onPress={() => setShowItemsModal(true)}
              >
                <Text style={styles.selectItemsButtonText}>Select Items to Trade</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Cash Addition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Cash (Optional)</Text>
          <View style={styles.cashContainer}>
            <Text style={styles.cashLabel}>$</Text>
            <TextInput
              style={styles.cashInput}
              value={cashAmount.toString()}
              onChangeText={(text) => {
                const amount = parseFloat(text) || 0;
                setCashAmount(amount);
              }}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          
          {valueDifference > 0 && (
            <Text style={styles.suggestionText}>
              💡 Suggested additional cash: {formatCurrency(valueDifference)}
            </Text>
          )}
        </View>

        {/* Value Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Value Breakdown</Text>
          <View style={styles.valueBreakdown}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Your items value:</Text>
              <Text style={styles.valueAmount}>{formatCurrency(myItemsValue)}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Cash addition:</Text>
              <Text style={styles.valueAmount}>{formatCurrency(cashAmount)}</Text>
            </View>
            <View style={styles.valueDivider} />
            <View style={styles.valueRow}>
              <Text style={styles.totalLabel}>Total your offer:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalMyValue)}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Their item value:</Text>
              <Text style={styles.valueAmount}>{formatCurrency(targetItem.estimatedValue)}</Text>
            </View>
            <View style={styles.valueDivider} />
            <View style={styles.valueRow}>
              <Text style={[
                styles.differenceLabel,
                valueDifference > 0 ? styles.negativeValue : styles.positiveValue
              ]}>
                Value difference:
              </Text>
              <Text style={[
                styles.differenceAmount,
                valueDifference > 0 ? styles.negativeValue : styles.positiveValue
              ]}>
                {valueDifference > 0 ? '-' : '+'}{formatCurrency(Math.abs(valueDifference))}
              </Text>
            </View>
          </View>
        </View>

        {/* Shipping */}
        <View style={styles.section}>
          <View style={styles.shippingHeader}>
            <Text style={styles.sectionTitle}>Shipping</Text>
            <Switch
              value={includeShipping}
              onValueChange={setIncludeShipping}
            />
          </View>

          {includeShipping && (
            <View>
              <TouchableOpacity
                style={styles.addressCard}
                onPress={() => setShowAddressModal(true)}
              >
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{shippingAddress.fullName}</Text>
                  <Text style={styles.addressText}>
                    {shippingAddress.streetAddress}
                  </Text>
                  <Text style={styles.addressText}>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </Text>
                  <Text style={styles.phoneText}>{shippingAddress.phoneNumber}</Text>
                </View>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
              
              <View style={styles.shippingNote}>
                <Text style={styles.shippingNoteText}>
                  📦 We'll coordinate secure shipping with tracking for both items
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment (if cash is involved) */}
        {cashAmount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.id && styles.selectedPaymentMethod
                ]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentIcon}>{getPaymentIcon(method.type)}</Text>
                  <View>
                    <Text style={styles.paymentLabel}>
                      {method.type === 'card' ? `${method.brand} •••• ${method.lastFour}` : 
                       method.type === 'paypal' ? 'PayPal' :
                       method.type === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
                    </Text>
                    {method.isDefault && (
                      <Text style={styles.defaultLabel}>Default</Text>
                    )}
                  </View>
                </View>
                <View style={styles.radioButton}>
                  {selectedPayment === method.id && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.addPaymentButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.addPaymentText}>+ Add New Payment Method</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cost Summary */}
        {(cashAmount > 0 || includeShipping) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Summary</Text>
            <View style={styles.costBreakdown}>
              {cashAmount > 0 && (
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Cash payment:</Text>
                  <Text style={styles.costAmount}>{formatCurrency(cashAmount)}</Text>
                </View>
              )}
              {includeShipping && (
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Shipping & handling:</Text>
                  <Text style={styles.costAmount}>{formatCurrency(shippingCost)}</Text>
                </View>
              )}
              {cashAmount > 0 && (
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Service fee:</Text>
                  <Text style={styles.costAmount}>{formatCurrency(serviceFee)}</Text>
                </View>
              )}
              <View style={styles.costDivider} />
              <View style={styles.costRow}>
                <Text style={styles.totalCostLabel}>Total cost:</Text>
                <Text style={styles.totalCostAmount}>{formatCurrency(totalCost)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Terms */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkedBox]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[styles.swapButton, (!agreedToTerms || loading) && styles.disabledButton]}
          onPress={handleCompleteSwap}
          disabled={!agreedToTerms || loading}
        >
          <Text style={styles.swapButtonText}>
            {loading ? 'Sending Request...' : `Send Swap Request`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Select Items Modal */}
      <Modal
        visible={showItemsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowItemsModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Items</Text>
            <TouchableOpacity onPress={() => setShowItemsModal(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Select items from your collection to trade
            </Text>
            
            <View style={styles.myItemsList}>
              {myItems.map(renderMyItemOption)}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Address Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Shipping Address</Text>
            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
              <Text style={styles.modalDone}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.formInput}
                value={shippingAddress.fullName}
                onChangeText={(text) => setShippingAddress(prev => ({ ...prev, fullName: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Street Address</Text>
              <TextInput
                style={styles.formInput}
                value={shippingAddress.streetAddress}
                onChangeText={(text) => setShippingAddress(prev => ({ ...prev, streetAddress: text }))}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.formLabel}>City</Text>
                <TextInput
                  style={styles.formInput}
                  value={shippingAddress.city}
                  onChangeText={(text) => setShippingAddress(prev => ({ ...prev, city: text }))}
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.formLabel}>State</Text>
                <TextInput
                  style={styles.formInput}
                  value={shippingAddress.state}
                  onChangeText={(text) => setShippingAddress(prev => ({ ...prev, state: text }))}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>ZIP Code</Text>
              <TextInput
                style={styles.formInput}
                value={shippingAddress.zipCode}
                onChangeText={(text) => setShippingAddress(prev => ({ ...prev, zipCode: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                value={shippingAddress.phoneNumber}
                onChangeText={(text) => setShippingAddress(prev => ({ ...prev, phoneNumber: text }))}
                keyboardType="phone-pad"
              />
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
  headerButton: {
    fontSize: 16,
    color: '#2196f3',
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  targetItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  targetItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  targetItemInfo: {
    flex: 1,
  },
  targetItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  targetItemCondition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  targetItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4caf50',
    marginBottom: 8,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  ownerRating: {
    fontSize: 12,
    color: '#ff9800',
  },
  selectedItems: {
    gap: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  selectedItemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  selectedItemCondition: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  selectedItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
  },
  removeItemButton: {
    padding: 4,
  },
  removeItemText: {
    fontSize: 18,
    color: '#f44336',
  },
  emptyItems: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyItemsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  selectItemsButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2196f3',
    borderRadius: 8,
  },
  selectItemsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cashLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  cashInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  suggestionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  valueBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  valueLabel: {
    fontSize: 14,
    color: '#666',
  },
  valueAmount: {
    fontSize: 14,
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  differenceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  differenceAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveValue: {
    color: '#4caf50',
  },
  negativeValue: {
    color: '#f44336',
  },
  valueDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  shippingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
  },
  editIcon: {
    fontSize: 16,
  },
  shippingNote: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
  },
  shippingNoteText: {
    fontSize: 14,
    color: '#2196f3',
    textAlign: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: '#2196f3',
    backgroundColor: '#f3f8ff',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  defaultLabel: {
    fontSize: 12,
    color: '#2196f3',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196f3',
  },
  addPaymentButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  costBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costAmount: {
    fontSize: 14,
    color: '#333',
  },
  costDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalCostAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2196f3',
    fontWeight: '500',
  },
  bottomAction: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  swapButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  swapButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
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
  modalDone: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  myItemsList: {
    gap: 12,
  },
  myItemOption: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedItemOption: {
    borderColor: '#2196f3',
    backgroundColor: '#f3f8ff',
  },
  myItemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  myItemInfo: {
    flex: 1,
  },
  myItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  myItemCondition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  myItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});