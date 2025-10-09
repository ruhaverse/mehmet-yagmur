import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Text,
} from 'react-native';

const colors = {
  primary: '#007AFF',
  white: '#FFFFFF',
  text: '#000000',
};

interface MessageTextFieldProps {
  onSend: (message: string) => void;
  placeholder?: string;
  multiline?: boolean;
  onCameraPress?: () => void;
  onGalleryPress?: () => void;
  onMicPress?: () => void;
  disabled?: boolean;
}

export default function MessageTextField({
  onSend,
  placeholder = "Type a message...",
  multiline = true,
  onCameraPress,
  onGalleryPress,
  onMicPress,
  disabled = false,
}: MessageTextFieldProps) {
  const [message, setMessage] = useState('');
  const [height, setHeight] = useState(40);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setHeight(40);
    }
  };

  const handleContentSizeChange = (event: any) => {
    if (multiline) {
      const newHeight = Math.max(40, Math.min(120, event.nativeEvent.contentSize.height));
      setHeight(newHeight);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Actions */}
      <View style={styles.leftActions}>
        {onCameraPress && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onCameraPress}
          >
            <Text style={styles.actionIcon}>📷</Text>
          </TouchableOpacity>
        )}
        {onGalleryPress && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onGalleryPress}
          >
            <Text style={styles.actionIcon}>🖼️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Text Input */}
      <View style={[styles.inputContainer, { height: height + 16 }]}>
        <TextInput
          style={[
            styles.textInput,
            { height: height },
            disabled && styles.disabledInput
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline={multiline}
          onContentSizeChange={handleContentSizeChange}
          maxLength={1000}
          editable={!disabled}
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
      </View>

      {/* Right Actions */}
      <View style={styles.rightActions}>
        {message.trim() ? (
          <TouchableOpacity
            style={[styles.sendButton, disabled && styles.disabledButton]}
            onPress={handleSend}
            disabled={disabled}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        ) : (
          onMicPress && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onMicPress}
            >
              <Text style={styles.actionIcon}>🎤</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    minHeight: 56,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#F5F5F5',
  },
  actionIcon: {
    fontSize: 18,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    minHeight: 40,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
    ...Platform.select({
      ios: {
        paddingTop: 8,
      },
      android: {
        paddingTop: 4,
      },
    }),
  },
  disabledInput: {
    color: '#999',
    backgroundColor: '#F0F0F0',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  sendIcon: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
});