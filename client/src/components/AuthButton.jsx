/**
 * components/AuthButton.jsx
 * ─────────────────────────────────────────────────────────────────
 * Reusable branded button for authentication screens.
 *
 * Features:
 *  • Animated scale-down on press (tactile feedback)
 *  • Loading spinner state
 *  • Variant support: "primary" (red fill) | "outline" (ghost)
 *  • Disabled state with reduced opacity
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import styles from './AuthButton.module';

const AuthButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'outline'
}) => {
  // ── Press animation ref ────────────────────────────────────────
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  // ── Dynamic style composition ──────────────────────────────────
  const buttonContainerStyle = [
    styles.button,
    variant === 'outline' ? styles.buttonOutline : styles.buttonPrimary,
    (disabled || loading) && styles.buttonDisabled,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    variant === 'outline' ? styles.buttonTextOutline : styles.buttonTextPrimary,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonContainerStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1} // We handle opacity manually via animation
      >
        {loading ? (
          /* Loading spinner replaces text during async ops */
          <ActivityIndicator
            color={variant === 'outline' ? '#C0000A' : '#FFFFFF'}
            size="small"
          />
        ) : (
          <View style={styles.buttonInner}>
            <Text style={buttonTextStyle}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AuthButton;