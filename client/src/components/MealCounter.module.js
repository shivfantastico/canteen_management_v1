/**
 * src/components/MealCounter.module.js
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#EEEEEE',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardActive: {
    borderColor: 'rgba(192,0,10,0.22)',
    backgroundColor: '#FFFAFB',
  },

  left: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  emoji: { fontSize: 22 },
  name: { fontSize: 15, fontWeight: '600', color: '#111111', marginBottom: 2 },
  nameActive: { color: '#C0000A' },
  time: { fontSize: 11, color: '#AAAAAA' },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  btnAdd: { backgroundColor: '#C0000A', borderColor: '#C0000A' },
  btnOff: { opacity: 0.32 },
  btnTxt: { fontSize: 20, fontWeight: '700', color: '#777777', lineHeight: 24 },
  btnTxtAdd: { color: '#FFFFFF' },
  btnTxtOff: { color: '#AAAAAA' },

  qtyBox: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  qtyBoxActive: {
    backgroundColor: 'rgba(192,0,10,0.10)',
    borderColor: 'rgba(192,0,10,0.3)',
  },
  qty: { fontSize: 16, fontWeight: '900', color: '#777777' },
  qtyActive: { color: '#C0000A' },

    countdownChip: {
    backgroundColor: '#FFF3E0', borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#FFB300',
  },
  countdownTxt: { fontSize: 10, fontWeight: '700', color: '#E65100' },

  deadlineRow: { flexDirection: 'row', alignItems: 'center' },
  deadlineTxt: { fontSize: 10.5, fontWeight: '500', flexShrink: 1 },

});