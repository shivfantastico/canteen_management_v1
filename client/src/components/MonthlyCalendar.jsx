/**
 * src/components/MonthlyCalendar.jsx
 * ─────────────────────────────────────────────────────────────────
 * Monthly Booking Calendar — Lloyds Metals & Energy CMS
 *
 * PURPOSE:
 *   Lets the user visually select which days of a month they want
 *   to schedule a meal. All days start SELECTED. Tapping a day
 *   toggles it to SKIPPED (excluded). Tapping again re-selects it.
 *
 * DATA MODEL (mirrors DB schema):
 *   monthly_bookings       → start_date, end_date, meal_type_id
 *   monthly_booking_exclusions → excluded_date[]
 *
 * PROPS:
 *   onConfirm(payload)  — called when user taps "Confirm Schedule"
 *                         payload = {
 *                           start_date:     "YYYY-MM-DD",
 *                           end_date:       "YYYY-MM-DD",
 *                           excluded_dates: ["YYYY-MM-DD", ...],
 *                           selected_count: number,
 *                         }
 *   onCancel()          — called when user taps "Cancel"
 *   mealName            — display string e.g. "Lunch"
 *   mealColor           — hex color for selection highlight
 *
 * STRUCTURE:
 *   <CalendarHeader>    — Month/Year label + prev/next navigation
 *   <WeekdayRow>        — Sun Mon Tue Wed Thu Fri Sat
 *   <DayGrid>           — NxM grid of <DayCell> components
 *   <CalendarLegend>    — ● Selected  ○ Skipped  · Past
 *   <CalendarSummary>   — "X days selected, Y skipped" stats
 *   <ActionButtons>     — Cancel / Confirm Schedule
 *
 * SELECTION RULES:
 *   • Past dates (before today) are disabled — cannot be toggled
 *   • Today is selectable
 *   • User navigates between months with < > arrows
 *   • "Select All" / "Clear All" quick-action chips
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import cs from "./MonthlyCalendar.module";

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────

const WEEKDAYS     = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES  = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

/** "YYYY-MM-DD" from a Date object (local time, no UTC shift) */
const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Returns today's date key */
const todayKey = () => toKey(new Date());

/** Returns tomorrow's date key */
const tomorrowKey = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toKey(d);
};

/** True if dateKey is strictly before today */
// const isPast = (dateKey) => dateKey < todayKey();
const isPast = (dateKey) => dateKey < tomorrowKey();

/** True if dateKey is a Sunday (day 0) */
const isSunday = (dateKey) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
};

/**
 * Build the flat array of day-cells for a month grid.
 * Returns objects: { key: "YYYY-MM-DD" | null, date: number | null }
 * null entries are leading/trailing blank cells to align the grid.
 */
const buildMonthGrid = (year, month) => {
  const firstDow   = new Date(year, month, 1).getDay();   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells      = [];

  // Leading blanks
  for (let i = 0; i < firstDow; i++) cells.push(null);

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toKey(new Date(year, month, d)));
  }

  // Trailing blanks to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

/**
 * Given a Set of skipped keys and the full month key array,
 * derive start_date, end_date, and the exclusions list.
 */
const buildPayload = (yearMonth, skippedSet) => {
  const [year, month] = yearMonth;
  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  // const today         = todayKey();
  const today = tomorrowKey();

  const total_quantity = 1;

  // All bookable days (today onwards within the month)
  const allBookable = Array.from({ length: daysInMonth }, (_, i) =>
    toKey(new Date(year, month, i + 1))
  ).filter((k) => k >= today);

  if (allBookable.length === 0)
    return { start_date: null, end_date: null, excluded_dates: [], selected_count: 0 };

  const excluded_dates = allBookable.filter((k) => skippedSet.has(k));
  const selected       = allBookable.filter((k) => !skippedSet.has(k));

  return {
    start_date:    allBookable[0],
    end_date:      allBookable[allBookable.length - 1],
    excluded_dates,
    selected_count: selected.length
  };
};

// ─────────────────────────────────────────────────────────────────
// DAY CELL
// ─────────────────────────────────────────────────────────────────

const DayCell = React.memo(({ dateKey, isSkipped, mealColor, onToggle }) => {

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const past    = dateKey ? isPast(dateKey) : false;
  const isToday = dateKey ? dateKey === todayKey() : false;
  const sun     = dateKey ? isSunday(dateKey) : false;

  const selected = !isSkipped && !past;

  const handlePress = useCallback(() => {
    if (!dateKey || past) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 8,
      }),
    ]).start();

    onToggle(dateKey);

  }, [dateKey, past, onToggle, scaleAnim]);

  // Early return AFTER hooks
  if (!dateKey) return <View style={cs.dayBlank} />;

  const dayNum = Number(dateKey.split("-")[2]);

  const cellBg = past
    ? "transparent"
    : isSkipped
    ? "#F5F5F5"
    : mealColor;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1, height: 42 }}>
      <TouchableOpacity
        style={[
          cs.dayCell,
          selected && { backgroundColor: cellBg },
          isSkipped && cs.dayCellSkipped,
          isToday && cs.dayCellToday,
          past && cs.dayCellPast,
        ]}
        onPress={handlePress}
        disabled={past}
        activeOpacity={0.75}
      >
        <Text
          style={[
            cs.dayNum,
            selected && cs.dayNumSelected,
            isSkipped && cs.dayNumSkipped,
            past && cs.dayNumPast,
            sun && !past && !isSkipped && cs.dayNumSun,
          ]}
        >
          {dayNum}
        </Text>

        {selected && !past && (
          <View style={[cs.selDot, { backgroundColor: "rgba(255,255,255,0.7)" }]} />
        )}

        {isSkipped && !past && (
          <Text style={cs.skipX}>✕</Text>
        )}

        {isToday && (
          <View style={[cs.todayRing, { borderColor: mealColor }]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

DayCell.displayName = "DayCell";


// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

const MonthlyCalendar = ({ onConfirm, onCancel, mealName = "Meal", mealColor = "#C0000A" }) => {

  // ── Displayed month state ────────────────────────────────────
  const today = new Date();
  const [dispYear,  setDispYear]  = useState(today.getFullYear());
  const [dispMonth, setDispMonth] = useState(today.getMonth());

  // ── Skipped dates: Set of "YYYY-MM-DD" keys ──────────────────
  // By default everything is selected (nothing skipped).
  const [skipped, setSkipped] = useState(new Set());

  // ── Calendar grid cells ──────────────────────────────────────
  const gridCells = useMemo(
    () => buildMonthGrid(dispYear, dispMonth),
    [dispYear, dispMonth]
  );

  // ── Month summary stats ──────────────────────────────────────
  const { start_date, end_date, excluded_dates, selected_count } = useMemo(
    () => buildPayload([dispYear, dispMonth], skipped),
    [dispYear, dispMonth, skipped]
  );

  const skippedInMonth = useMemo(
    () => gridCells.filter((k) => k && !isPast(k) && skipped.has(k)).length,
    [gridCells, skipped]
  );

  // ── Toggle a single day ──────────────────────────────────────
  const toggleDay = useCallback((key) => {
    setSkipped((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  // ── Select All / Clear All ───────────────────────────────────
  const selectAll = useCallback(() => {
    const monthPrefix = `${dispYear}-${String(dispMonth + 1).padStart(2, "0")}`;
    setSkipped((prev) => {
      // Build a brand-new Set, copying only keys that are NOT in this month.
      // Never mutate or iterate-and-delete the same Set.
      const next = new Set();
      for (const key of prev) {
        if (!key.startsWith(monthPrefix)) next.add(key);
      }
      return next;
    });
  }, [dispYear, dispMonth]);

  const clearAll = useCallback(() => {
    // const todayStr    = todayKey();
    const todayStr = tomorrowKey();
    const bookable    = gridCells.filter((k) => k !== null && k >= todayStr);
    setSkipped((prev) => {
      // Build a brand-new Set so React always sees a changed reference.
      const next = new Set(prev);
      for (const k of bookable) next.add(k);
      return next;
    });
  }, [gridCells]);

  // ── Month navigation ─────────────────────────────────────────
  const goToPrevMonth = () => {
    if (dispMonth === 0) { setDispYear(y => y - 1); setDispMonth(11); }
    else setDispMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (dispMonth === 11) { setDispYear(y => y + 1); setDispMonth(0); }
    else setDispMonth(m => m + 1);
  };

  // Can only go back to current month (not into the past)
  const canGoPrev = !(dispYear === today.getFullYear() && dispMonth === today.getMonth());

  // ── Confirm handler ──────────────────────────────────────────
  const handleConfirm = () => {
    if (selected_count === 0) return;
    onConfirm({ start_date, end_date, excluded_dates, selected_count });
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <View style={cs.root}>

      {/* ── Month navigation header ──────────────────────── */}
      <View style={cs.calHeader}>
        <TouchableOpacity
          style={[cs.navBtn, !canGoPrev && cs.navBtnOff]}
          onPress={goToPrevMonth}
          disabled={!canGoPrev}
          activeOpacity={0.7}
        >
          <Text style={[cs.navArrow, !canGoPrev && cs.navArrowOff]}>‹</Text>
        </TouchableOpacity>

        <View style={cs.monthLabelWrap}>
          <Text style={cs.monthLabel}>{MONTH_NAMES[dispMonth]}</Text>
          <Text style={cs.yearLabel}>{dispYear}</Text>
        </View>

        <TouchableOpacity style={cs.navBtn} onPress={goToNextMonth} activeOpacity={0.7}>
          <Text style={cs.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── Quick-action chips ───────────────────────────── */}
      <View style={cs.quickRow}>
        <TouchableOpacity style={[cs.quickChip, { borderColor: mealColor }]} onPress={selectAll} activeOpacity={0.8}>
          <Text style={[cs.quickChipTxt, { color: mealColor }]}>✓ Select All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cs.quickChipGrey} onPress={clearAll} activeOpacity={0.8}>
          <Text style={cs.quickChipGreyTxt}>✕ Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* ── Weekday header row ───────────────────────────── */}
      <View style={cs.weekRow}>
        {WEEKDAYS.map((d) => (
          <Text key={d} style={[cs.weekLabel, d === "Sun" && cs.weekLabelSun]}>{d}</Text>
        ))}
      </View>

      {/* ── Day grid ─────────────────────────────────────── */}
      {/* Split cells into rows of 7 */}
      <View style={cs.gridWrap}>
        {Array.from({ length: Math.ceil(gridCells.length / 7) }, (_, rowIdx) => (
          <View key={rowIdx} style={cs.gridRow}>
            {gridCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((dateKey, colIdx) => (
              <DayCell
                key={dateKey ?? `blank-${rowIdx}-${colIdx}`}
                dateKey={dateKey}
                isSkipped={dateKey ? skipped.has(dateKey) : false}
                mealColor={mealColor}
                onToggle={toggleDay}
              />
            ))}
          </View>
        ))}
      </View>

      {/* ── Legend ───────────────────────────────────────── */}
      <View style={cs.legendRow}>
        <View style={cs.legendItem}>
          <View style={[cs.legendDot, { backgroundColor: mealColor }]} />
          <Text style={cs.legendTxt}>Scheduled</Text>
        </View>
        <View style={cs.legendItem}>
          <View style={[cs.legendDot, { backgroundColor: "#E0E0E0" }]} />
          <Text style={cs.legendTxt}>Skipped</Text>
        </View>
        <View style={cs.legendItem}>
          <View style={[cs.legendDot, { backgroundColor: "#EEEEEE", borderWidth: 1, borderColor: "#CCCCCC" }]} />
          <Text style={cs.legendTxt}>Past</Text>
        </View>
      </View>

      {/* ── Summary stats ────────────────────────────────── */}
      <View style={[cs.summaryBanner, { borderColor: `${mealColor}33` }]}>
        <View style={cs.summaryCol}>
          <Text style={[cs.summaryNum, { color: mealColor }]}>{selected_count}</Text>
          <Text style={cs.summaryLbl}>Days Scheduled</Text>
        </View>
        <View style={cs.summaryDivider} />
        <View style={cs.summaryCol}>
          <Text style={[cs.summaryNum, { color: "#AAAAAA" }]}>{skippedInMonth}</Text>
          <Text style={cs.summaryLbl}>Days Skipped</Text>
        </View>
        <View style={cs.summaryDivider} />
        <View style={cs.summaryCol}>
          <Text style={[cs.summaryNum, { color: "#111111" }]}>
            {MONTH_NAMES[dispMonth].slice(0, 3)}
          </Text>
          <Text style={cs.summaryLbl}>{dispYear}</Text>
        </View>
      </View>

      {/* ── Date range info ───────────────────────────────── */}
      {start_date && (
        <View style={cs.rangeRow}>
          <Text style={cs.rangeTxt}>
            📅  {start_date}  →  {end_date}
          </Text>
        </View>
      )}

      {/* ── Action buttons ───────────────────────────────── */}
      <View style={cs.actionRow}>
        <TouchableOpacity style={cs.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={cs.cancelBtnTxt}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            cs.confirmBtn,
            { backgroundColor: mealColor },
            selected_count === 0 && cs.confirmBtnOff,
          ]}
          onPress={handleConfirm}
          disabled={selected_count === 0}
          activeOpacity={0.85}
        >
          <Text style={cs.confirmBtnTxt}>
            Confirm  {selected_count > 0 ? `(${selected_count} days)` : ""}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MonthlyCalendar;