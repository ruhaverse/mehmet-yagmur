import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface TestSection {
  id: string;
  title: string;
  description: string;
  tests: TestCase[];
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

export default function TestScreen({ navigation }: any) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [autoRun, setAutoRun] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestCase>>({});

  // Mock test data
  const testSections: TestSection[] = [
    {
      id: 'navigation',
      title: 'Navigation Tests',
      description: 'Test all navigation routes and screen transitions',
      tests: [
        {
          id: 'nav-1',
          name: 'Home Navigation',
          description: 'Test navigation to home screen',
          status: 'pending'
        },
        {
          id: 'nav-2',
          name: 'Profile Navigation',
          description: 'Test navigation to profile screen',
          status: 'pending'
        },
        {
          id: 'nav-3',
          name: 'Post Detail Navigation',
          description: 'Test navigation to post detail with params',
          status: 'pending'
        },
        {
          id: 'nav-4',
          name: 'Story View Navigation',
          description: 'Test story view with proper transitions',
          status: 'pending'
        }
      ]
    },
    {
      id: 'components',
      title: 'Component Tests',
      description: 'Test individual components functionality',
      tests: [
        {
          id: 'comp-1',
          name: 'Post Card Rendering',
          description: 'Test post card component with different post types',
          status: 'pending'
        },
        {
          id: 'comp-2',
          name: 'Story Card Interaction',
          description: 'Test story card touch and animation',
          status: 'pending'
        },
        {
          id: 'comp-3',
          name: 'User Card Display',
          description: 'Test user card with verification badges',
          status: 'pending'
        },
        {
          id: 'comp-4',
          name: 'Input Validation',
          description: 'Test form inputs and validation logic',
          status: 'pending'
        }
      ]
    },
    {
      id: 'api',
      title: 'API Integration',
      description: 'Test API calls and data handling',
      tests: [
        {
          id: 'api-1',
          name: 'Auth Endpoints',
          description: 'Test login, signup, and token refresh',
          status: 'pending'
        },
        {
          id: 'api-2',
          name: 'Post Operations',
          description: 'Test create, read, update, delete posts',
          status: 'pending'
        },
        {
          id: 'api-3',
          name: 'User Management',
          description: 'Test user profile and friend requests',
          status: 'pending'
        },
        {
          id: 'api-4',
          name: 'Media Upload',
          description: 'Test image and video upload functionality',
          status: 'pending'
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance Tests',
      description: 'Test app performance and memory usage',
      tests: [
        {
          id: 'perf-1',
          name: 'Screen Load Time',
          description: 'Measure screen rendering performance',
          status: 'pending'
        },
        {
          id: 'perf-2',
          name: 'List Scroll Performance',
          description: 'Test FlatList performance with large datasets',
          status: 'pending'
        },
        {
          id: 'perf-3',
          name: 'Memory Usage',
          description: 'Monitor memory consumption during usage',
          status: 'pending'
        },
        {
          id: 'perf-4',
          name: 'Image Loading',
          description: 'Test image caching and loading optimization',
          status: 'pending'
        }
      ]
    },
    {
      id: 'edge-cases',
      title: 'Edge Case Tests',
      description: 'Test error handling and edge cases',
      tests: [
        {
          id: 'edge-1',
          name: 'Network Error Handling',
          description: 'Test app behavior during network failures',
          status: 'pending'
        },
        {
          id: 'edge-2',
          name: 'Empty State Handling',
          description: 'Test UI with empty data sets',
          status: 'pending'
        },
        {
          id: 'edge-3',
          name: 'Long Text Handling',
          description: 'Test UI with extremely long content',
          status: 'pending'
        },
        {
          id: 'edge-4',
          name: 'Deep Link Validation',
          description: 'Test deep link handling and validation',
          status: 'pending'
        }
      ]
    }
  ];

  const runTest = async (test: TestCase) => {
    setRunningTests(prev => new Set([...prev, test.id]));
    
    // Update test status to running
    setTestResults(prev => ({
      ...prev,
      [test.id]: { ...test, status: 'running' }
    }));

    // Simulate test execution
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 3000));
    const duration = Date.now() - startTime;

    // Random test result (80% pass rate)
    const passed = Math.random() > 0.2;
    
    const result: TestCase = {
      ...test,
      status: passed ? 'passed' : 'failed',
      duration,
      error: passed ? undefined : 'Test failed due to simulated error condition'
    };

    setTestResults(prev => ({
      ...prev,
      [test.id]: result
    }));

    setRunningTests(prev => {
      const newSet = new Set(prev);
      newSet.delete(test.id);
      return newSet;
    });

    return result;
  };

  const runAllTests = async (sectionId: string) => {
    const section = testSections.find(s => s.id === sectionId);
    if (!section) return;

    for (const test of section.tests) {
      if (!runningTests.has(test.id)) {
        await runTest(test);
      }
    }
  };

  const getTestStatus = (testId: string): TestCase['status'] => {
    if (runningTests.has(testId)) return 'running';
    return testResults[testId]?.status || 'pending';
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'pending':
        return '⏸️';
      case 'running':
        return '🔄';
      case 'passed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⏸️';
    }
  };

  const getStatusColor = (status: TestCase['status']) => {
    switch (status) {
      case 'pending':
        return '#666';
      case 'running':
        return '#ff9800';
      case 'passed':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getSectionStats = (section: TestSection) => {
    const total = section.tests.length;
    const passed = section.tests.filter(t => getTestStatus(t.id) === 'passed').length;
    const failed = section.tests.filter(t => getTestStatus(t.id) === 'failed').length;
    const running = section.tests.filter(t => getTestStatus(t.id) === 'running').length;
    
    return { total, passed, failed, running };
  };

  const showTestDetails = (test: TestCase) => {
    const result = testResults[test.id] || test;
    setModalContent(result);
    setShowModal(true);
  };

  const clearAllResults = () => {
    Alert.alert(
      'Clear Results',
      'Are you sure you want to clear all test results?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setTestResults({});
            setRunningTests(new Set());
          }
        }
      ]
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Suite</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllResults}
        >
          <Text style={styles.clearIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Auto Run Toggle */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto Run Tests</Text>
          <Switch
            value={autoRun}
            onValueChange={setAutoRun}
            trackColor={{ false: '#e0e0e0', true: '#2196f3' }}
            thumbColor={autoRun ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Test Sections */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {testSections.map((section) => {
          const stats = getSectionStats(section);
          const isExpanded = selectedSection === section.id;

          return (
            <View key={section.id} style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setSelectedSection(isExpanded ? null : section.id)}
              >
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                  <View style={styles.sectionStats}>
                    <Text style={styles.statsText}>
                      {stats.passed}✅ {stats.failed}❌ {stats.running}🔄 ({stats.total} total)
                    </Text>
                  </View>
                </View>
                <View style={styles.sectionActions}>
                  <TouchableOpacity
                    style={styles.runAllButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      runAllTests(section.id);
                    }}
                  >
                    <Text style={styles.runAllText}>Run All</Text>
                  </TouchableOpacity>
                  <Text style={styles.expandIcon}>
                    {isExpanded ? '▼' : '▶️'}
                  </Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.testsContainer}>
                  {section.tests.map((test) => {
                    const status = getTestStatus(test.id);
                    const result = testResults[test.id];

                    return (
                      <TouchableOpacity
                        key={test.id}
                        style={styles.testItem}
                        onPress={() => showTestDetails(test)}
                      >
                        <View style={styles.testContent}>
                          <View style={styles.testInfo}>
                            <Text style={styles.testName}>{test.name}</Text>
                            <Text style={styles.testDescription}>{test.description}</Text>
                            {result?.duration && (
                              <Text style={styles.testDuration}>
                                Duration: {result.duration}ms
                              </Text>
                            )}
                          </View>
                          <View style={styles.testActions}>
                            <TouchableOpacity
                              style={styles.runTestButton}
                              onPress={(e) => {
                                e.stopPropagation();
                                runTest(test);
                              }}
                              disabled={status === 'running'}
                            >
                              <Text style={styles.runTestText}>
                                {status === 'running' ? 'Running...' : 'Run'}
                              </Text>
                            </TouchableOpacity>
                            <Text 
                              style={[
                                styles.statusIcon,
                                { color: getStatusColor(status) }
                              ]}
                            >
                              {getStatusIcon(status)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Test Details Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Test Details</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {modalContent && (
              <View style={styles.modalContent}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Name:</Text>
                  <Text style={styles.modalValue}>{modalContent.name}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <Text style={[
                    styles.modalValue,
                    { color: getStatusColor(modalContent.status) }
                  ]}>
                    {getStatusIcon(modalContent.status)} {modalContent.status}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Description:</Text>
                  <Text style={styles.modalValue}>{modalContent.description}</Text>
                </View>
                {modalContent.duration && (
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Duration:</Text>
                    <Text style={styles.modalValue}>{modalContent.duration}ms</Text>
                  </View>
                )}
                {modalContent.error && (
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Error:</Text>
                    <Text style={[styles.modalValue, styles.errorText]}>
                      {modalContent.error}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    padding: 8,
    marginRight: -8,
  },
  clearIcon: {
    fontSize: 20,
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sectionStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#888',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  runAllButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  runAllText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  testsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  testItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  testContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  testDuration: {
    fontSize: 12,
    color: '#888',
  },
  testActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  runTestButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  runTestText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: width - 32,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeIcon: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    padding: 16,
  },
  modalRow: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  errorText: {
    color: '#f44336',
  },
  bottomPadding: {
    height: 20,
  },
});