/**
 * components/AuthInput.module.js
 * ─────────────────────────────────────────────────────────────────
 * Styles for AuthInput component.
 * ─────────────────────────────────────────────────────────────────
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ── Outer wrapper adds vertical rhythm ──────────────────────
  wrapper: {
    marginBottom: 18,
  },

  // ── Label above input ────────────────────────────────────────
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#777777',
    marginBottom: 7,
  },
  labelFocused: {
    color: '#C0000A',
  },
  labelError: {
    color: '#C0000A',
  },

  // ── Main input container (animated border) ───────────────────
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DCDCDC',
    height: 54,
    paddingHorizontal: 14,
    // Shadow (cross-platform)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputContainerDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },

  // ── Left icon container ──────────────────────────────────────
  iconLeft: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
  },

  // ── Text input ───────────────────────────────────────────────
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#1A1A1A',
    paddingVertical: 0, // Normalize across Android/iOS
  },
  inputWithIcon: {
    // Icon already provides left spacing
  },

  // ── Show/Hide eye button ─────────────────────────────────────
  eyeButton: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  eyeButtonText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#C0000A',
  },

  // ── Error message row ────────────────────────────────────────
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  errorDot: {
    fontSize: 6,
    color: '#C0000A',
  },
  errorText: {
    fontSize: 12,
    color: '#C0000A',
    fontWeight: '500',
  },
});

export default styles;