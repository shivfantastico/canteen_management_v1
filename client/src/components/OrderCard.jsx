/**
 * src/components/OrderCard.jsx
 * Single order card — props: { order, onEdit, onCancel }
 *
 * Edit (✎) and Cancel (🗑) buttons appear ONLY for UPCOMING orders.
 * Completed / Cancelled orders are read-only.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import s from "./OrderCard.module";

const STATUS = {
  UPCOMING:  { color: "#1565C0", bg: "#E3F2FD", label: "Upcoming",  icon: "🔵" },
  COMPLETED: { color: "#2E7D32", bg: "#E8F5E9", label: "Completed", icon: "✅" },
  CANCELLED: { color: "#C62828", bg: "#FFEBEE", label: "Cancelled", icon: "🔴" },
};

const MEAL_EMOJI = { Breakfast: "🌅", Lunch: "☀️", Snacks: "☕", Dinner: "🌙" };
const MEAL_COLOR = {
  Breakfast: { color: "#F57C00", bg: "#FFF3E0" },
  Lunch:     { color: "#388E3C", bg: "#E8F5E9" },
  Snacks:    { color: "#7B1FA2", bg: "#F3E5F5" },
  Dinner:    { color: "#1565C0", bg: "#E3F2FD" },
};

const fmt = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
};

const OrderCard = ({ order, onEdit, onCancel }) => {
  const st         = STATUS[order.status] || STATUS.UPCOMING;
  const emoji      = MEAL_EMOJI[order.meal_name] || "🍽️";
  const mc         = MEAL_COLOR[order.meal_name] || { color: "#C0000A", bg: "#FFF0F0" };
  const qty        = order.total_quantity ?? order.quantity ?? 1;
  const isUpcoming = order.status === "UPCOMING";
  const isCompleted = order.status === "Completed";

  return (
    <TouchableOpacity>

    <View style={[s.card, { borderLeftColor: st.color }]}>

      {/* ── Top row: order number + status badge ──────────── */}
      <View style={s.topRow}>
        <Text style={s.orderNum}>🧾 {order.order_number}</Text>
        <View style={[s.badge, { backgroundColor: st.bg }]}>
          <Text style={[s.badgeTxt, { color: st.color }]}>
            {st.icon} {st.label}
          </Text>
        </View>
      </View>

      <View style={s.divider} />

      {/* ── Meal info row ─────────────────────────────────── */}
      <View style={s.mealRow}>
        <View style={[s.emojiBox, { backgroundColor: mc.bg }]}>
          <Text style={s.emoji}>{emoji}</Text>
        </View>
        <View style={s.mealMeta}>
          <Text style={[s.mealName, { color: mc.color }]}>
            {order.meal_name || "Meal"}
          </Text>
          <Text style={s.mealDate}>{fmt(order.order_date)}</Text>
        </View>
        <View style={s.qtyBox}>
          <Text style={s.qtyLbl}>QTY</Text>
          <Text style={s.qtyVal}>{qty}</Text>
        </View>
      </View>

      {/* ── Footer ────────────────────────────────────────── */}
      <View style={s.footer}>
        {/* Booking type + for pill */}
        <View style={s.typePill}>
          <Text style={s.typeTxt}>
            {order.booking_type === "MONTHLY" ? "📅  Monthly" : "📌  Single"}
          </Text>
          <Text style={s.bookingTypeTxt}>
            {order.booking_for === "GUEST" ? "⬤  Guest" : "⬤  Self"}
          </Text>
        </View>

        {/* Action buttons — UPCOMING only; otherwise placed date */}
        {isUpcoming ? (
          <View style={s.actionRow}>
            {/* Edit button */}
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => onEdit && onEdit(order)}
              activeOpacity={0.8}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={s.editBtnTxt}>✎</Text>
            </TouchableOpacity>
            {/* Cancel button */}
            <TouchableOpacity
              style={s.cancelBtn}
              onPress={() => onCancel && onCancel(order)}
              activeOpacity={0.8}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={s.cancelBtnTxt}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={s.placedTxt}>Placed {fmt(order.created_at)}</Text>
        )}
      </View>

      {/* Placed date shown as small sub-line for upcoming cards */}
      {isUpcoming && (
        <Text style={s.placedTxtSmall}>Placed {fmt(order.created_at)}</Text>
      )}
    </View>
    </TouchableOpacity>
  );
};

export default OrderCard;