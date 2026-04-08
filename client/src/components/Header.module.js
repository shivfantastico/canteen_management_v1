/**
 * src/components/Header.module.js
 * Lloyds brand header — crimson red background, white text.
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: {
    backgroundColor: '#C0000A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
    paddingTop:-30
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#C0000A',
  },
  side: { width: 44, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },

  // Back button
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  arrow: {
    width: 9, height: 9,
    borderLeftWidth: 2.5, borderBottomWidth: 2.5,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginLeft: 3,
  },

  // Gear logo
  gear: { justifyContent: 'center', alignItems: 'center' },
  gearOuter: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  gearInner: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.85)',
  },
  spoke: {
    position: 'absolute',
    width: 24, height: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    top: '50%', left: '50%',
    marginLeft: -12, marginTop: -1,
  },

  // Text
  title: {
    fontSize: 17, fontWeight: '700',
    color: '#FFFFFF', letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11, fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 1,
  },

  // Avatar
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarTxt: {
    fontSize: 13, fontWeight: '800',
    color: '#FFFFFF', letterSpacing: 0.5,
  },

  // dropdown

  dropdown: {
  position: "absolute",
  top: 40,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 8,
  paddingVertical: 2,
  width: 78,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 6,
  zIndex: 999
},

dropdownItem: {
  paddingVertical: 5,
  paddingHorizontal: 15
},

dropdownText: {
  fontSize: 14,
  fontWeight: "500",
  color: "#333"
}

});