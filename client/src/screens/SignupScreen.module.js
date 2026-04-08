/**
 * Screens/SignupScreen.module.js
 * ─────────────────────────────────────────────────────────────────
 * Styles for SignupScreen — same industrial brand as LoginScreen
 * with additional section-grouped layout for the richer form.
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

  // ── Background ────────────────────────────────────────────────
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
    borderBottomRightRadius: width * 0.15,
    borderBottomLeftRadius: width * 0.15,
    opacity: 0.9,
  },
  bgBottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#C0000A',
  },

  // ── Back button ───────────────────────────────────────────────
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
    marginTop:5,
    zIndex: 10,
    gap: 8,
  },
  backArrow: {
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── KAV + Scroll ──────────────────────────────────────────────
  kavContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  // ── Card ──────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // ── Form ──────────────────────────────────────────────────────
  form: {
    marginTop: 6,
  },

  // ── Section label row ─────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C0000A',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#9f300e',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  // ── Role selector ─────────────────────────────────────────────
  roleRow: {
    marginBottom: 10,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#777777',
    marginBottom: 10,
  },
  rolePills: {
    flexDirection: 'row',
    gap: 10,
  },
  rolePill: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DCDCDC',
    backgroundColor: '#F8F8F8',
  },
  rolePillActive: {
    borderColor: '#C0000A',
    backgroundColor: '#C0000A',
    shadowColor: '#C0000A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#999999',
  },
  rolePillTextActive: {
    color: '#FFFFFF',
  },

  // ── Role hint ─────────────────────────────────────────────────
  roleHint: {
    backgroundColor: '#FFF8F8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    borderLeftWidth: 3,
    borderLeftColor: '#C0000A',
  },
  roleHintText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
    fontWeight: '400',
  },

  // ── Password strength ─────────────────────────────────────────
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -12,
    marginBottom: 14,
    gap: 5,
  },
  strengthLabel: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
    marginRight: 2,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
    marginLeft: 4,
    width: 42,
    textAlign: 'right',
  },

  // ── Submit wrapper ────────────────────────────────────────────
  submitWrapper: {
    marginTop: 12,
  },

  // ── Link to Login ─────────────────────────────────────────────
  loginLinkRow: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '400',
  },
  loginLinkAccent: {
    color: '#C0000A',
    fontWeight: '700',
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
    position: 'absolute', bottom: 70,
    left: 24, right: 24,
    backgroundColor: '#1A1A1A', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  toastTxt: { fontSize: 13, fontWeight: '500', color: '#FFFFFF' },

});

export default styles;