// Core Components Library
// Reusable components for the entire application

export { default as CustomButton } from './CustomButton';
export { default as InputField } from './InputField';
export { default as UserCard } from './UserCard';
export { default as PostCard } from './PostCard';
export { default as StoryCard } from './StoryCard';
export { default as NotificationItem } from './NotificationItem';

// Advanced Button Components
export { default as FancyAddButton } from './buttons/FancyAddButton';

// Header Components  
export { default as HeaderWithBackArrow } from './headers/HeaderWithBackArrow';

// Message Components
export { default as MessageTextField } from './messages/MessageTextField';

// Navigation Components
export { default as TabNavigation } from '../navigation/TabNavigation';

// Type exports for better TypeScript support
export type { default as CustomButtonProps } from './CustomButton';
export type { default as InputFieldProps } from './InputField';
export type { default as UserCardProps } from './UserCard';
export type { default as PostCardProps } from './PostCard';
export type { default as StoryCardProps } from './StoryCard';
export type { default as NotificationItemProps } from './NotificationItem';

// Advanced Component Types
export interface TabMenu {
  name: string;
  component: React.ReactNode;
  icon?: string;
  badge?: number;
}

export interface MessageFieldProps {
  onSend: (message: string) => void;
  placeholder?: string;
  multiline?: boolean;
  onCameraPress?: () => void;
  onGalleryPress?: () => void;
  onMicPress?: () => void;
  disabled?: boolean;
}