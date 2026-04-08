/**
 * components/AuthHeader.module.js
 * ─────────────────────────────────────────────────────────────────
 * Styles for AuthHeader — Lloyds brand: Red #C0000A, Black, White
 * ─────────────────────────────────────────────────────────────────
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ── Outer container ──────────────────────────────────────────
  container: {
    alignItems: 'center',
    paddingBottom: 8,
  },

  // ── Logo badge: gear + name banner ───────────────────────────

  logoBadge: {
    justifyContent:"center",
    alignItems:"center",
    marginBottom:13
  },
  logo:{
    width:310,
    height:40,
    borderRadius:5
  },

  // ── Gear icon section ─────────────────────────────────────────
  gearContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    width: 52,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    borderColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  spoke: {
    position: 'absolute',
    width: 22,
    height: 1.5,
    backgroundColor: '#1A1A1A',
  },
  gearHub: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
  },

  // ── Red name banner ───────────────────────────────────────────
  nameBanner: {
    backgroundColor: '#C0000A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: 130,
    height: 42,
  },
  nameText: {
    color: '#1A1A1A',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 20,
  },
  nameTextSmall: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 1.5,
    lineHeight: 12,
  },

  // ── App label below logo ──────────────────────────────────────
  appLabelRow: {
    backgroundColor: 'rgba(192, 0, 10, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(192, 0, 10, 0.2)',
  },
  appLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#C0000A',
  },

  // ── Decorative divider ────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '70%',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C0000A',
  },

  // ── Screen-level title ────────────────────────────────────────
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 6,
  },

  // ── Screen subtitle ───────────────────────────────────────────
  screenSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
});

export default styles;