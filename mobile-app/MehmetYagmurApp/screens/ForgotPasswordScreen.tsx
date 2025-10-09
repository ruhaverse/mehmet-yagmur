import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ResetMethod = 'email' | 'phone';
type Step = 'method' | 'verify' | 'newPassword';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState<Step>('method');
  const [resetMethod, setResetMethod] = useState<ResetMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSendCode = async () => {
    if (resetMethod === 'email' && !isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (resetMethod === 'phone' && !isValidPhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verify');
      setTimer(300); // 5 minutes
      Alert.alert(
        'Code Sent!',
        `Verification code has been sent to your ${resetMethod === 'email' ? 'email' : 'phone number'}`
      );
    }, 2000);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (verificationCode === '123456') {
        setCurrentStep('newPassword');
      } else {
        Alert.alert('Invalid Code', 'The verification code you entered is incorrect');
      }
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success!',
        'Your password has been reset successfully',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    }, 2000);
  };

  const handleResendCode = () => {
    if (timer > 0) return;
    
    setTimer(300);
    Alert.alert('Code Resent', 'A new verification code has been sent');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMethodStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>
        Choose how you'd like to receive your password reset code
      </Text>

      {/* Reset Method Selection */}
      <View style={styles.methodSelection}>
        <TouchableOpacity
          style={[
            styles.methodOption,
            resetMethod === 'email' && styles.selectedMethod
          ]}
          onPress={() => setResetMethod('email')}
        >
          <View style={styles.methodContent}>
            <Text style={styles.methodIcon}>📧</Text>
            <View style={styles.methodText}>
              <Text style={styles.methodTitle}>Email</Text>
              <Text style={styles.methodSubtitle}>Send code to your email</Text>
            </View>
          </View>
          {resetMethod === 'email' && (
            <Text style={styles.checkIcon}>✓</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodOption,
            resetMethod === 'phone' && styles.selectedMethod
          ]}
          onPress={() => setResetMethod('phone')}
        >
          <View style={styles.methodContent}>
            <Text style={styles.methodIcon}>📱</Text>
            <View style={styles.methodText}>
              <Text style={styles.methodTitle}>Phone</Text>
              <Text style={styles.methodSubtitle}>Send SMS to your phone</Text>
            </View>
          </View>
          {resetMethod === 'phone' && (
            <Text style={styles.checkIcon}>✓</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {resetMethod === 'email' ? 'Email Address' : 'Phone Number'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={
            resetMethod === 'email' 
              ? 'Enter your email address' 
              : 'Enter your phone number'
          }
          value={resetMethod === 'email' ? email : phone}
          onChangeText={resetMethod === 'email' ? setEmail : setPhone}
          keyboardType={resetMethod === 'email' ? 'email-address' : 'phone-pad'}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerifyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.description}>
        We've sent a 6-digit code to{'\n'}
        {resetMethod === 'email' ? email : phone}
      </Text>

      <View style={styles.codeInputContainer}>
        <TextInput
          style={styles.codeInput}
          placeholder="000000"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor="#999"
        />
      </View>

      {timer > 0 && (
        <Text style={styles.timerText}>
          Code expires in {formatTimer(timer)}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, timer > 0 && styles.disabledButton]}
        onPress={handleResendCode}
        disabled={timer > 0}
      >
        <Text style={[
          styles.secondaryButtonText,
          timer > 0 && styles.disabledText
        ]}>
          {timer > 0 ? `Resend in ${formatTimer(timer)}` : 'Resend Code'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.changeMethodButton}
        onPress={() => setCurrentStep('method')}
      >
        <Text style={styles.changeMethodText}>
          Change {resetMethod === 'email' ? 'email' : 'phone number'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.description}>
        Please create a strong password for your account
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      {/* Password Requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        <View style={styles.requirementItem}>
          <Text style={[
            styles.requirementIcon,
            newPassword.length >= 6 && styles.validRequirement
          ]}>
            {newPassword.length >= 6 ? '✓' : '○'}
          </Text>
          <Text style={styles.requirementText}>At least 6 characters</Text>
        </View>
        <View style={styles.requirementItem}>
          <Text style={[
            styles.requirementIcon,
            /[A-Z]/.test(newPassword) && styles.validRequirement
          ]}>
            {/[A-Z]/.test(newPassword) ? '✓' : '○'}
          </Text>
          <Text style={styles.requirementText}>One uppercase letter</Text>
        </View>
        <View style={styles.requirementItem}>
          <Text style={[
            styles.requirementIcon,
            /[0-9]/.test(newPassword) && styles.validRequirement
          ]}>
            {/[0-9]/.test(newPassword) ? '✓' : '○'}
          </Text>
          <Text style={styles.requirementText}>One number</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Updating...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (currentStep === 'method') {
              navigation.goBack();
            } else if (currentStep === 'verify') {
              setCurrentStep('method');
            } else {
              setCurrentStep('verify');
            }
          }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {currentStep === 'method' && renderMethodStep()}
          {currentStep === 'verify' && renderVerifyStep()}
          {currentStep === 'newPassword' && renderNewPasswordStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.footerText}>
            Remember your password? <Text style={styles.linkText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  headerRight: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  methodSelection: {
    marginBottom: 32,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    marginBottom: 12,
  },
  selectedMethod: {
    borderColor: '#2196f3',
    backgroundColor: '#f0f8ff',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  methodText: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  checkIcon: {
    fontSize: 18,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  codeInputContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: '#333',
    borderWidth: 2,
    borderColor: '#2196f3',
    textAlign: 'center',
    letterSpacing: 8,
    width: 200,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196f3',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  disabledText: {
    color: '#999',
  },
  changeMethodButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeMethodText: {
    fontSize: 14,
    color: '#2196f3',
    textDecorationLine: 'underline',
  },
  requirementsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    fontSize: 16,
    color: '#ccc',
    marginRight: 12,
    width: 20,
  },
  validRequirement: {
    color: '#4caf50',
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  linkText: {
    color: '#2196f3',
    fontWeight: '600',
  },
});