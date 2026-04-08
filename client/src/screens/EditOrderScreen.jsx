/**
 * src/screens/CreateOrderScreen.jsx
 * ─────────────────────────────────────────────────────────────────
 * Create OR Edit a Meal Order — Lloyds Metals & Energy CMS
 *
 * DUAL MODE:
 *   CREATE — no params          → fresh form, POST /api/order
 *   EDIT   — params.editOrder   → prefilled form, PATCH /api/order/:id
 *
 * Receiving an editOrder JSON string via useLocalSearchParams()
 * pre-populates:
 *   • mode (SELF / GUEST) from booking_for
 *   • bookType (SINGLE / MONTHLY) from booking_type
 *   • selDate from order_date
 *   • selfQtys from meal_name + total_quantity (SINGLE SELF)
 *   • vendorMealId + vendorQty + vendorName (GUEST)
 *   • monthlyMealId + monthlySchedule (MONTHLY)
 *
 * DATE-AWARE MEAL STATUS:
 *   getMealStatus(meal, selectedDate)
 *   • selectedDate !== today  → isOpen:true, isDeadline:true (all bookable)
 *   • selectedDate === today  → normal cutoff logic
 *
 * Navigation: expo-router `router` ONLY — never useNavigation
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import MealCounter from "../components/MealCounter";
import MonthlyCalendar from "../components/MonthlyCalendar";
import s from "./CreateOrderScreen.module";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Config from "react-native-config";

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────

const BASE_MEAL_TYPES = [
  {
    id: 1,
    name: "Breakfast",
    emoji: "🌅",
    color: "#F57C00",
    color2: "#f98919",
    bg: "#FFF3E0",
    time: "07:30–09:30",
  },
  {
    id: 2,
    name: "Lunch",
    emoji: "☀️",
    color: "#388E3C",
    color2: "#2ea043",
    bg: "#E8F5E9",
    time: "12:00–14:00",
  },
  {
    id: 3,
    name: "Snacks",
    emoji: "☕",
    color: "#7B1FA2",
    color2: "#c24ff3",
    bg: "#F3E5F5",
    time: "16:00–17:00",
  },
  {
    id: 4,
    name: "Dinner",
    emoji: "🌙",
    color: "#1565C0",
    color2: "#187df0",
    bg: "#E3F2FD",
    time: "19:00–21:00",
  },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BOOKING_MODES = [
  {
    key: "SELF",
    icon: "👤",
    label: "Book for Self",
    desc: "Order meals for yourself",
  },
  {
    key: "GUEST",
    icon: "🤝",
    label: "Book for Guest",
    desc: "Order meals for a vendor / guest",
  },
];

const BOOKING_TYPES = [
  {
    key: "SINGLE",
    icon: "📌",
    label: "Single",
    desc: "One-time order for a selected date",
  },
  {
    key: "MONTHLY",
    icon: "📆",
    label: "Monthly",
    desc: "Schedule meals for the entire month",
  },
];

const MEAL_META = {
  breakfast: {
    emoji: "🌅",
    color: "#F57C00",
    color2: "#f98919",
    bg: "#FFF3E0",
  },
  lunch: { emoji: "☀️", color: "#388E3C", color2: "#2ea043", bg: "#E8F5E9" },
  dinner: { emoji: "🌙", color: "#1565C0", color2: "#187df0", bg: "#E3F2FD" },
  snacks: { emoji: "☕", color: "#7B1FA2", color2: "#c24ff3", bg: "#F3E5F5" },
};

// ─────────────────────────────────────────────────────────────────
// CUTOFF LOGIC — date-aware
// ─────────────────────────────────────────────────────────────────

const getMealStatus = (meal, selectedDate = new Date()) => {
  const now = new Date();
  const todayStr = now.toDateString();
  const selStr = new Date(selectedDate).toDateString();

  if (todayStr !== selStr) {
    return {
      isOpen: true,
      isOpen2: true,
      isToday: false,
      isUrgent: false,
      countdown: null,
      deadlineLabel: "",
      startLabel: "",
      isDeadline: true,
    };
  }

  const [hh, mm, ss] = meal.cutoff_time.split(":").map(Number);
  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + meal.cutoff_day_offset);
  deadline.setHours(hh, mm, ss ?? 0, 0);

  const [hh2, mm2, ss2] = meal.serviceStart_time.split(":").map(Number);
  const serviceStart = new Date(now);
  serviceStart.setDate(serviceStart.getDate() + meal.serviceStart_day_offset);
  serviceStart.setHours(hh2, mm2, ss2 ?? 0, 0);

  const isOpen2 = now >= serviceStart;
  const isOpen = now < deadline;
  const diffMs = deadline - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const remMins = diffMins % 60;
  const isUrgent = isOpen && diffHrs < 2;
  const countdown = isUrgent
    ? diffHrs > 0
      ? `${diffHrs}h ${remMins}m left`
      : `${diffMins}m left`
    : null;

  const dayLabel = (o) =>
    o === 0
      ? "Today"
      : o === -1
        ? "Yesterday"
        : o === 1
          ? "Tomorrow"
          : `${Math.abs(o)}d ${o < 0 ? "ago" : "later"}`;
  const fmt = (d) =>
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return {
    isOpen,
    isOpen2,
    isUrgent,
    countdown,
    isDeadline: false,
    isToday: true,
    deadlineLabel: `${dayLabel(meal.cutoff_day_offset)} ${fmt(deadline)}`,
    startLabel: `${dayLabel(meal.serviceStart_day_offset)} ${fmt(serviceStart)}`,
  };
};

// ─────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────

const buildStrip = () => {
  const t = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    return d;
  });
};

const fmtDisplay = (d) =>
  d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const toApi = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const parseSafeDate = (iso) => {
  if (!iso) return new Date();
  const d = new Date(iso);
  return isNaN(d.getTime()) ? new Date() : d;
};

// ─────────────────────────────────────────────────────────────────
// PREFILL HELPERS — derive initial state from an existing order
// ─────────────────────────────────────────────────────────────────

const prefillFromOrder = (order) => {
  if (!order) return null;

  const mode = order.booking_for === "GUEST" ? "GUEST" : "SELF";
  const bookType = order.booking_type === "MONTHLY" ? "MONTHLY" : "SINGLE";
  const selDate = parseSafeDate(order.order_date);

  // SELF + SINGLE: find which meal, set its qty
  const selfQtys = { 1: 0, 2: 0, 3: 0, 4: 0 };
  if (mode === "SELF" && bookType === "SINGLE") {
    const m = BASE_MEAL_TYPES.find(
      (x) => x.name.toLowerCase() === (order.meal_name || "").toLowerCase(),
    );
    if (m) selfQtys[m.id] = order.total_quantity ?? order.quantity ?? 1;
  }

  // MONTHLY: find meal id + rebuild schedule from DB fields
  let monthlyMealId = null;
  let monthlySchedule = null;
  if (bookType === "MONTHLY") {
    const m = BASE_MEAL_TYPES.find(
      (x) => x.name.toLowerCase() === (order.meal_name || "").toLowerCase(),
    );
    monthlyMealId = m?.id ?? null;

    const startStr = order.start_date
      ? toApi(parseSafeDate(order.start_date))
      : null;
    const endStr = order.end_date ? toApi(parseSafeDate(order.end_date)) : null;
    if (startStr && endStr) {
      const excl = (order.excluded_dates || []).map((d) =>
        typeof d === "string" && d.includes("T") ? toApi(parseSafeDate(d)) : d,
      );
      let count = 0;
      const cur = new Date(startStr);
      const end = new Date(endStr);
      while (cur <= end) {
        count++;
        cur.setDate(cur.getDate() + 1);
      }
      monthlySchedule = {
        start_date: startStr,
        end_date: endStr,
        excluded_dates: excl,
        selected_count: count - excl.length,
      };
    }
  }

  // GUEST fields
  const vendorName = order.guest_name || "";
  const vendorMealId =
    BASE_MEAL_TYPES.find(
      (x) => x.name.toLowerCase() === (order.meal_name || "").toLowerCase(),
    )?.id ?? null;
  const vendorQty = order.total_quantity ?? order.quantity ?? 1;

  return {
    mode,
    bookType,
    selDate,
    selfQtys,
    monthlyMealId,
    monthlySchedule,
    vendorName,
    vendorMealId,
    vendorQty,
  };
};

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────

const Toast = ({ message, visible, type = "error" }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(2600),
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, message]);
  return (
    <Animated.View
      style={[s.toast, type === "success" && s.toastOk, { opacity: anim }]}
    >
      <Text style={s.toastTxt}>
        {type === "success" ? "✓  " : "⚠  "}
        {message}
      </Text>
    </Animated.View>
  );
};

const SuccessModal = ({ visible, onDone, mode, bookType, isEdit }) => {
  const sc = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    if (visible)
      Animated.spring(sc, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 12,
      }).start();
  }, [visible]);
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={s.overlay}>
        <Animated.View style={[s.modal, { transform: [{ scale: sc }] }]}>
          <View style={s.checkCircle}>
            <Text style={s.checkTxt}>✓</Text>
          </View>
          <Text style={s.modalTitle}>
            {isEdit
              ? "Order Updated!"
              : bookType === "MONTHLY"
                ? "Schedule Created!"
                : "Order Placed!"}
          </Text>
          <Text style={s.modalSub}>
            {isEdit
              ? "Your order has been\nsuccessfully updated."
              : mode === "GUEST"
                ? "Guest meal order has been\nsuccessfully submitted."
                : bookType === "MONTHLY"
                  ? "Your monthly meal schedule\nhas been successfully saved."
                  : "Your meal order has been\nsuccessfully submitted."}
          </Text>
          <TouchableOpacity
            style={s.modalBtn}
            onPress={onDone}
            activeOpacity={0.85}
          >
            <Text style={s.modalBtnTxt}>View My Orders</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Section = ({ title, badge, children }) => (
  <View style={s.section}>
    <View style={s.secHead}>
      <View style={s.secAccent} />
      <Text style={s.secTitle}>{title}</Text>
      {!!badge && (
        <View style={s.secBadge}>
          <Text style={s.secBadgeTxt}>{badge}</Text>
        </View>
      )}
    </View>
    {children}
  </View>
);

const MealTypePicker = ({
  selected,
  onSelect,
  meals,
  isBookingType,
  bookingType,
}) => (
  <View style={s.mealPickerGrid}>
    {meals.map((meal) => {
      const meta = MEAL_META[meal.name.toLowerCase()] ?? {
        emoji: "🍽️",
        color: "#555",
        color2: "#555",
        bg: "#F5F5F5",
      };
      const on = selected === meal.id;
      let isOpen = meal.isOpen;
      let isOpen2 = meal.isOpen2;
      if (isBookingType || !(bookingType === "Guest" && meal.isToday)) {
        isOpen = true;
        isOpen2 = true;
      }
      return (
        <TouchableOpacity
          key={meal.id}
          style={[s.mealPickerPill, on && s.mealPickerPillOn]}
          onPress={() => onSelect(meal.id)}
          activeOpacity={isOpen ? 0.85 : 1}
          disabled={!isOpen}
        >
          <View
            style={[
              s.mealCard,
              isOpen && !meal.isUrgent && s.mealCardOpen,
              isOpen && meal.isUrgent && s.mealCardUrgent,
              !isOpen && s.mealCardClosed,
              on && { borderColor: meta.color2, borderWidth: 2 },
            ]}
          >
            <View
              style={[
                s.mealCardBand,
                {
                  backgroundColor: !isOpen
                    ? "#F5F5F5"
                    : meal.isUrgent
                      ? "#FFF8E1"
                      : meta.bg,
                },
              ]}
            >
              <Text style={[s.mealEmoji, !isOpen && s.mealEmojiDim]}>
                {meta.emoji}
              </Text>
              <View
                style={[
                  s.statusBadge,
                  {
                    backgroundColor: !isOpen
                      ? "#CCCCCC"
                      : meal.isUrgent
                        ? "#FF8F00"
                        : "#2E7D32",
                  },
                ]}
              >
                <Text style={s.statusBadgeTxt}>
                  {isBookingType || !(bookingType === "Guest" && meal.isToday)
                    ? "●  OPEN"
                    : !isOpen
                      ? "✕  CLOSED"
                      : meal.isUrgent
                        ? "⚡  CLOSING"
                        : "●  OPEN"}
                </Text>
              </View>
            </View>
            <View style={s.mealCardBody}>
              <Text
                style={[
                  s.mealCardName,
                  { color: isOpen ? meta.color : "#CCCCCC" },
                ]}
              >
                {meal.name}
              </Text>
              {!isBookingType &&
                (meal.isUrgent && meal.countdown ? (
                  <View style={s.countdownChip}>
                    <Text style={s.countdownTxt}>🕐 {meal.countdown}</Text>
                  </View>
                ) : (
                  <View style={s.deadlineRow}>
                    <Text
                      style={[
                        s.deadlineTxt,
                        { color: isOpen ? "#313030" : "#CCCCCC" },
                      ]}
                      numberOfLines={1}
                    >
                      {isOpen
                        ? `⏰ Closes ${meal.deadlineLabel}`
                        : `🔒 Opens ${meal.startLabel}`}
                    </Text>
                  </View>
                ))}
            </View>
            {!isOpen && <View style={s.closedOverlay} />}
          </View>
          {on && (
            <View style={s.mealPickerCheckWrap}>
              <Text style={s.mealPickerCheckTxt}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const QuantityStepper = ({ value, onChange, min = 1, max = 50 }) => {
  const scDec = useRef(new Animated.Value(1)).current;
  const scInc = useRef(new Animated.Value(1)).current;
  const pressAnim = (ref) =>
    Animated.sequence([
      Animated.timing(ref, {
        toValue: 0.85,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(ref, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  const dec = () => {
    if (value > min) {
      pressAnim(scDec);
      onChange(value - 1);
    }
  };
  const inc = () => {
    if (value < max) {
      pressAnim(scInc);
      onChange(value + 1);
    }
  };
  return (
    <View style={s.stepperRow}>
      <Animated.View style={{ transform: [{ scale: scDec }] }}>
        <TouchableOpacity
          style={[s.stepperBtn, value <= min && s.stepperBtnOff]}
          onPress={dec}
          disabled={value <= min}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.75}
        >
          <Text style={[s.stepperBtnTxt, value <= min && s.stepperBtnTxtOff]}>
            −
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={s.stepperQty}>
        <Text style={s.stepperQtyTxt}>{value}</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: scInc }] }}>
        <TouchableOpacity
          style={[
            s.stepperBtn,
            s.stepperBtnAdd,
            value >= max && s.stepperBtnOff,
          ]}
          onPress={inc}
          disabled={value >= max}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.75}
        >
          <Text style={[s.stepperBtnTxt, s.stepperBtnTxtAdd]}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  icon,
  keyboardType = "default",
}) => (
  <View style={s.fieldWrap}>
    <Text style={s.fieldLabel}>{label}</Text>
    <View style={[s.fieldRow, !editable && s.fieldRowLocked]}>
      {!!icon && <Text style={s.fieldIcon}>{icon}</Text>}
      <TextInput
        style={[s.fieldInput, !editable && s.fieldInputLocked]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#BBBBBB"
        editable={editable}
        keyboardType={keyboardType}
        autoCapitalize="words"
      />
      {!editable && <Text style={s.fieldLockIcon}>🔒</Text>}
    </View>
  </View>
);

const GuestDetailsForm = ({ vendorName, setVendorName, userData }) => (
  <Section title="Guest Details">
    <FormInput
      label="Guest Name *"
      value={vendorName}
      onChangeText={setVendorName}
      placeholder="Enter guest / vendor name"
      icon="🤝"
    />
    <FormInput
      label="Employee ID"
      value={userData?.user?.emp_id || "—"}
      icon="🪪"
      editable={false}
    />
    <FormInput
      label="Department"
      value={userData?.user?.department || "—"}
      icon="🏭"
      editable={false}
    />
  </Section>
);

const OrderDateStripCard = ({ selDate, dateStrip, today, setSelDate }) => (
  <Section title="Order Date">
    <View style={s.dateBanner}>
      <Text style={s.dateBannerTxt}>📅 {fmtDisplay(selDate)}</Text>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.strip}
    >
      {dateStrip.map((d, i) => {
        const on = d.toDateString() === selDate.toDateString();
        const isToday = d.toDateString() === today.toDateString();
        return (
          <TouchableOpacity
            key={i}
            style={[s.dateCell, on && s.dateCellOn]}
            onPress={() => setSelDate(d)}
            activeOpacity={0.75}
          >
            <Text style={[s.dcDay, on && s.dcOn]}>{DAYS[d.getDay()]}</Text>
            <Text style={[s.dcNum, on && s.dcOn]}>{d.getDate()}</Text>
            <Text style={[s.dcMon, on && s.dcOn]}>{MONS[d.getMonth()]}</Text>
            {isToday && <View style={[s.todayDot, on && s.todayDotOn]} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </Section>
);

const BookingTypeCard = ({ bookType, switchBookType }) => (
  <Section title="Booking Type">
    <View style={s.bookTypeRow}>
      {BOOKING_TYPES.map((bt) => {
        const active = bookType === bt.key;
        return (
          <TouchableOpacity
            key={bt.key}
            style={[s.bookTypePill, active && s.bookTypePillOn]}
            onPress={() => switchBookType(bt.key)}
            activeOpacity={0.8}
          >
            <Text style={s.bookTypeIcon}>{bt.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.bookTypeLabel, active && s.bookTypeLabelOn]}>
                {bt.label}
              </Text>
              <Text style={[s.bookTypeDesc, active && s.bookTypeDescOn]}>
                {bt.desc}
              </Text>
            </View>
            {active && (
              <View style={s.bookTypeCheck}>
                <Text style={s.bookTypeCheckTxt}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  </Section>
);

const ModeSelectCard = ({ mode, switchMode }) => (
  <View style={s.modeSelectorWrap}>
    <Text style={s.modeSelectorLabel}>Booking For</Text>
    <View style={s.modeToggleRow}>
      {BOOKING_MODES.map((bm) => {
        const active = mode === bm.key;
        return (
          <TouchableOpacity
            key={bm.key}
            style={[s.modeCard, active && s.modeCardActive]}
            onPress={() => switchMode(bm.key)}
            activeOpacity={0.8}
          >
            <View style={[s.modeIconWrap, active && s.modeIconWrapActive]}>
              <Text style={s.modeIcon}>{bm.icon}</Text>
            </View>
            <Text style={[s.modeLabel, active && s.modeLabelActive]}>
              {bm.label}
            </Text>
            <Text style={[s.modeDesc, active && s.modeDescActive]}>
              {bm.desc}
            </Text>
            {active && <View style={s.modeActiveDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const OrderSummary = ({ meals, selfQtys, selfTotal, selDate }) => (
  <View style={s.summary}>
    <Text style={s.summaryTitle}>📋 Order Summary</Text>
    {meals
      .filter((m) => selfQtys[m.id] > 0)
      .map((m) => (
        <View key={m.id} style={s.sumRow}>
          <Text style={s.sumLeft}>
            {m.emoji} {m.name}
          </Text>
          <Text style={s.sumRight}>× {selfQtys[m.id]}</Text>
        </View>
      ))}
    <View style={s.sumDivider} />
    <View style={s.sumRow}>
      <Text style={[s.sumLeft, s.sumBold]}>Total Meals</Text>
      <Text style={[s.sumRight, s.sumTotalVal]}>{selfTotal}</Text>
    </View>
    <View style={s.sumRow}>
      <Text style={[s.sumLeft, s.sumBold]}>Date</Text>
      <Text style={s.sumRight}>
        {selDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </View>
  </View>
);

const ChooseYourDaysCard = ({
  monthlySchedule,
  mMonthlyMeal,
  setShowCalModal,
}) => (
  <Section title="Choose Your Days">
    {monthlySchedule ? (
      <View style={s.monthlyConfirmedCard}>
        <View
          style={[s.monthlyMealChip, { backgroundColor: mMonthlyMeal?.bg }]}
        >
          <Text style={s.monthlyMealChipEmoji}>{mMonthlyMeal?.emoji}</Text>
          <Text
            style={[s.monthlyMealChipName, { color: mMonthlyMeal?.color2 }]}
          >
            {mMonthlyMeal?.name}
          </Text>
        </View>
        <View style={s.monthlyStatsRow}>
          <View style={s.monthlyStat}>
            <Text style={[s.monthlyStatNum, { color: mMonthlyMeal?.color2 }]}>
              {monthlySchedule.selected_count}
            </Text>
            <Text style={s.monthlyStatLbl}>Days Scheduled</Text>
          </View>
          <View style={s.monthlyStatDivider} />
          <View style={s.monthlyStat}>
            <Text style={[s.monthlyStatNum, { color: "#AAAAAA" }]}>
              {monthlySchedule.excluded_dates.length}
            </Text>
            <Text style={s.monthlyStatLbl}>Days Skipped</Text>
          </View>
          <View style={s.monthlyStatDivider} />
          <View style={s.monthlyStat}>
            <Text
              style={[s.monthlyStatNum, { color: "#333333", fontSize: 12 }]}
            >
              {monthlySchedule.start_date}
            </Text>
            <Text style={s.monthlyStatLbl}>→ {monthlySchedule.end_date}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[s.monthlyEditBtn, { borderColor: mMonthlyMeal?.color2 }]}
          onPress={() => setShowCalModal(true)}
          activeOpacity={0.8}
        >
          <Text style={[s.monthlyEditBtnTxt, { color: mMonthlyMeal?.color2 }]}>
            ✎ Edit Schedule
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        style={s.openCalBtn}
        onPress={() => setShowCalModal(true)}
        activeOpacity={0.85}
      >
        <Text style={s.openCalBtnIcon}>📆</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.openCalBtnTitle}>Open Calendar</Text>
          <Text style={s.openCalBtnSub}>
            Select which days to schedule your {mMonthlyMeal?.name}
          </Text>
        </View>
        <Text style={s.openCalBtnArrow}>›</Text>
      </TouchableOpacity>
    )}
  </Section>
);

const MonthlyScheduleSummaryCard = ({ mMonthlyMeal, monthlySchedule }) => (
  <View style={s.summary}>
    <Text style={s.summaryTitle}>📋 Monthly Schedule Summary</Text>
    <View style={s.sumRow}>
      <Text style={s.sumLeft}>{mMonthlyMeal.emoji} Meal</Text>
      <Text style={s.sumRight}>{mMonthlyMeal.name}</Text>
    </View>
    <View style={s.sumRow}>
      <Text style={s.sumLeft}>📅 From</Text>
      <Text style={s.sumRight}>{monthlySchedule.start_date}</Text>
    </View>
    <View style={s.sumRow}>
      <Text style={s.sumLeft}>📅 To</Text>
      <Text style={s.sumRight}>{monthlySchedule.end_date}</Text>
    </View>
    <View style={s.sumDivider} />
    <View style={s.sumRow}>
      <Text style={[s.sumLeft, s.sumBold]}>Days Scheduled</Text>
      <Text style={[s.sumRight, s.sumTotalVal]}>
        {monthlySchedule.selected_count}
      </Text>
    </View>
    <View style={s.sumRow}>
      <Text style={[s.sumLeft, s.sumBold]}>Days Skipped</Text>
      <Text style={s.sumRight}>{monthlySchedule.excluded_dates.length}</Text>
    </View>
  </View>
);

const GuestOrderSummaryCard = ({
  vendorName,
  empId,
  department,
  selMealMeta,
  vendorQty,
  selDate,
}) => (
  <View style={s.summary}>
    <Text style={s.summaryTitle}>📋 Order Summary</Text>
    <View style={s.sumRow}>
      <Text style={s.sumLeft}>🤝 Guest</Text>
      <Text style={s.sumRight}>{vendorName.trim()}</Text>
    </View>
    <View style={s.sumRow}>
      <Text style={s.sumLeft}>🪪 Emp ID</Text>
      <Text style={s.sumRight}>{empId}</Text>
    </View>
    <View style={s.sumRow}>
      <Text style={s.sumLeft}>🏭 Department</Text>
      <Text style={s.sumRight}>{department}</Text>
    </View>
    <View style={s.sumDivider} />
    {selMealMeta && (
      <View style={s.sumRow}>
        <Text style={s.sumLeft}>
          {selMealMeta.emoji} {selMealMeta.name}
        </Text>
        <Text style={s.sumRight}>× {vendorQty}</Text>
      </View>
    )}
    <View style={s.sumRow}>
      <Text style={[s.sumLeft, s.sumBold]}>Total Meals</Text>
      <Text style={[s.sumRight, s.sumTotalVal]}>{vendorQty}</Text>
    </View>
    <View style={s.sumRow}>
      <Text style={[s.sumLeft, s.sumBold]}>Date</Text>
      <Text style={s.sumRight}>
        {selDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </View>
  </View>
);

const CalendarBottomModal = ({
  showCalModal,
  setShowCalModal,
  mMonthlyMeal,
  setMonthlySchedule,
}) => (
  <Modal
    visible={showCalModal}
    animationType="slide"
    transparent
    onRequestClose={() => setShowCalModal(false)}
  >
    <View style={s.calModalOverlay}>
      <TouchableOpacity
        style={s.calModalBackdrop}
        activeOpacity={1}
        onPress={() => setShowCalModal(false)}
      />
      <View style={s.calModalSheet}>
        <View style={s.calModalHandle} />
        <View style={s.calModalHeader}>
          <View>
            <Text style={s.calModalTitle}>Monthly Schedule</Text>
            <Text style={s.calModalSub}>
              {mMonthlyMeal
                ? `${mMonthlyMeal.emoji}  ${mMonthlyMeal.name} · Tap days to skip`
                : "Select days for your meal schedule"}
            </Text>
          </View>
          <TouchableOpacity
            style={s.calModalCloseBtn}
            onPress={() => setShowCalModal(false)}
            activeOpacity={0.7}
          >
            <Text style={s.calModalCloseTxt}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={s.calHintRow}>
          <Text style={s.calHintTxt}>
            All days are <Text style={s.calHintBold}>selected</Text> by default.
            Tap a day to <Text style={s.calHintBold}>skip</Text> it.
          </Text>
        </View>
        <MonthlyCalendar
          mealName={mMonthlyMeal?.name || "Meal"}
          mealColor={mMonthlyMeal?.color2 || "#C0000A"}
          onConfirm={(p) => {
            setMonthlySchedule(p);
            setShowCalModal(false);
          }}
          onCancel={() => setShowCalModal(false)}
        />
      </View>
    </View>
  </Modal>
);

// ─────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────

const CreateOrderScreen = () => {
  const params = useLocalSearchParams();
  // editOrder is passed as JSON string when navigating from HomeScreen for editing
  const existingOrder = params.editOrder ? JSON.parse(params.editOrder) : null;
  const isEdit = !!existingOrder;

  // Pre-fill values if editing, otherwise use defaults
  const pf = prefillFromOrder(existingOrder);

  const dateStrip = buildStrip();
  const today = new Date();

  const [userData, setUserData] = useState(null);
  const [mode, setMode] = useState(pf?.mode ?? "SELF");
  const [bookType, setBookType] = useState(pf?.bookType ?? "SINGLE");
  const [selDate, setSelDate] = useState(pf?.selDate ?? today);
  const [selfQtys, setSelfQtys] = useState(
    pf?.selfQtys ?? { 1: 0, 2: 0, 3: 0, 4: 0 },
  );
  const [monthlyMealId, setMonthlyMealId] = useState(pf?.monthlyMealId ?? null);
  const [monthlySchedule, setMonthlySchedule] = useState(
    pf?.monthlySchedule ?? null,
  );
  const [showCalModal, setShowCalModal] = useState(false);
  const [vendorName, setVendorName] = useState(pf?.vendorName ?? "");
  const [vendorMealId, setVendorMealId] = useState(pf?.vendorMealId ?? null);
  const [vendorQty, setVendorQty] = useState(pf?.vendorQty ?? 1);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false, type: "error" });

  const [rawMeals, setRawMeals] = useState([]);
  const [meals, setMeals] = useState([]);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const modeAnim = useRef(new Animated.Value(1)).current;
  const fadeSwitch = (cb) =>
    Animated.timing(modeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      cb();
      Animated.timing(modeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

  const switchMode = (n) => {
    if (n !== mode) fadeSwitch(() => setMode(n));
  };
  const switchBookType = (n) => {
    if (n !== bookType) fadeSwitch(() => setBookType(n));
  };

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("userData");
      setUserData(raw ? JSON.parse(raw) : null);
    })();
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/meal`);
      const apiMeals = res.data.data || [];
      setRawMeals(apiMeals);
      applyMealStatus(apiMeals, pf?.selDate ?? today);
    } catch (err) {
      console.log("Meals fetch error:", err);
    }
  };

  const applyMealStatus = (apiMeals, date) => {
    const merged = apiMeals.map((meal) => {
      const meta = BASE_MEAL_TYPES.find((m) => m.id === meal.id) || {};
      const status = getMealStatus(meal, date);
      return { ...meal, ...meta, ...status };
    });
    setMeals(merged);
  };

  useEffect(() => {
    if (rawMeals.length === 0) return;
    applyMealStatus(rawMeals, selDate);
  }, [selDate]); // eslint-disable-line

  // ── Reset selections when mode/bookType changes in CREATE mode ─
  // In EDIT mode we keep prefilled values; the user explicitly changes them.
  const resetSelections = () => {
    if (isEdit) return; // don't wipe prefills on edit
    setSelfQtys({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setVendorMealId(null);
    setVendorQty(1);
    setMonthlyMealId(null);
    setMonthlySchedule(null);
  };

  const prevMode = useRef(mode);
  const prevBookType = useRef(bookType);
  useEffect(() => {
    if (prevMode.current !== mode) {
      prevMode.current = mode;
      if (!isEdit) resetSelections();
    }
  }, [mode]);
  useEffect(() => {
    if (prevBookType.current !== bookType) {
      prevBookType.current = bookType;
      if (!isEdit) resetSelections();
    }
  }, [bookType]);

  // ── Helpers ──────────────────────────────────────────────────
  const showToast = (msg, type = "error") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  };
  const setSelfQty = (id, v) => setSelfQtys((p) => ({ ...p, [id]: v }));
  const selfTotal = Object.values(selfQtys).reduce((a, b) => a + b, 0);

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    if (mode === "SELF") {
      if (bookType === "SINGLE") {
        if (selfTotal === 0) {
          showToast("Please select at least one meal.");
          return false;
        }
      } else {
        if (!monthlyMealId) {
          showToast("Please select a meal type to schedule.");
          return false;
        }
        if (!monthlySchedule || monthlySchedule.selected_count === 0) {
          showToast("Please select at least one day on the calendar.");
          return false;
        }
      }
    } else {
      if (!vendorName.trim()) {
        showToast("Please enter the guest name.");
        return false;
      }
      if (bookType === "SINGLE") {
        if (!vendorMealId) {
          showToast("Please select a meal type.");
          return false;
        }
      } else {
        if (!monthlyMealId) {
          showToast("Please select a meal type to schedule.");
          return false;
        }
        if (!monthlySchedule || monthlySchedule.selected_count === 0) {
          showToast("Please select at least one day on the calendar.");
          return false;
        }
      }
    }
    return true;
  };

  // ── Build payload ────────────────────────────────────────────
  const buildPayload = () => {
    if (mode === "GUEST") {
      if (bookType === "MONTHLY") {
        return {
          booking_type: "MONTHLY",
          booking_for: mode,
          guest_name: vendorName.trim(),
          start_date: monthlySchedule.start_date,
          end_date: monthlySchedule.end_date,
          excluded_dates: monthlySchedule.excluded_dates,
          order_date: toApi(new Date()),
          items: [{ meal_type_id: monthlyMealId, quantity: 1 }],
        };
      }
      return {
        order_date: toApi(selDate),
        booking_type: "SINGLE",
        booking_for: mode,
        guest_name: vendorName.trim(),
        items: [{ meal_type_id: vendorMealId, quantity: vendorQty }],
      };
    }
    if (bookType === "MONTHLY") {
      return {
        booking_type: "MONTHLY",
        booking_for: mode,
        start_date: monthlySchedule.start_date,
        end_date: monthlySchedule.end_date,
        excluded_dates: monthlySchedule.excluded_dates,
        order_date: toApi(new Date()),
        items: [{ meal_type_id: monthlyMealId, quantity: 1 }],
      };
    }
    return {
      order_date: toApi(selDate),
      booking_type: "SINGLE",
      booking_for: mode,
      items: Object.entries(selfQtys)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ meal_type_id: Number(id), quantity: q })),
    };
  };

  // ── Submit (POST for create, PATCH for edit) ─────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    try {
      setSubmitting(true);
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      };
      if (isEdit) {
        await axios.patch(
          `${API_URL}/api/order/${existingOrder.id}`,
          payload,
          { headers, timeout: 10000 },
        );
      } else {
        await axios.post(`${API_URL}/api/order`, payload, {
          headers,
          timeout: 10000,
        });
      }
      setShowModal(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || err.message || "Failed to save order.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onDone = () => {
    setShowModal(false);
    router.replace("/home");
  };

  // ── Derived ──────────────────────────────────────────────────
  const empId = userData?.user?.emp_id || "—";
  const department = userData?.user?.department || "—";
  const selMealMeta = meals.find((m) => m.id === vendorMealId);
  const mMonthlyMeal = meals.find((m) => m.id === monthlyMealId);

  const canSubmit =
    mode === "GUEST"
      ? bookType === "MONTHLY"
        ? vendorName.trim().length > 0 &&
          !!monthlyMealId &&
          !!monthlySchedule &&
          monthlySchedule.selected_count > 0
        : vendorName.trim().length > 0 && !!vendorMealId
      : bookType === "MONTHLY"
        ? !!monthlyMealId &&
          !!monthlySchedule &&
          monthlySchedule.selected_count > 0
        : selfTotal > 0;

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.screen}>
        <Header
          title={isEdit ? "Edit Order" : "Create Meal Order"}
          subtitle={
            isEdit ? existingOrder.order_number : "Lloyds Metals & Energy Ltd."
          }
          showBack
          onBack={() => router.back()}
          showProfile
          userData={userData}
        />

        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <ImageBackground
            source={require("../../assets/HomePage_Banner.png")}
            style={s.heroBg}
            imageStyle={s.heroBgImg}
            resizeMode="cover"
          >
            <View style={s.heroOverlay} />
            <View style={s.heroInner}>
              <Text style={s.heroTitle}>
                {isEdit ? "Edit Meal Order" : "New Meal Order"}
              </Text>
              <View style={s.heroBrand}>
                <View style={s.heroBrandDot} />
                <Text style={s.heroBrandTxt}>LLOYDS METALS & ENERGY</Text>
                <View style={s.heroBrandDot} />
              </View>
            </View>
          </ImageBackground>

          {/* Edit info banner */}
          {isEdit && (
            <View style={s.editBanner}>
              <Text style={s.editBannerTxt}>
                ✏️ Editing{" "}
                <Text style={s.editBannerBold}>
                  {existingOrder.order_number}
                </Text>
                {" · "}
                {existingOrder.meal_name}
                {existingOrder.booking_for === "GUEST"
                  ? "  ·  Guest"
                  : "  ·  Self"}
              </Text>
            </View>
          )}

          {/* Mode selector — locked in edit mode */}
          <ModeSelectCard
            mode={mode}
            switchMode={isEdit ? () => {} : switchMode}
            isLocked={isEdit}
          />

          <Animated.View style={{ opacity: modeAnim }}>
            {/* ══ SELF MODE ══ */}
            {mode === "SELF" && (
              <>
                <BookingTypeCard
                  bookType={bookType}
                  switchBookType={isEdit ? () => {} : switchBookType}
                />

                {bookType === "SINGLE" && (
                  <>
                    <OrderDateStripCard
                      selDate={selDate}
                      dateStrip={dateStrip}
                      today={today}
                      setSelDate={setSelDate}
                    />
                    <Section
                      title="Select Meals"
                      badge={
                        selfTotal > 0
                          ? `${selfTotal} meal${selfTotal > 1 ? "s" : ""} selected`
                          : null
                      }
                    >
                      {meals.map((m) => (
                        <MealCounter
                          key={m.id}
                          meal={m}
                          quantity={selfQtys[m.id] ?? 0}
                          onChange={(v) => setSelfQty(m.id, v)}
                        />
                      ))}
                    </Section>
                    {selfTotal > 0 && (
                      <OrderSummary
                        meals={meals}
                        selfQtys={selfQtys}
                        selfTotal={selfTotal}
                        selDate={selDate}
                      />
                    )}
                  </>
                )}

                {bookType === "MONTHLY" && (
                  <>
                    <Section title="Select Meal Type">
                      <MealTypePicker
                        selected={monthlyMealId}
                        onSelect={(id) => {
                          setMonthlyMealId(id);
                          setMonthlySchedule(null);
                        }}
                        meals={meals}
                        isBookingType={true}
                      />
                    </Section>
                    {monthlyMealId && (
                      <ChooseYourDaysCard
                        monthlySchedule={monthlySchedule}
                        mMonthlyMeal={mMonthlyMeal}
                        setShowCalModal={setShowCalModal}
                      />
                    )}
                    {monthlySchedule && mMonthlyMeal && (
                      <MonthlyScheduleSummaryCard
                        mMonthlyMeal={mMonthlyMeal}
                        monthlySchedule={monthlySchedule}
                      />
                    )}
                  </>
                )}

                <CalendarBottomModal
                  showCalModal={showCalModal}
                  setShowCalModal={setShowCalModal}
                  mMonthlyMeal={mMonthlyMeal}
                  setMonthlySchedule={setMonthlySchedule}
                />
              </>
            )}

            {/* ══ GUEST MODE ══ */}
            {mode === "GUEST" && (
              <>
                <BookingTypeCard
                  bookType={bookType}
                  switchBookType={isEdit ? () => {} : switchBookType}
                />
                <GuestDetailsForm
                  vendorName={vendorName}
                  setVendorName={setVendorName}
                  userData={userData}
                />

                {bookType === "SINGLE" && (
                  <>
                    <OrderDateStripCard
                      selDate={selDate}
                      dateStrip={dateStrip}
                      today={today}
                      setSelDate={setSelDate}
                    />
                    <Section title="Select Meal Type">
                      <MealTypePicker
                        selected={vendorMealId}
                        onSelect={setVendorMealId}
                        meals={meals}
                        bookingType={"Guest"}
                      />
                    </Section>
                    <Section title="Quantity">
                      <View style={s.vendorQtyRow}>
                        <Text style={s.vendorQtyLabel}>Number of meals</Text>
                        <QuantityStepper
                          value={vendorQty}
                          onChange={setVendorQty}
                          min={1}
                          max={20000}
                        />
                      </View>
                    </Section>
                    {vendorName.trim() && vendorMealId && (
                      <GuestOrderSummaryCard
                        vendorName={vendorName}
                        empId={empId}
                        department={department}
                        selMealMeta={selMealMeta}
                        vendorQty={vendorQty}
                        selDate={selDate}
                      />
                    )}
                  </>
                )}

                {bookType === "MONTHLY" && (
                  <>
                    <Section title="Select Meal Type">
                      <MealTypePicker
                        selected={monthlyMealId}
                        onSelect={(id) => {
                          setMonthlyMealId(id);
                          setMonthlySchedule(null);
                        }}
                        meals={meals}
                        isBookingType={true}
                      />
                    </Section>
                    {monthlyMealId && (
                      <ChooseYourDaysCard
                        monthlySchedule={monthlySchedule}
                        mMonthlyMeal={mMonthlyMeal}
                        setShowCalModal={setShowCalModal}
                      />
                    )}
                    {monthlySchedule && mMonthlyMeal && (
                      <MonthlyScheduleSummaryCard
                        mMonthlyMeal={mMonthlyMeal}
                        monthlySchedule={monthlySchedule}
                      />
                    )}
                  </>
                )}

                <CalendarBottomModal
                  showCalModal={showCalModal}
                  setShowCalModal={setShowCalModal}
                  mMonthlyMeal={mMonthlyMeal}
                  setMonthlySchedule={setMonthlySchedule}
                />
              </>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[s.submitBtn, (!canSubmit || submitting) && s.submitOff]}
              onPress={handleSubmit}
              disabled={!canSubmit || submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={s.submitTxt}>
                    {isEdit
                      ? "Save Changes"
                      : bookType === "MONTHLY"
                        ? "Schedule Order"
                        : "Place Order"}
                  </Text>
                  <Text style={s.submitArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={s.hint}>
              Orders can be cancelled up to 2 hours before meal time.
            </Text>
          </Animated.View>
        </ScrollView>

        <SuccessModal
          visible={showModal}
          onDone={onDone}
          mode={mode}
          bookType={bookType}
          isEdit={isEdit}
        />
        <Toast message={toast.msg} visible={toast.show} type={toast.type} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateOrderScreen;
