/**
 * src/screens/HomeScreen.jsx
 * Updated: TodayMealStrip reads from GET /api/meal and respects
 * cutoff_day_offset + cutoff_time. Auto-refreshes every 60 seconds.
 *
 * FIX: Duplicate PunchModal
 * The modal was firing multiple times per punch because:
 *   1. The socket event itself can fire more than once (server-side duplicate emits,
 *      or React re-attaching listeners on re-render).
 *   2. fetchOrders() inside the handler triggered a state update → re-render →
 *      the useEffect cleanup/re-attach cycle added extra listeners.
 *   3. The old guard (setShowPunchModal prev => ...) only prevented the modal
 *      STATE from flipping twice, but the handler still ran — meaning setPunchResult
 *      was still called, overwriting the result object mid-display.
 *
 * Fix applied (socket useEffect only — nothing else changed):
 *   • punchHandledRef: a ref flag that is set to true on the first punch event
 *     and reset after 1 000 ms. Any duplicate events within that window are
 *     silently dropped before any state is touched.
 *   • Token is read fresh from AsyncStorage inside the handler, avoiding the
 *     stale-closure problem that caused fetchOrders to sometimes use an
 *     outdated token when the effect re-ran.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  ImageBackground,
  Modal,
} from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import s from "./HomeScreen.module";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../../socket";
import PunchModal from "../components/PunchModal";
// import Config from "react-native-config";

const FILTERS = ["ALL", "UPCOMING", "COMPLETED", "CANCELLED", "GUEST"];

const MEAL_META = {
  breakfast: { emoji: "🌅", color: "#F57C00", bg: "#FFF3E0" },
  lunch: { emoji: "☀️", color: "#388E3C", bg: "#E8F5E9" },
  dinner: { emoji: "🌙", color: "#1565C0", bg: "#E3F2FD" },
  snacks: { emoji: "☕", color: "#7B1FA2", bg: "#F3E5F5" },
};

// ─────────────────────────────────────────────────────────────────
// CUTOFF LOGIC
// ─────────────────────────────────────────────────────────────────
const getMealStatus = (meal) => {
  const now = new Date();

  const [hh, mm, ss] = meal.cutoff_time.split(":").map(Number);
  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + meal.cutoff_day_offset);
  deadline.setHours(hh, mm, ss ?? 0, 0);

  const [hh2, mm2, ss2] = meal.serviceStart_time.split(":").map(Number);
  const serviceStart = new Date(now);
  serviceStart.setDate(serviceStart.getDate() + meal.serviceStart_day_offset);
  serviceStart.setHours(hh2, mm2, ss2 ?? 0, 0);

  const isOpen2 = !(serviceStart > now);

  const dayWord2 =
    meal.serviceStart_day_offset === 0
      ? "Today"
      : meal.serviceStart_day_offset === -1
        ? "Yesterday"
        : meal.serviceStart_day_offset === 1
          ? "Tomorrow"
          : `${Math.abs(meal.serviceStart_day_offset)}d ${meal.serviceStart_day_offset < 0 ? "ago" : "later"}`;

  const timeStr2 = serviceStart.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

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

  const dayWord =
    meal.cutoff_day_offset === 0
      ? "Today"
      : meal.cutoff_day_offset === -1
        ? "Yesterday"
        : meal.cutoff_day_offset === 1
          ? "Tomorrow"
          : `${Math.abs(meal.cutoff_day_offset)}d ${meal.cutoff_day_offset < 0 ? "ago" : "later"}`;

  const timeStr = deadline.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    isOpen,
    isUrgent,
    countdown,
    deadlineLabel: `${dayWord} ${timeStr}`,
    startLabel: `${dayWord2} ${timeStr2}`,
    isOpen2,
  };
};

// ─────────────────────────────────────────────────────────────────
// TODAY'S MEAL STRIP
// ─────────────────────────────────────────────────────────────────
const TodayMealStrip = ({ meals }) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const openCount = meals.filter((m) => getMealStatus(m).isOpen).length;
  const closedCount = meals.length - openCount;

  return (
    <View style={s.todayWrap}>
      <View style={s.todayHeader}>
        <View>
          <Text style={s.todayTitle}>{"Today's Menu"}</Text>
          <Text style={s.todaySubtitle}>Live booking availability</Text>
        </View>
        <View style={s.availSummary}>
          <View style={[s.availDot, { backgroundColor: "#2E7D32" }]} />
          <Text style={s.availSummaryTxt}>{openCount} open</Text>
          {closedCount > 0 && (
            <>
              <Text style={s.availSep}>·</Text>
              <View style={[s.availDot, { backgroundColor: "#BBBBBB" }]} />
              <Text style={[s.availSummaryTxt, { color: "#AAAAAA" }]}>
                {closedCount} closed
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={s.mealGrid}>
        {meals.map((meal) => {
          const {
            isOpen,
            isUrgent,
            countdown,
            deadlineLabel,
            startLabel,
            isOpen2,
          } = getMealStatus(meal);
          const meta = MEAL_META[meal.name.toLowerCase()] ?? {
            emoji: "🍽️",
            color: "#555",
            bg: "#F5F5F5",
          };

          return (
            <View
              key={meal.id}
              style={[
                s.mealCard,
                isOpen && !isUrgent && s.mealCardOpen,
                isOpen && isUrgent && s.mealCardUrgent,
                !isOpen && s.mealCardClosed,
              ]}
            >
              <View
                style={[
                  s.mealCardBand,
                  {
                    backgroundColor: isOpen
                      ? isUrgent
                        ? "#FFF8E1"
                        : meta.bg
                      : "#F5F5F5",
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
                        : isUrgent
                          ? "#FF8F00"
                          : "#2E7D32",
                    },
                  ]}
                >
                  {isOpen2 ? (
                    <Text style={s.statusBadgeTxt}>{"●  OPEN"}</Text>
                  ) : (
                    <Text style={s.statusBadgeTxt}>
                      {!isOpen
                        ? "✕  CLOSED"
                        : isUrgent
                          ? "⚡  CLOSING"
                          : "●  OPEN"}
                    </Text>
                  )}
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
                {isUrgent && countdown ? (
                  <View style={s.countdownChip}>
                    <Text style={s.countdownTxt}>🕐 {countdown}</Text>
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
                        ? `⏰ Closes ${deadlineLabel}`
                        : `🔒 Opens ${startLabel}`}
                    </Text>
                  </View>
                )}
              </View>
              {!isOpen && <View style={s.closedOverlay} />}
            </View>
          );
        })}
      </View>

      <Text style={s.todayFooterTxt}>
        🔒 Book before the cutoff to secure your meal
      </Text>
    </View>
  );
};

// ── Toast ─────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(2700),
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, message]);
  return (
    <Animated.View style={[s.toast, { opacity: anim }]}>
      <Text style={s.toastTxt}>⚠ {message}</Text>
    </Animated.View>
  );
};

const StatCard = ({ icon, value, label, color }) => (
  <View style={[s.statCard, { borderTopColor: color }]}>
    <Text style={s.statIcon}>{icon}</Text>
    <Text style={[s.statValue, { color }]}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const Empty = ({ filter }) => (
  <View style={s.emptyWrap}>
    <Text style={s.emptyEmoji}>🍽️</Text>
    <Text style={s.emptyTitle}>No Orders Found</Text>
    <Text style={s.emptySub}>
      {filter === "ALL"
        ? "No orders yet. Tap + Create Order to get started."
        : `No ${filter.toLowerCase()} orders to display.`}
    </Text>
  </View>
);

// ─────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────
const HomeScreen = () => {
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [toast, setToast] = useState({ msg: "", show: false });
  const [userData, setUserData] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [punchResult, setPunchResult] = useState({});
  const [showPunchModal, setShowPunchModal] = useState(false);

  const fabAnim = useRef(new Animated.Value(0)).current;
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // ── Deduplication ref ─────────────────────────────────────────
  // Tracks whether we're already within the 1-second window of a
  // handled punch event. Any duplicate socket fires within that
  // window are dropped before touching any state.
  const punchHandledRef = useRef(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    Animated.spring(fabAnim, {
      toValue: 1,
      delay: 500,
      useNativeDriver: true,
      speed: 12,
      bounciness: 10,
    }).start();
  }, []);

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 3500);
  };

  const fetchOrders = async (token) => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await axios.get(`${API_URL}/api/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOrders(response.data.data || []);
    } catch (err) {
      showToast(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cancelOrder = async (order) => {
    try {
      setCancelling(true);
      const data = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(data);
      await axios.delete(`${API_URL}/api/order/${order.id}`, {
        headers: {
          Authorization: `Bearer ${parsedData?.token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      setCancelTarget(null);
      fetchOrders(parsedData?.token);
    } catch (err) {
      setCancelTarget(null);
      showToast(
        err.response?.data?.message || err.message || "Failed to cancel order.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const getMeals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/meal`);
      setMeals(res.data.data || []);
    } catch (err) {
      console.log("Meals fetch error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const data = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(data);
      setUserData(parsedData);
      if (parsedData?.token) fetchOrders(parsedData.token);
    };
    init();
    getMeals();
  }, []);

  // ── Socket: punch result listener ────────────────────────────
  // FIX: punchHandledRef guards against duplicate events.
  // The ref resets after 1 000 ms so the next genuine punch works.
  // Token is read fresh from AsyncStorage to avoid stale closures.
  useEffect(() => {
    if (!userData?.user?.emp_id) return;

    const empId = String(userData.user.emp_id);

    const onConnect = () => {
      console.log("✅ Connected:", socket.id);
      socket.emit("join", empId);
    };

    const onPunchResult = async (data) => {
      // ── Deduplication gate ────────────────────────────────────
      // If this ref is already true, a punch was handled <1 s ago.
      // Drop the duplicate entirely — don't touch any state.
      if (punchHandledRef.current) return;
      punchHandledRef.current = true;
      setTimeout(() => {
        punchHandledRef.current = false;
      }, 1000);
      // ─────────────────────────────────────────────────────────

      console.log("🔥 Punch received:", data);
      setPunchResult(data);
      setShowPunchModal(true);

      // Read token fresh — avoids stale closure over userData
      try {
        const raw = await AsyncStorage.getItem("userData");
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed?.token) fetchOrders(parsed.token);
      } catch (_) {
        /* network error — orders will refresh on next pull-to-refresh */
      }
    };

    // Remove any stale listeners before attaching fresh ones
    socket.off("connect", onConnect);
    socket.off("punch_result", onPunchResult);
    socket.on("connect", onConnect);
    socket.on("punch_result", onPunchResult);

    return () => {
      socket.off("connect", onConnect);
      socket.off("punch_result", onPunchResult);
    };
  }, [userData?.user?.emp_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived ───────────────────────────────────────────────────
  const now = new Date();
  const upcoming = (orders || []).filter((o) => o.status === "UPCOMING").length;
  const monthly = (orders || []).filter((o) => {
    const d = new Date(o.order_date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  let displayed = orders;
  if (filter === "GUEST")
    displayed = orders.filter((o) => o.booking_for === "GUEST");
  else if (filter !== "ALL")
    displayed = orders.filter((o) => o.status === filter);
  else displayed = orders.filter((o) => o.status !== "CANCELLED");

  const ListHeader = (
    <>
      <View style={s.statsRow}>
        <StatCard
          icon="🗓️"
          value={upcoming}
          label="Upcoming Meals"
          color="#1565C0"
        />
        <StatCard
          icon="📊"
          value={monthly}
          label="Orders This Month"
          color="#C0000A"
        />
      </View>

      {meals.length > 0 && <TodayMealStrip meals={meals} />}

      <View style={s.secHead}>
        <Text style={s.secTitle}>My Orders</Text>
        <Text style={s.secCount}>
          {displayed.length} record{displayed.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[s.fTab, filter === f && s.fTabOn]}
            onPress={() => setFilter(f)}
            activeOpacity={0.75}
          >
            <Text style={[s.fTxt, filter === f && s.fTxtOn]}>
              {f === "ALL" ? "All" : f[0] + f.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <View style={s.screen}>
      <Header
        userData={userData}
        title="Canteen Management"
        subtitle="Lloyds Metals & Energy Ltd."
        showProfile
      />

      <ImageBackground
        source={require("../../assets/HomePage_Banner.png")}
        style={s.heroBg}
        imageStyle={s.heroBgImg}
        resizeMode="cover"
      >
        <View style={s.heroOverlay} />
        <View style={s.heroContent}>
          <Text style={s.heroGreeting}>
            {greeting}, {userData?.user?.name || "User"}
          </Text>
          <Text style={s.heroSub}>Manage your canteen meals below</Text>
          <View style={s.heroBrand}>
            <View style={s.heroBrandDot} />
            <Text style={s.heroBrandTxt}>LLOYDS METALS & ENERGY</Text>
            <View style={s.heroBrandDot} />
          </View>
        </View>
      </ImageBackground>

      {loading ? (
        <View style={s.loadWrap}>
          <ActivityIndicator size="large" color="#C0000A" />
          <Text style={s.loadTxt}>Loading your orders…</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onEdit={(order) =>
                router.push({
                  pathname: "/create-order",
                  params: { editOrder: JSON.stringify(order) },
                })
              }
              onCancel={(order) => setCancelTarget(order)}
            />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<Empty filter={filter} />}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(userData?.token)}
              colors={["#C0000A"]}
              tintColor="#C0000A"
            />
          }
        />
      )}

      <Animated.View
        style={[
          s.fabWrap,
          {
            transform: [
              { scale: fabAnim },
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            opacity: fabAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={s.fab}
          onPress={() => router.push("/create-order")}
          activeOpacity={0.85}
        >
          <Text style={s.fabPlus}>+</Text>
          <Text style={s.fabLbl}>Create Order</Text>
        </TouchableOpacity>
      </Animated.View>

      <Toast message={toast.msg} visible={toast.show} />

      {/* ── Cancel confirmation modal ─────────────────────── */}
      <Modal
        transparent
        visible={!!cancelTarget}
        animationType="fade"
        onRequestClose={() => setCancelTarget(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.52)",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 28,
              width: "100%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#FFF0F0",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 14,
                borderWidth: 2,
                borderColor: "#C62828",
              }}
            >
              <Text style={{ fontSize: 26 }}>🗑</Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "900",
                color: "#111111",
                marginBottom: 6,
              }}
            >
              Cancel Order?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#777777",
                textAlign: "center",
                lineHeight: 20,
                marginBottom: 6,
              }}
            >
              {cancelTarget?.order_number} · {cancelTarget?.meal_name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#AAAAAA",
                textAlign: "center",
                lineHeight: 18,
                marginBottom: 24,
              }}
            >
              This action cannot be undone. The order will be marked as
              cancelled.
            </Text>
            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: "#DDDDDD",
                  paddingVertical: 13,
                  alignItems: "center",
                  backgroundColor: "#F8F8F8",
                }}
                onPress={() => setCancelTarget(null)}
                activeOpacity={0.8}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#555555" }}
                >
                  Keep
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 12,
                  backgroundColor: "#C62828",
                  paddingVertical: 13,
                  alignItems: "center",
                  shadowColor: "#C62828",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => cancelOrder(cancelTarget)}
                disabled={cancelling}
                activeOpacity={0.85}
              >
                {cancelling ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Yes, Cancel
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Punch result modal ───────────────────────────────── */}
      <PunchModal
        visible={showPunchModal}
        punchResult={punchResult}
        onClose={() => setShowPunchModal(false)}
      />
    </View>
  );
};

export default HomeScreen;