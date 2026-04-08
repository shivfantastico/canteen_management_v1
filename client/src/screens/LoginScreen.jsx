/**
 * Screens/LoginScreen.jsx
 * ─────────────────────────────────────────────────────────────────
 * Login screen for Lloyds Metals & Energy Canteen Management System.
 *
 * Form fields (per users schema):
 *  • Employee ID (emp_id)  — unique identifier
 *  • Password              — min 6 characters
 *
 * Features:
 *  • Client-side validation with inline error messages
 *  • Animated background with industrial gradient
 *  • KeyboardAvoidingView + ScrollView for keyboard handling
 *  • Loading state simulation
 *  • Navigate to Signup screen
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import styles from "./LoginScreen.module";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Config from "react-native-config";

// ── Inline icon components (replace with react-native-vector-icons) ──
const EmpIcon = () => (
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#AAAAAA",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#AAAAAA",
      }}
    />
  </View>
);
const LockIcon = () => (
  <View style={{ alignItems: "center" }}>
    <View
      style={{
        width: 12,
        height: 7,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderWidth: 2,
        borderColor: "#AAAAAA",
        borderBottomWidth: 0,
      }}
    />
    <View
      style={{
        width: 16,
        height: 10,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: "#AAAAAA",
        marginTop: -1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: "#AAAAAA",
        }}
      />
    </View>
  </View>
);

// ── Validation helpers ───────────────────────────────────────────
const validate = (empId, password) => {
  const errors = {};
  if (!empId.trim()) errors.empId = "Employee ID is required";
  else if (empId.trim().length < 3) errors.empId = "Enter a valid Employee ID";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return errors;
};

// ── Toast ────────────────────────────────────────────────────
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
    <Animated.View style={[styles.toast, { opacity: anim }]}>
      <Text style={styles.toastTxt}>{message}</Text>
    </Animated.View>
  );
};

// ── Component ────────────────────────────────────────────────────
const LoginScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 3500);
  };
  // Animate the card on mount
  const cardAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toastAnim = useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Form submit ──────────────────────────────────────────────
  const handleLogin = async () => {
    // console.log(empId, password)

    const validationErrors = validate(empId, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    //const payload = {empId, password}

    // Simulate API call — replace with actual auth service
    // web = http://localhost:5000/api/users/login
    // android = http://10.0.2.2:5000/api/users/login
    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          emp_id: empId.trim(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );

      const userData = JSON.stringify(response.data);
      const { token } = response.data;

      if (!token) {
        showToast("Invalid server response", "error");
        return;
      }
      await AsyncStorage.setItem("userData", userData);
      // console.log(response.data.token);
      showToast("Login successful! Welcome back", "success");
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "home" }],
        });
      }, 600);
    } catch (error) {
      // console.log(error)
      if (error) {
        // console.log(error.response.data?.message)
        showToast(
          error.response.data?.message || "Invalid credentials",
          "error",
        );
      } else {
        showToast("Unable to connect to server", "error");
      }
    } finally {
      setLoading(false);
    }

    //**********************
  };

  // Clear error on field change
  const handleEmpIdChange = (text) => {
    setEmpId(text);
    if (errors.empId) setErrors((prev) => ({ ...prev, empId: "" }));
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background with industrial gradient layers */}

      <View style={styles.background}>
        {/* Top accent band */}
        <View style={styles.bgTopBand} />

        {/* Bottom accent */}
        <View style={styles.bgBottomAccent} />
      </View>

      <KeyboardAvoidingView
        style={styles.kavContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Animated Card ───────────────────────────────── */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateY: cardAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            {/* Header: Logo + title */}
            <AuthHeader
              title="Welcome Back"
              subtitle="Sign in to your Lloyds account"
            />

            {/* ── Form ──────────────────────────────────────── */}
            <View style={styles.form}>
              {/* Employee ID field */}
              <AuthInput
                label="Employee ID"
                value={empId}
                onChangeText={handleEmpIdChange}
                placeholder="e.g. 71005830"
                error={errors.empId}
                leftIcon={<EmpIcon />}
                autoCapitalize="characters"
                maxLength={20}
              />

              {/* Password field */}
              <AuthInput
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Enter your password"
                error={errors.password}
                leftIcon={<LockIcon />}
                isPassword
              />

              {/* Forgot password link */}
              {/* <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity> */}

              {/* Login button */}
              <AuthButton
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
              />

              {/* Divider */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              {/* Navigate to Signup */}
              <AuthButton
                title="Create Account"
                onPress={() => navigation.navigate("Signup")}
                variant="outline"
                disabled={loading}
              />

              <Toast message={toast.msg} visible={toast.show} />
            </View>

            {/* ── Footer ────────────────────────────────────── */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © {new Date().getFullYear()} Lloyds Metals & Energy Ltd.
              </Text>
              <Text style={styles.footerSubText}>
                Canteen Management System v1.0
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
