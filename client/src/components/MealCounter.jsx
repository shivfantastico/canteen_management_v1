/**
 * src/components/MealCounter.jsx
 * Meal row with [−] qty [+] stepper.
 * Props: meal, quantity, onChange, maxQty
 */

import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import s from "./MealCounter.module";

const MEAL_META = {
  breakfast: { emoji: "🌅", color: "#F57C00", bg: "#FFF3E0" },
  lunch: { emoji: "☀️", color: "#388E3C", bg: "#E8F5E9" },
  dinner: { emoji: "🌙", color: "#1565C0", bg: "#E3F2FD" },
  snacks: { emoji: "☕", color: "#7B1FA2", bg: "#F3E5F5" },
};

const MealCounter = ({ meal, quantity = 0, onChange, maxQty = 2000 }) => {
  // console.log(meal);
  // console.log(meal);
  const scale = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.93,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 28 }),
    ]).start();
  };

  const dec = () => {
    if (!meal.isOpen) return;

    if (quantity > 0) {
      bounce();
      onChange(quantity - 1);
    }
  };
  const inc = () => {
    if (!meal.isOpen) return;
    if (quantity < maxQty) {
      bounce();
      onChange(quantity + 1);
    }
  };

  const active = quantity > 0;

  return (
    <Animated.View
      style={[s.card, active && s.cardActive, { transform: [{ scale }] }]}
    >
      {/* Left: icon + info */}
      <View style={s.left}>
        <View style={[s.iconBox, { backgroundColor: meal.bg }]}>
          <Text style={s.emoji}>{meal.emoji}</Text>
        </View>
        <View>
          <Text style={[s.name, active && s.nameActive]}>{meal.name}</Text>

          {meal.isToday &&
            (meal.isUrgent && meal.countdown ? (
              <View style={s.countdownChip}>
                <Text style={s.countdownTxt}>🕐 {meal.countdown}</Text>
              </View>
            ) : (
              <View style={s.deadlineRow}>
                <Text
                  style={[
                    s.deadlineTxt,
                    { color: meal.isOpen ? "#313030" : "#CCCCCC" },
                  ]}
                  numberOfLines={1}
                >
                  {meal.isOpen
                    ? `⏰ Closes ${meal.deadlineLabel}`
                    : `🔒 Opens ${meal.startLabel}`}
                </Text>
              </View>
            ))}
        </View>
      </View>

      {/* Stepper */}
      <View style={s.stepper}>
        <TouchableOpacity
          style={[s.btn, (quantity <= 0 || !meal.isOpen) && s.btnOff]}
          onPress={dec}
          disabled={quantity <= 0 || !meal.isOpen}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.75}
        >
          <Text
            style={[s.btnTxt, (quantity <= 0 || !meal.isOpen) && s.btnTxtOff]}
          >
            −
          </Text>
        </TouchableOpacity>

        <View style={[s.qtyBox, active && s.qtyBoxActive]}>
          <Text style={[s.qty, active && s.qtyActive]}>{quantity}</Text>
        </View>

        <TouchableOpacity
          style={[
            s.btn,
            s.btnAdd,
            (quantity >= maxQty || !meal.isOpen) && s.btnOff,
          ]}
          onPress={inc}
          disabled={quantity >= maxQty || !meal.isOpen}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.75}
        >
          <Text style={[s.btnTxt, s.btnTxtAdd]}>+</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default MealCounter;
