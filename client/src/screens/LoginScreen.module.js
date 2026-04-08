/**
 * Screens/LoginScreen.module.js
 * ─────────────────────────────────────────────────────────────────
 * Styles for LoginScreen.
 * Industrial aesthetic: deep charcoal bg, red accents, white card
 * ─────────────────────────────────────────────────────────────────
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ── Safe Area ────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: '#111111',
  },

  // ── Background layers ─────────────────────────────────────────
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#161616',
  },
  bgTopBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.38,
    backgroundColor: '#C0000A',
    // Diagonal cut via borderBottomRightRadius trick
    borderBottomRightRadius: width * 0.15,
    borderBottomLeftRadius: width * 0.15,
    opacity: 0.95,
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    opacity: 0.04,
  },
  bgStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: '#FFFFFF',
  },
  bgBottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#C0000A',
  },

  // ── KAV & Scroll ─────────────────────────────────────────────
  kavContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: height,
  },

  // ── Main card ─────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 30,
    // Card shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
    // Subtle border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // ── Form area ─────────────────────────────────────────────────
  form: {
    marginTop: 8,
  },

  // ── Forgot password ───────────────────────────────────────────
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C0000A',
    letterSpacing: 0.3,
  },

  // ── OR divider ────────────────────────────────────────────────
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  orText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    letterSpacing: 2,
  },

  // ── Footer ────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  footerSubText: {
    fontSize: 10,
    color: '#CCCCCC',
    marginTop: 3,
    letterSpacing: 0.2,
  },

    // ── Toast ─────────────────────────────────────────────────────
  toast: {
    position: 'absolute', bottom: 72,
    left: 24, right: 24,
    backgroundColor: '#1A1A1A', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  toastTxt: { fontSize: 13, fontWeight: '500', color: '#FFFFFF' },
});

export default styles;