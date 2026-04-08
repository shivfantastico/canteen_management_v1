/**
 * components/AuthHeader.jsx
 * ─────────────────────────────────────────────────────────────────
 * Branded header for all authentication screens.
 *
 * Displays:
 *  • Lloyds Metals logo section (gear icon + company name)
 *  • App subtitle: "Canteen Management System"
 *  • Screen-level title (e.g., "Welcome Back", "Create Account")
 *  • Optional subtitle/tagline per screen
 *
 * Note: Since we cannot use external image assets at build time,
 * the logo is recreated programmatically using RN primitives
 * matching the brand exactly: red bg, black text, gear SVG shape.
 * Replace the <LogoBadge> with an <Image> once logo asset is added.
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './AuthHeader.module';
import logo from "../../assets/lloyds_metals_logo.png"

// ── Programmatic Logo Badge ──────────────────────────────────────
// Recreates the Lloyds Metals logo look: gear circle + red banner
const LogoBadge = () => (
  <View style={styles.logoBadge}>
    <Image source={logo} style={styles.logo}/>
  </View>
);

// ── Main AuthHeader Component ────────────────────────────────────
const AuthHeader = ({
  title,
  subtitle = '',
  showDivider = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <LogoBadge />

      {/* App label */}
      <View style={styles.appLabelRow}>
        <Text style={styles.appLabel}>Canteen Management System</Text>
      </View>

      {/* Divider */}
      {showDivider && (
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>
      )}

      {/* Screen title */}
      <Text style={styles.screenTitle}>{title}</Text>

      {/* Screen subtitle */}
      {!!subtitle && (
        <Text style={styles.screenSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

export default AuthHeader;