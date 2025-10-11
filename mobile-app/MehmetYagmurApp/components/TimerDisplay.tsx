// Real-Time Timer Display Component
// Provides live countdown functionality for time-based posts

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

interface TimerDisplayProps {
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'expired';
  size?: 'small' | 'medium' | 'large';
  onTimerComplete?: () => void;
  showProgress?: boolean;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  percentage: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  startTime,
  endTime,
  status,
  size = 'medium',
  onTimerComplete,
  showProgress = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    percentage: 0,
  });
  
  const [animationValue] = useState(new Animated.Value(1));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = startTime.getTime();
      const end = endTime.getTime();
      
      if (status === 'completed' || status === 'expired') {
        clearInterval(interval);
        return;
      }

      if (now >= end) {
        // Timer completed
        setTimeRemaining({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          percentage: 100,
        });
        onTimerComplete?.();
        clearInterval(interval);
        return;
      }

      const remaining = end - now;
      const total = end - start;
      const percentage = ((total - remaining) / total) * 100;

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining({
        hours,
        minutes,
        seconds,
        totalSeconds: Math.floor(remaining / 1000),
        percentage,
      });

      // Animate when timer is running low (last 10% of time)
      if (percentage > 90) {
        Animated.sequence([
          Animated.timing(animationValue, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, status, onTimerComplete]);

  const getTimerColor = () => {
    if (status === 'completed') return '#4CAF50';
    if (status === 'expired') return '#F44336';
    if (timeRemaining.percentage > 80) return '#FF9800';
    return '#2196F3';
  };

  const getTimerGradient = () => {
    if (status === 'completed') return ['#4CAF50', '#45A049'];
    if (status === 'expired') return ['#F44336', '#E53935'];
    if (timeRemaining.percentage > 80) return ['#FF9800', '#F57C00'];
    return ['#2196F3', '#1976D2'];
  };

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0');
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { minWidth: 80, minHeight: 30 },
          text: { fontSize: 12 },
          progressBar: { height: 2 },
        };
      case 'large':
        return {
          container: { minWidth: 160, minHeight: 60 },
          text: { fontSize: 20 },
          progressBar: { height: 6 },
        };
      default:
        return {
          container: { minWidth: 120, minHeight: 40 },
          text: { fontSize: 16 },
          progressBar: { height: 4 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const timerColor = getTimerColor();
  const timerGradient = getTimerGradient();

  return (
    <Animated.View 
      style={[
        styles.container, 
        sizeStyles.container,
        { 
          transform: [{ scale: animationValue }],
          backgroundColor: timerColor,
        }
      ]}
    >
      <View style={styles.timerContent}>
          {status === 'active' && (
            <>
              <View style={styles.timeDisplay}>
                {timeRemaining.hours > 0 && (
                  <>
                    <Text style={[styles.timeText, sizeStyles.text]}>
                      {formatTime(timeRemaining.hours)}
                    </Text>
                    <Text style={[styles.separator, sizeStyles.text]}>:</Text>
                  </>
                )}
                <Text style={[styles.timeText, sizeStyles.text]}>
                  {formatTime(timeRemaining.minutes)}
                </Text>
                <Text style={[styles.separator, sizeStyles.text]}>:</Text>
                <Text style={[styles.timeText, sizeStyles.text]}>
                  {formatTime(timeRemaining.seconds)}
                </Text>
              </View>
              
              {showProgress && (
                <View style={[styles.progressContainer, { height: sizeStyles.progressBar.height }]}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${timeRemaining.percentage}%`,
                        height: sizeStyles.progressBar.height,
                      }
                    ]} 
                  />
                </View>
              )}
            </>
          )}

          {status === 'completed' && (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusIcon, sizeStyles.text]}>✅</Text>
              <Text style={[styles.statusText, sizeStyles.text]}>Tamamlandı</Text>
            </View>
          )}

          {status === 'expired' && (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusIcon, sizeStyles.text]}>⏰</Text>
              <Text style={[styles.statusText, sizeStyles.text]}>Süresi Doldu</Text>
            </View>
          )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  separator: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    color: '#FFFFFF',
    marginRight: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TimerDisplay;