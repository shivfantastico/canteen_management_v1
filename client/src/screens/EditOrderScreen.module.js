/**
 * src/screens/EditOrderScreen.module.js
 * Shares the same design language as CreateOrderScreen.module.js
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // ROOT
  screen:  { flex: 1, backgroundColor: '#F5F6FA', marginTop: 40 },
  scroll:  { flex: 1 },
  content: { paddingBottom: 64 },

  // HERO BANNER
  heroBg:       { height: 120, justifyContent: 'flex-end' },
  heroBgImg:    { opacity: 1 },
  heroOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(120,0,6,0.82)' },
  heroInner:    { padding: 16, paddingBottom: 14 },
  heroTitle:    { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  heroBrand:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  heroBrandDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  heroBrandTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 2.5, color: 'rgba(255,255,255,0.6)' },

  // ORDER INFO BANNER
  infoBanner: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    margin: 16, marginBottom: 4, padding: 16,
    borderWidth: 1.5, borderColor: 'rgba(192,0,10,0.15)',
    shadowColor: '#C0000A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  infoBannerRow: { flexDirection: 'row', gap: 16 },
  infoDivider:   { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  infoRow:       { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoIcon:      { fontSize: 18, marginTop: 1 },
  infoTexts:     { flex: 1 },
  infoLabel:     { fontSize: 10, fontWeight: '600', color: '#AAAAAA', letterSpacing: 0.5, marginBottom: 2 },
  infoValue:     { fontSize: 13, fontWeight: '700', color: '#111111' },
  infoNote: {
    marginTop: 10, backgroundColor: 'rgba(192,0,10,0.05)',
    borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: 'rgba(192,0,10,0.12)',
  },
  infoNoteTxt: { fontSize: 12, color: '#666666', lineHeight: 17 },

  // SECTION CARD
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    margin: 16, marginBottom: 4, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  secHead:     { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  secAccent:   { width: 4, height: 16, borderRadius: 2, backgroundColor: '#C0000A' },
  secTitle:    { fontSize: 15, fontWeight: '700', color: '#111111', flex: 1 },
  secBadge:    { backgroundColor: 'rgba(192,0,10,0.10)', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
  secBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#C0000A' },

  // DATE STRIP
  dateBanner: {
    backgroundColor: 'rgba(192,0,10,0.07)',
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14,
    marginBottom: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(192,0,10,0.15)',
  },
  dateBannerTxt: { fontSize: 13, fontWeight: '600', color: '#C0000A' },
  strip:         { paddingVertical: 4, gap: 6 },
  dateCell: {
    width: 58, alignItems: 'center', paddingVertical: 10,
    borderRadius: 12, backgroundColor: '#F5F6FA',
    borderWidth: 1.5, borderColor: '#EEEEEE',
  },
  dateCellOn: { backgroundColor: '#C0000A', borderColor: '#C0000A' },
  dcDay:      { fontSize: 10, fontWeight: '600', color: '#AAAAAA', marginBottom: 2 },
  dcNum:      { fontSize: 18, fontWeight: '900', color: '#111111', lineHeight: 22 },
  dcMon:      { fontSize: 9,  fontWeight: '500', color: '#AAAAAA', marginTop: 1 },
  dcOn:       { color: '#FFFFFF' },
  todayDot:   { width: 5, height: 5, borderRadius: 3, backgroundColor: '#C0000A', marginTop: 3 },
  todayDotOn: { backgroundColor: 'rgba(255,255,255,0.8)' },

  // MEAL TYPE PICKER (2×2 grid)
  mealPickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  mealPickerPill: { width: '47.5%', position: 'relative' },
  mealPickerPillOn: {},
  mealPickerCheckWrap: {
    position: 'absolute', top: 6, right: 6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#C0000A', justifyContent: 'center', alignItems: 'center',
    zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2, elevation: 4,
  },
  mealPickerCheckTxt: { fontSize: 12, fontWeight: '900', color: '#FFFFFF' },

  mealCard: {
    width: '100%', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#EEEEEE', backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  mealCardOpen:   { borderColor: 'rgba(46,125,50,0.25)' },
  mealCardUrgent: { borderColor: '#FF8F00', borderWidth: 2 },
  mealCardClosed: { borderColor: '#EEEEEE', opacity: 0.9 },
  mealCardBand: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10, paddingVertical: 9,
  },
  mealEmoji:    { fontSize: 26 },
  mealEmojiDim: { opacity: 0.30 },
  statusBadge:    { borderRadius: 100, paddingHorizontal: 6, paddingVertical: 2, marginRight: 6, marginTop: 6 },
  statusBadgeTxt: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.6 },
  mealCardBody:   { padding: 10, paddingTop: 6 },
  mealCardName:   { fontSize: 13, fontWeight: '700', letterSpacing: 0.1, marginBottom: 2 },
  countdownChip:  {
    backgroundColor: '#FFF3E0', borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#FFB300',
  },
  countdownTxt:  { fontSize: 10, fontWeight: '700', color: '#E65100' },
  deadlineRow:   { flexDirection: 'row', alignItems: 'center' },
  deadlineTxt:   { fontSize: 10, fontWeight: '500', flexShrink: 1 },
  closedOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(248,248,248,0.45)',
  },

  // MEAL COUNTER CARD (inline for SINGLE edit)
  mealCounterCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#EEEEEE',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  mealCounterCardActive: {
    borderColor: 'rgba(192,0,10,0.22)', backgroundColor: '#FFFAFB',
  },
  mealCounterLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  mealCounterIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mealCounterName: { fontSize: 15, fontWeight: '600', color: '#111111', marginBottom: 2 },
  mealCounterTime: { fontSize: 11, color: '#AAAAAA' },

  // STEPPER
  stepperRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#EEEEEE',
  },
  stepperBtnAdd:    { backgroundColor: '#C0000A', borderColor: '#C0000A' },
  stepperBtnOff:    { opacity: 0.32 },
  stepperBtnTxt:    { fontSize: 22, fontWeight: '700', color: '#555555', lineHeight: 26 },
  stepperBtnTxtAdd: { color: '#FFFFFF' },
  stepperBtnTxtOff: { color: '#BBBBBB' },
  stepperQty: {
    width: 52, height: 38, borderRadius: 12,
    backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#EEEEEE',
  },
  stepperQtyActive: {
    backgroundColor: 'rgba(192,0,10,0.08)', borderColor: 'rgba(192,0,10,0.2)',
  },
  stepperQtyTxt:       { fontSize: 18, fontWeight: '900', color: '#777777' },
  stepperQtyTxtActive: { color: '#C0000A' },

  // VENDOR QTY ROW
  vendorQtyRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  vendorQtyLabel: { fontSize: 14, fontWeight: '600', color: '#222222' },

  // FORM INPUT
  fieldWrap:        { marginBottom: 14 },
  fieldLabel:       { fontSize: 12, fontWeight: '600', color: '#777777', marginBottom: 6, letterSpacing: 0.3 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F8F8', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#EEEEEE',
    paddingHorizontal: 12, height: 50,
  },
  fieldRowLocked:   { backgroundColor: '#F3F3F3', borderColor: '#E8E8E8' },
  fieldIcon:        { fontSize: 18, marginRight: 10 },
  fieldInput:       { flex: 1, fontSize: 14, fontWeight: '500', color: '#111111' },
  fieldInputLocked: { color: '#888888' },
  fieldLockIcon:    { fontSize: 14, marginLeft: 6 },

  // ORDER SUMMARY CARD
  summary: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    margin: 16, marginBottom: 4, padding: 16,
    borderWidth: 1.5, borderColor: 'rgba(192,0,10,0.18)',
    shadowColor: '#C0000A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: '#111111', marginBottom: 12 },
  sumRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  sumLeft:      { fontSize: 13, color: '#777777' },
  sumRight:     { fontSize: 13, fontWeight: '600', color: '#111111' },
  sumDivider:   { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },
  sumBold:      { fontWeight: '700', color: '#111111' },
  sumTotalVal:  { fontWeight: '900', color: '#C0000A', fontSize: 20 },

  // SUBMIT BUTTON
  submitBtn: {
    flexDirection: 'row', backgroundColor: '#C0000A',
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 14, height: 56,
    justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: '#C0000A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40, shadowRadius: 12, elevation: 10,
  },
  submitOff:   { opacity: 0.42, shadowOpacity: 0 },
  submitTxt:   { fontSize: 16, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  submitArrow: { fontSize: 18, fontWeight: '900', color: 'rgba(255,255,255,0.75)' },
  hint: {
    fontSize: 11, color: '#AAAAAA', textAlign: 'center',
    lineHeight: 16, marginTop: 12, marginBottom: 8, marginHorizontal: 24,
  },

  // TOAST
  toast: {
    position: 'absolute', bottom: 28, left: 24, right: 24,
    backgroundColor: '#C62828', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  toastOk:  { backgroundColor: '#2E7D32' },
  toastTxt: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  // SUCCESS MODAL
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  modal: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: 32, alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3, shadowRadius: 24, elevation: 18,
  },
  checkCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, borderWidth: 3, borderColor: '#2E7D32',
  },
  checkTxt:   { fontSize: 32, color: '#2E7D32', fontWeight: '900' },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#111111', marginBottom: 8 },
  modalSub:   { fontSize: 14, color: '#777777', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalBtn: {
    backgroundColor: '#C0000A', borderRadius: 12,
    paddingVertical: 14, width: '100%', alignItems: 'center',
    shadowColor: '#C0000A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  modalBtnTxt: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.4 },

  // CALENDAR MODAL
  calModalOverlay:   { flex: 1, justifyContent: 'flex-end' },
  calModalBackdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.52)' },
  calModalSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingBottom: 32, paddingTop: 12, maxHeight: '92%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14, shadowRadius: 16, elevation: 20,
  },
  calModalHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDDDDD', alignSelf: 'center', marginBottom: 16 },
  calModalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  calModalTitle:   { fontSize: 18, fontWeight: '800', color: '#111111', letterSpacing: -0.2 },
  calModalSub:     { fontSize: 12, color: '#888888', fontWeight: '400', marginTop: 3 },
  calModalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  calModalCloseTxt: { fontSize: 14, fontWeight: '700', color: '#777777' },
  calHintRow: {
    backgroundColor: 'rgba(192,0,10,0.05)', borderRadius: 10, padding: 10, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(192,0,10,0.12)',
  },
  calHintTxt:  { fontSize: 12, color: '#666666', lineHeight: 17 },
  calHintBold: { fontWeight: '700', color: '#C0000A' },

  // MONTHLY CONFIRMED CARD
  monthlyConfirmedCard: { borderRadius: 14, borderWidth: 1.5, borderColor: '#EEEEEE', backgroundColor: '#FAFAFA', padding: 14, gap: 12 },
  monthlyMealChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5, gap: 6 },
  monthlyMealChipEmoji: { fontSize: 16 },
  monthlyMealChipName:  { fontSize: 13, fontWeight: '700' },
  monthlyStatsRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', paddingVertical: 10,
  },
  monthlyStat:        { flex: 1, alignItems: 'center' },
  monthlyStatNum:     { fontSize: 20, fontWeight: '900', lineHeight: 24 },
  monthlyStatLbl:     { fontSize: 9, color: '#AAAAAA', fontWeight: '500', marginTop: 2, textAlign: 'center' },
  monthlyStatDivider: { width: 1, height: 32, backgroundColor: '#EEEEEE' },
  monthlyEditBtn:     { borderRadius: 10, borderWidth: 1.5, paddingVertical: 10, alignItems: 'center' },
  monthlyEditBtnTxt:  { fontSize: 13, fontWeight: '700' },

  // OPEN CALENDAR BUTTON
  openCalBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E0E0E0', padding: 16, gap: 12,
  },
  openCalBtnIcon:  { fontSize: 28 },
  openCalBtnTitle: { fontSize: 14, fontWeight: '700', color: '#111111', marginBottom: 2 },
  openCalBtnSub:   { fontSize: 11, color: '#AAAAAA' },
  openCalBtnArrow: { fontSize: 24, color: '#CCCCCC' },
});