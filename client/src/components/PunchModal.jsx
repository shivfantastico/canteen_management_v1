
/**
 * src/components/PunchModal.jsx
 * Professional meal verification modal with clean, minimal design.
 * Handles both COMPLETED and DENIED states with contextual feedback.
 * No glossy effects - Simple, professional, and elegant.
 */

import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// ─────────────────────────────────────────────────────────────────
// PROFESSIONAL COLOR & DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────
const COLORS = {
  // Success state - Clean emerald
  success: {
    primary: "#065F46",
    secondary: "#047857",
    accent: "#10B981",
    light: "#F0FDF4",
    background: "#FFFFFF",
    glow: "rgba(16, 185, 129, 0.06)",
  },
  // Denied state - Clean ruby
  denied: {
    primary: "#7F1D1D",
    secondary: "#991B1B",
    accent: "#DC2626",
    light: "#FEF2F2",
    background: "#FFFFFF",
    glow: "rgba(220, 38, 38, 0.06)",
  },
  // Neutral palette
  neutral: {
    white: "#FFFFFF",
    dark: "#0F172A",
    gray_600: "#475569",
    gray_400: "#94A3B8",
    gray_200: "#E2E8F0",
    border: "#E2E8F0",
  },
};

// ─────────────────────────────────────────────────────────────────
// DESIGN SYSTEM CONSTANTS
// ─────────────────────────────────────────────────────────────────
const SPACING = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

// ─────────────────────────────────────────────────────────────────
// PUNCH MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────
const PunchModal = ({ visible, punchResult, onClose }) => {
  const isSuccess = punchResult?.status === "COMPLETED";
  const colorScheme = isSuccess ? COLORS.success : COLORS.denied;

  // Animation references
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation orchestration
  useEffect(() => {
    if (!visible) {
      resetAnimations();
      return;
    }

    triggerEntranceAnimation();
  }, [visible]);

  const resetAnimations = () => {
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);
    slideUpAnim.setValue(50);
    iconRotateAnim.setValue(0);
    iconScaleAnim.setValue(0);
    pulseAnim.setValue(1);
  };

  const triggerEntranceAnimation = () => {
    // Phase 1: Backdrop and card entrance
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 35,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: Icon entrance
      Animated.sequence([
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Phase 3: Pulse animation (2 cycles)
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.08,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 2 }
        ),
      ]).start();
    });
  };

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* PROFESSIONAL BACKDROP */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        {/* MODAL CONTAINER */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideUpAnim },
              ],
            },
          ]}
        >
          {/* CLEAN CARD - SOLID BACKGROUND */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colorScheme.background,
                borderTopColor: colorScheme.primary,
              },
              SHADOWS.lg,
            ]}
          >
            {/* SUBTLE GLOW ELEMENT */}
            <View
              style={[
                styles.glowElement,
                {
                  backgroundColor: colorScheme.glow,
                },
              ]}
            />

            {/* ICON SECTION */}
            <Animated.View
              style={[
                styles.iconSection,
                {
                  transform: [
                    { scale: Animated.add(iconScaleAnim, 0.92) },
                    { rotate: iconRotation },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: colorScheme.light,
                    borderColor: colorScheme.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.iconSymbol,
                    {
                      color: colorScheme.primary,
                    },
                  ]}
                >
                  {isSuccess ? "✓" : "✕"}
                </Text>
              </View>
            </Animated.View>

            {/* TITLE */}
            <Text
              style={[
                styles.title,
                {
                  color: colorScheme.primary,
                },
              ]}
              numberOfLines={1}
            >
              {isSuccess ? "Meal Verified" : "Access Denied"}
            </Text>

            {/* SUBTLE DIVIDER */}
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: colorScheme.accent,
                },
              ]}
            />

            {/* MESSAGE */}
            <Text
              style={[
                styles.message,
                {
                  color: COLORS.neutral.gray_600,
                },
              ]}
              numberOfLines={4}
            >
              {punchResult?.message}
            </Text>

            {/* INFO CARD - CLEAN DESIGN */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colorScheme.light,
                  borderLeftColor: colorScheme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: colorScheme.primary,
                  },
                ]}
              >
                {isSuccess ? "Order ID" : "Next Available"}
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: colorScheme.primary,
                  },
                ]}
                numberOfLines={1}
              >
                {isSuccess
                  ? punchResult?.order_number
                  : punchResult?.next_allowed_meal}
              </Text>
            </View>

            {/* TIMESTAMP */}
            <Text
              style={[
                styles.timestamp,
                {
                  color: COLORS.neutral.gray_500,
                },
              ]}
            >
              {formatTimestamp(new Date())}
            </Text>

            {/* CLEAN BUTTON - SOLID COLOR */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colorScheme.primary,
                },
              ]}
              onPress={handleClose}
              activeOpacity={0.92}
            >
              <Text style={styles.buttonText}>
                {isSuccess ? "Got it" : "Understood"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────
const formatTimestamp = (date) => {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// ─────────────────────────────────────────────────────────────────
// PROFESSIONAL STYLES - CLEAN & MINIMAL
// ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },

  modalContainer: {
    width: "100%",
    paddingHorizontal: SPACING.xxl,
    alignItems: "center",
  },

  // SOLID WHITE CARD - NO GRADIENT
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xxl,
    alignItems: "center",
    overflow: "hidden",
    borderTopWidth: 3,
  },

  glowElement: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },

  iconSection: {
    marginBottom: SPACING.xl,
    zIndex: 10,
  },

  iconContainer: {
    width: 25,
    height: 25,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "transparent",
    ...SHADOWS.md,
  },

  iconSymbol: {
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginBottom: SPACING.md,
    textAlign: "center",
  },

  divider: {
    height: 3,
    width: 28,
    marginBottom: SPACING.lg,
    borderRadius: 1.5,
  },

  message: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 23,
    textAlign: "center",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },

  infoCard: {
    width: "100%",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.xl,
    backgroundColor: "transparent",
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
    opacity: 0.75,
  },

  infoValue: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  timestamp: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: SPACING.xl,
  },

  // CLEAN SOLID BUTTON - NO GRADIENT
  button: {
    width: "100%",
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.neutral.white,
  },
});

export default PunchModal; 