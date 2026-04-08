/**
 * src/components/OrderCard.module.js
 */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    marginHorizontal: 16, marginVertical: 6, padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },

  // Top row
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderNum: { fontSize: 14, fontWeight: '700', color: '#111111' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  badgeTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },

  // Meal row
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emojiBox: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 24 },
  mealMeta: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  mealDate: { fontSize: 12, color: '#777777' },
  qtyBox: {
    alignItems: 'center', backgroundColor: '#F5F6FA',
    borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10, minWidth: 48,
  },
  qtyLbl: { fontSize: 9,  fontWeight: '700', color: '#AAAAAA', letterSpacing: 1 },
  qtyVal: { fontSize: 20, fontWeight: '900', color: '#C0000A', lineHeight: 24 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F6FA', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100,
  },
  typeTxt:        { fontSize: 12, fontWeight: '500', color: '#777777' },
  bookingTypeTxt: { fontSize: 12, fontWeight: '700', color: '#C0000A', letterSpacing: 0.5 },
  placedTxt:      { fontSize: 11, color: '#AAAAAA' },

  // Action buttons row (UPCOMING only)
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // Edit button — blue outline circle
  editBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#EEF4FF',
    borderWidth: 1.5, borderColor: '#1565C0',
    justifyContent: 'center', alignItems: 'center',
  },
  editBtnTxt: { fontSize: 15, color: '#1565C0', fontWeight: '700' },

  // Cancel button — red outline circle
  cancelBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FFF0F0',
    borderWidth: 1.5, borderColor: '#C62828',
    justifyContent: 'center', alignItems: 'center',
  },
  cancelBtnTxt: { fontSize: 14, color: '#C62828', fontWeight: '700' },

  // Placed sub-line below footer for upcoming cards
  placedTxtSmall: { fontSize: 10, color: '#BBBBBB', marginTop: 8, textAlign: 'right' },
});