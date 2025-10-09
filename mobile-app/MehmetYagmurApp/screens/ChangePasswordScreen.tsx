import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';

const colors = {
  primary: '#007AFF',
  white: '#FFFFFF',
  text: '#000000',
  background: '#F8F8F8',
  error: '#FF3B30',
  success: '#34C759',
};

interface ChangePasswordScreenProps {
  navigation: any;
}

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Your password has been changed successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ 
    label, 
    value, 
    onChangeText, 
    secureTextEntry, 
    onToggleVisibility, 
    error,
    placeholder 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry: boolean;
    onToggleVisibility: () => void;
    error?: string;
    placeholder: string;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onToggleVisibility}
        >
          <Text style={styles.eyeIcon}>
            {secureTextEntry ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <HeaderWithBackArrow
        title="Change Password"
        onBackButton={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Enter your current password and choose a new one
        </Text>

        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrentPassword}
          onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
          error={errors.currentPassword}
          placeholder="Enter current password"
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
          error={errors.newPassword}
          placeholder="Enter new password"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          error={errors.confirmPassword}
          placeholder="Confirm new password"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Password Requirements:</Text>
          <Text style={styles.infoText}>• At least 6 characters</Text>
          <Text style={styles.infoText}>• Different from current password</Text>
          <Text style={styles.infoText}>• Consider using letters, numbers, and symbols</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 10,
    marginVertical: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});