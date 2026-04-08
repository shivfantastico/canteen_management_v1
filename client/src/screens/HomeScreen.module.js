/**
 * src/screens/HomeScreen.module.js
 * Lloyds Metals & Energy — Home screen modular styles.
 * Includes full TodayMealStrip cutoff-aware styles.
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA', marginTop: 40 },

  // Hero banner
  heroBg: { height: 140, justifyContent: 'flex-end' },
  heroBgImg: { opacity: 1 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(130, 0, 6, 0.78)' },
  heroContent: { padding: 18, paddingBottom: 16 },
  heroGreeting: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3, marginBottom: 3 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '400', marginBottom: 10 },
  heroBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroBrandDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  heroBrandTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 2.5, color: 'rgba(255,255,255,0.6)' },

  // Loading
  loadWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadTxt: { fontSize: 14, color: '#777777', fontWeight: '500' },
  listContent: { paddingBottom: 120 },

  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, gap: 10, color:"#131212"},
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    alignItems: 'center', borderTopWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: '900', lineHeight: 34 },
  statLabel: { fontSize: 11, fontWeight: '500', color: '#211d1d', textAlign: 'center', marginTop: 2 },

  // ── TODAY'S MEAL STRIP (cutoff-aware) ────────────────────────
  todayWrap: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: '#FFFFFF',
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  todayTitle: { fontSize: 15, fontWeight: '700', color: '#111111', letterSpacing: 0.1 },
  todaySubtitle: { fontSize: 11, color: '#AAAAAA', marginTop: 2, fontWeight: '400' },

  availSummary: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5, gap: 5,
  },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availSummaryTxt: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },
  availSep: { fontSize: 12, color: '#CCCCCC' },

  mealGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  mealCard: {
    width: '47.5%', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#EEEEEE', backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  mealCardOpen:   { borderColor: 'rgba(46,125,50,0.25)' },
  mealCardUrgent: { borderColor: '#FF8F00', borderWidth: 2 },
  mealCardClosed: { borderColor: '#EEEEEE', opacity: 0.9 },

  mealCardBand: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10, paddingVertical: 9,
  },
  mealEmoji: { fontSize: 26 },
  mealEmojiDim: { opacity: 0.30 },

  statusBadge: { borderRadius: 100, paddingHorizontal: 7, paddingVertical: 3 },
  statusBadgeTxt: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.6 },

  mealCardBody: { padding: 10, paddingTop: 6 },
  mealCardName: { fontSize: 13, fontWeight: '700', letterSpacing: 0.1, marginBottom: 2 },
  mealCardPrice: { fontSize: 17, fontWeight: '900', color: '#111111', marginBottom: 6 },

  countdownChip: {
    backgroundColor: '#FFF3E0', borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#FFB300',
  },
  countdownTxt: { fontSize: 10, fontWeight: '700', color: '#E65100' },

  deadlineRow: { flexDirection: 'row', alignItems: 'center' },
  deadlineTxt: { fontSize: 10, fontWeight: '500', flexShrink: 1 },

  closedOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(248,248,248,0.45)',
  },

  todayFooterTxt: {
    fontSize: 10, color: '#BBBBBB', textAlign: 'center', marginTop: 12, fontWeight: '400',
  },

  // Section heading
  secHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 16, marginTop: 20, marginBottom: 10,
  },
  secTitle: { fontSize: 17, fontWeight: '700', color: '#111111' },
  secCount: { fontSize: 12, fontWeight: '500', color: '#AAAAAA' },

  // Filter tabs
  filterRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, gap: 6 },
  fTab: {
    flex: 1, paddingVertical: 8, borderRadius: 100,
    backgroundColor: '#FFFFFF', alignItems: 'center',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  fTabOn: { backgroundColor: '#C0000A', borderColor: '#C0000A' },
  fTxt: { fontSize: 11, fontWeight: '600', color: '#777777' },
  fTxtOn: { color: '#FFFFFF' },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111111', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#777777', textAlign: 'center', lineHeight: 20 },

  // FAB
  fabWrap: { position: 'absolute', bottom: 28, right: 16 },
  fab: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#C0000A',
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, gap: 6,
    shadowColor: '#C0000A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.42, shadowRadius: 12, elevation: 10,
  },
  fabPlus: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', lineHeight: 24 },
  fabLbl: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },

  // Toast
  toast: {
    position: 'absolute', bottom: 100, left: 24, right: 24,
    backgroundColor: '#1A1A1A', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  toastTxt: { fontSize: 13, fontWeight: '500', color: '#FFFFFF' },
});