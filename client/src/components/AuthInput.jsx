/**
 * components/AuthInput.jsx
 * ─────────────────────────────────────────────────────────────────
 * Reusable text input for authentication screens.
 *
 * Features:
 *  • Animated focus border (transitions to brand red on focus)
 *  • Left icon slot for contextual icons (email, lock, user, etc.)
 *  • Show/Hide password toggle for secure fields
 *  • Inline validation error message display
 *  • Fully controlled input (value + onChangeText)
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import styles from './AuthInput.module';

const AuthInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon = null,   // React element: e.g. <Icon name="email" />
  editable = true,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Animated border color on focus/blur ───────────────────────
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  // Interpolate border color: neutral → brand red (or error red)
  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? '#C0000A' : '#DCDCDC',
      '#C0000A',
    ],
  });

  // Shadow intensifies on focus
  const animatedShadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.04, 0.14],
  });

  return (
    <View style={styles.wrapper}>

      {/* ── Field Label ─────────────────────────────────────── */}
      <Text style={[styles.label, isFocused && styles.labelFocused, error && styles.labelError]}>
        {label}
      </Text>

      {/* ── Animated Input Container ─────────────────────────── */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: animatedBorderColor,
            shadowOpacity: animatedShadowOpacity,
          },
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {/* Left icon (optional) */}
        {leftIcon && (
          <View style={styles.iconLeft}>
            {leftIcon}
          </View>
        )}

        {/* Text input field */}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          maxLength={maxLength}
        />

        {/* Show/Hide password toggle */}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(prev => !prev)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {/* Text toggle — replace with an icon library if available */}
            <Text style={styles.eyeButtonText}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ── Validation Error Message ──────────────────────────── */}
      {!!error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorDot}>●</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default AuthInput;