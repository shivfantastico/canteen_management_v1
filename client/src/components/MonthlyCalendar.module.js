/**
 * src/components/MonthlyCalendar.module.js
 * Lloyds Metals & Energy — MonthlyCalendar modular styles.
 *
 * Palette:
 *   Brand red   #C0000A  (overridden per-meal via inline prop)
 *   Neutral bg  #F5F6FA
 *   White card  #FFFFFF
 *   Text dark   #111111
 *   Text muted  #AAAAAA
 */

import { StyleSheet } from "react-native";

export default StyleSheet.create({

  // ── Outer container ──────────────────────────────────────────
  root: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    // No shadow here — the parent Section card provides elevation
  },

  // ── Month navigation header ──────────────────────────────────
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#F5F6FA",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "#EEEEEE",
  },
  navBtnOff: { opacity: 0.30 },
  navArrow:    { fontSize: 22, fontWeight: "700", color: "#333333", lineHeight: 28 },
  navArrowOff: { color: "#CCCCCC" },
  monthLabelWrap: { alignItems: "center" },
  monthLabel: {
    fontSize: 16, fontWeight: "800",
    color: "#111111", letterSpacing: -0.2,
  },
  yearLabel: {
    fontSize: 11, fontWeight: "500",
    color: "#AAAAAA", marginTop: 1,
  },

  // ── Quick-action chips (Select All / Clear All) ──────────────
  quickRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
    justifyContent: "flex-end",
  },
  quickChip: {
    borderRadius: 100, borderWidth: 1.5,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  quickChipTxt: { fontSize: 11, fontWeight: "700" },

  quickChipGrey: {
    borderRadius: 100, borderWidth: 1.5, borderColor: "#CCCCCC",
    paddingHorizontal: 12, paddingVertical: 5,
  },
  quickChipGreyTxt: { fontSize: 11, fontWeight: "700", color: "#AAAAAA" },

  // ── Weekday header row ───────────────────────────────────────
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekLabel: {
    flex: 1, textAlign: "center",
    fontSize: 10, fontWeight: "700",
    color: "#AAAAAA", letterSpacing: 0.3,
  },
  weekLabelSun: { color: "#E53935" },

  // ── Calendar grid ────────────────────────────────────────────
  // gridRow must have an explicit height so flex:1 children can
  // resolve their own height (aspectRatio alone cannot work when
  // the parent row has no intrinsic height in RN flex layout).
  gridWrap: { gap: 3 },
  gridRow:  { flexDirection: "row", gap: 3, height: 42 },

  // ── Day cell ─────────────────────────────────────────────────
  // flex:1 → 1/7 of row width; height:42 makes each cell square.
  dayBlank: { flex: 1, height: 42 },

  dayCell: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    // Explicit borderWidth:0 ensures dayCellSkipped's borderWidth:1
    // is fully reset when switching back to selected state.
    borderWidth: 0,
    borderColor: "transparent",
    position: "relative",
    overflow: "hidden",
  },
  dayCellSkipped: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1, borderColor: "#E8E8E8",
  },
  dayCellToday: {
    // Ring handled via todayRing overlay — bg set by selected/skipped state
  },
  dayCellPast: {
    backgroundColor: "transparent",
  },

  // Day number text
  dayNum: {
    fontSize: 13, fontWeight: "600",
    color: "#333333",
    textDecorationLine: "none",   // explicit reset baseline
  },
  // Explicit textDecorationLine:'none' cancels the skipped strikethrough
  // in case React Native's Yoga/Text node caches the previous decoration.
  dayNumSelected: { color: "#FFFFFF", fontWeight: "800", textDecorationLine: "none" },
  dayNumSkipped:  { color: "#BBBBBB", fontWeight: "500", textDecorationLine: "line-through" },
  dayNumPast:     { color: "#DDDDDD", fontWeight: "400", textDecorationLine: "none" },
  dayNumSun:      { color: "rgba(255,255,255,0.85)", textDecorationLine: "none" },

  // Small dot at bottom of selected cells
  selDot: {
    position: "absolute",
    bottom: 4,
    width: 4, height: 4, borderRadius: 2,
  },

  // ✕ on skipped cells
  skipX: {
    position: "absolute",
    bottom: 2,
    fontSize: 8, fontWeight: "900",
    color: "#CCCCCC",
  },

  // Today ring (border overlay)
  todayRing: {
    position: "absolute",
    top: 1, left: 1, right: 1, bottom: 1,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "transparent",  // overridden inline with mealColor
  },

  // ── Legend ───────────────────────────────────────────────────
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 14, marginBottom: 12,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendTxt:  { fontSize: 11, color: "#888888", fontWeight: "500" },

  // ── Summary stats banner ─────────────────────────────────────
  summaryBanner: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
    marginBottom: 10,
  },
  summaryCol: {
    flex: 1, alignItems: "center",
  },
  summaryNum: {
    fontSize: 22, fontWeight: "900", lineHeight: 26,
  },
  summaryLbl: {
    fontSize: 10, color: "#AAAAAA",
    fontWeight: "500", marginTop: 2,
  },
  summaryDivider: {
    width: 1, backgroundColor: "#EEEEEE", marginVertical: 4,
  },

  // ── Date range info line ─────────────────────────────────────
  rangeRow: {
    alignItems: "center",
    marginBottom: 14,
  },
  rangeTxt: {
    fontSize: 11, color: "#888888",
    fontWeight: "500", letterSpacing: 0.2,
  },

  // ── Action buttons ───────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderWidth: 1.5, borderColor: "#DDDDDD",
  },
  cancelBtnTxt: {
    fontSize: 14, fontWeight: "700", color: "#777777",
  },
  confirmBtn: {
    flex: 2, height: 48, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30, shadowRadius: 8, elevation: 6,
  },
  confirmBtnOff: { opacity: 0.38, shadowOpacity: 0 },
  confirmBtnTxt: {
    fontSize: 14, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.3,
  },
});