/**
 * components/AuthButton.module.js
 * ─────────────────────────────────────────────────────────────────
 * Styles for AuthButton component.
 * Lloyds Metals brand: Crimson #C0000A, Black #1A1A1A, White #FFFFFF
 * ─────────────────────────────────────────────────────────────────
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ── Base button ──────────────────────────────────────────────
  button: {
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    // Elevation shadow
    shadowColor: '#C0000A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // ── Primary variant: solid Lloyds red ───────────────────────
  buttonPrimary: {
    backgroundColor: '#C0000A',
  },

  // ── Outline variant: ghost button ────────────────────────────
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#C0000A',
    shadowColor: 'transparent',
    elevation: 0,
  },

  // ── Disabled state ───────────────────────────────────────────
  buttonDisabled: {
    opacity: 0.55,
  },

  // ── Inner wrapper (for icon+text rows if needed) ─────────────
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // ── Text styles ──────────────────────────────────────────────
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  buttonTextPrimary: {
    color: '#FFFFFF',
  },

  buttonTextOutline: {
    color: '#C0000A',
  },
});

export default styles;