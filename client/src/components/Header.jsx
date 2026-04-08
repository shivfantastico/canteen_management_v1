/**
 * src/components/Header.jsx
 * Reusable top navigation bar — Lloyds brand red + white.
 *
 * Props:
 *   title       — heading text
 *   subtitle    — small text below title
 *   showBack    — show left back arrow
 *   onBack      — back press callback
 *   showProfile — show initials avatar
 *   userName    — name for avatar initials
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import s from "./Header.module";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const initials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showProfile = false,
  userName = "",
}) => {
  // let userData = AsyncStorage.getItem("userData");
  // userData = JSON.parse(userData)
  const [userData, setUserData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setShowMenu(false);
      router.replace("/login"); // redirect to login
    } catch (err) {
      console.log("Logout error", err);
    }
  };

  const fetchUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (err) {
      console.log("Error fetching user data", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    
    <SafeAreaView style={s.safe} >
      <TouchableOpacity onPress={() => setShowMenu(false)} activeOpacity={1}>
      <StatusBar barStyle="light-content" backgroundColor="#C0000A" />
      <View style={s.bar}>
        {/* Left */}
        <View style={s.side}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={s.backBtn}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={s.arrow} />
            </TouchableOpacity>
          ) : (
            /* Gear logo mark */
            <View style={s.gear}>
              {/* <View style={s.gearOuter}>
              <View style={s.gearInner} />
              <View style={[s.spoke, { transform: [{ rotate: '0deg' }] }]} />
              <View style={[s.spoke, { transform: [{ rotate: '90deg' }] }]} />
            </View> */}
            </View>
          )}
        </View>

        {/* Center */}
        <View style={s.center}>
          <Text style={s.title} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={s.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right */}
        <View style={s.side}>
          {showProfile ? (
            <View>
              <TouchableOpacity
                style={s.avatar}
                onPress={() => setShowMenu(!showMenu)}
              >
                <Text style={s.avatarTxt}>
                  {initials(userData?.user?.name) || "?"}
                </Text>
              </TouchableOpacity>

              {showMenu && (
                <View style={s.dropdown}>
                  <TouchableOpacity
                    style={s.dropdownItem}
                    onPress={handleLogout}
                  >
                    <Text style={s.dropdownText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={{ width: 38 }} />
          )}
        </View>
      </View>
      </TouchableOpacity>
    </SafeAreaView>
    
  );
};

export default Header;
