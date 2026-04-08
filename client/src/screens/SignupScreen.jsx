/**
 * Screens/SignupScreen.jsx
 * ─────────────────────────────────────────────────────────────────
 * Registration screen for Lloyds Metals & Energy Canteen Management.
 *
 * Form fields (per users schema):
 *  • emp_id       — Employee ID (unique)
 *  • name         — Full Name
 *  • department   — Department
 *  • mobile       — Mobile Number (unique)
 *  • role         — USER | VENDOR (toggle/picker)
 *  • password     — min 6 chars
 *  • confirmPassword — must match password
 *
 * Features:
 *  • Multi-step feel via sectioned grouping
 *  • Full client-side validation
 *  • Role selector (USER / VENDOR pill toggle)
 *  • Animated card entrance
 *  • Back navigation to Login
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import styles from "./SignupScreen.module";
import axios from "axios";
// import Config from "react-native-config";

// ── Inline icon primitives ───────────────────────────────────────
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
const UserIcon = () => (
  <View style={{ alignItems: "center" }}>
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#AAAAAA",
      }}
    />
    <View
      style={{
        width: 14,
        height: 7,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderWidth: 2,
        borderColor: "#AAAAAA",
        borderBottomWidth: 0,
        marginTop: 1,
      }}
    />
  </View>
);
const BuildingIcon = () => (
  <View
    style={{
      width: 14,
      height: 14,
      borderWidth: 2,
      borderColor: "#AAAAAA",
      justifyContent: "flex-end",
      paddingBottom: 1,
    }}
  >
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            width: 3,
            height: 4,
            borderWidth: 1,
            borderColor: "#AAAAAA",
          }}
        />
      ))}
    </View>
  </View>
);
const PhoneIcon = () => (
  <View
    style={{
      width: 12,
      height: 16,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: "#AAAAAA",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingBottom: 2,
    }}
  >
    <View
      style={{
        width: 5,
        height: 1.5,
        backgroundColor: "#AAAAAA",
        borderRadius: 1,
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

// ── Validation ───────────────────────────────────────────────────
const validateForm = (form) => {
  const errors = {};

  // emp_id
  if (!form.empId.trim()) errors.empId = "Employee ID is required";
  else if (form.empId.trim().length < 3)
    errors.empId = "Employee ID must be at least 3 characters";

  // name
  if (!form.name.trim()) errors.name = "Full name is required";
  else if (form.name.trim().length < 2) errors.name = "Enter a valid full name";

  // department
  if (!form.department.trim()) errors.department = "Department is required";

  // mobile
  if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
  else if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
    errors.mobile = "Enter a valid 10-digit mobile number";

  // password
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  // confirmPassword
  if (!form.confirmPassword)
    errors.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
};

// ── Section Heading ──────────────────────────────────────────────
const SectionLabel = ({ label }) => (
  <View style={styles.sectionRow}>
    <View style={styles.sectionDot} />
    <Text style={styles.sectionLabel}>{label}</Text>
    <View style={styles.sectionLine} />
  </View>
);

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
const SignupScreen = () => {
  const navigation = useNavigation();

  // Form state (maps to users schema)
  const [form, setForm] = useState({
    empId: "",
    name: "",
    department: "",
    mobile: "",
    role: "USER", // 'USER' | 'VENDOR'
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });

   const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 3500);
  };

  // Animate card entrance
  const cardAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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

  // ── Field change handler ─────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Submit handler ───────────────────────────────────────────
  const handleSignup = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate API call — replace with actual registration service
    // web = http://localhost:5000/api/users/login

    // console.log(form)
    const payload = {
      emp_id: form.empId,
      name: form.name,
      department: form.department,
      mobile: form.mobile,
      role: form.role,
      password: form.password,
    };
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );

      // console.log(response);
      showToast("You are registred successfully");

      navigation.reset({
        index: 0,
        routes: [{ name: "login" }], // change to your route
      });
    } catch (error) {
      if (error.response) {
        // console.log(error)
        showToast("User already registered");
        // showToast(error.response.data.message);
      } else {
        showToast("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.bgTopBand} />
        <View style={styles.bgBottomAccent} />
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <View style={styles.backArrow} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>

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
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateY: cardAnim }], opacity: opacityAnim },
            ]}
          >
            {/* Header */}
            <AuthHeader
              title="Create Account"
              subtitle="Register your Lloyds employee profile"
            />

            {/* ── Form body ──────────────────────────────────── */}
            <View style={styles.form}>
              {/* — Section 1: Identity — */}
              <SectionLabel label="Employee Identity" />

              <AuthInput
                label="Employee ID *"
                value={form.empId}
                onChangeText={(v) => handleChange("empId", v)}
                placeholder="e.g. 71005830"
                error={errors.empId}
                leftIcon={<EmpIcon />}
                autoCapitalize="characters"
                maxLength={20}
              />

              <AuthInput
                label="Full Name *"
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
                placeholder="As per company records"
                error={errors.name}
                leftIcon={<UserIcon />}
                autoCapitalize="words"
                maxLength={100}
              />

              {/* — Section 2: Department & Contact — */}
              <SectionLabel label="Department & Contact" />

              <AuthInput
                label="Department *"
                value={form.department}
                onChangeText={(v) => handleChange("department", v)}
                placeholder="e.g. Operations, HR, Accounts"
                error={errors.department}
                leftIcon={<BuildingIcon />}
                autoCapitalize="words"
                maxLength={100}
              />

              <AuthInput
                label="Mobile Number *"
                value={form.mobile}
                onChangeText={(v) => handleChange("mobile", v)}
                placeholder="10-digit mobile number"
                error={errors.mobile}
                leftIcon={<PhoneIcon />}
                keyboardType="number-pad"
                maxLength={10}
              />

              {/* — Section 3: Role — */}
              {/* <SectionLabel label="Account Role" /> */}

              {/* <View style={styles.roleRow}>
                <Text style={styles.roleLabel}>Account Type</Text>
                <View style={styles.rolePills}>
                  {['USER', 'VENDOR'].map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.rolePill,
                        form.role === r && styles.rolePillActive,
                      ]}
                      onPress={() => handleChange('role', r)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.rolePillText,
                          form.role === r && styles.rolePillTextActive,
                        ]}
                      >
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}

              {/* Role description */}
              {/* <View style={styles.roleHint}>
                <Text style={styles.roleHintText}>
                  {form.role === 'USER'
                    ? '● Employee: Order meals, view menu & track balance'
                    : '● Vendor: Manage canteen items, view orders & reports'}
                </Text>
              </View> */}

              {/* — Section 4: Security — */}
              <SectionLabel label="Set Password" />

              <AuthInput
                label="Password *"
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                placeholder="Minimum 6 characters"
                error={errors.password}
                leftIcon={<LockIcon />}
                isPassword
              />

              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <View style={styles.strengthRow}>
                  <Text style={styles.strengthLabel}>Strength:</Text>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            form.password.length < 6 && i <= 1
                              ? "#E53935"
                              : form.password.length < 8 && i <= 2
                                ? "#FFA726"
                                : form.password.length < 10 && i <= 3
                                  ? "#FDD835"
                                  : i <= 4
                                    ? "#43A047"
                                    : "#EEEEEE",
                        },
                        i <=
                        (form.password.length < 6
                          ? 1
                          : form.password.length < 8
                            ? 2
                            : form.password.length < 10
                              ? 3
                              : 4)
                          ? {}
                          : { backgroundColor: "#EEEEEE" },
                      ]}
                    />
                  ))}
                  <Text style={styles.strengthText}>
                    {form.password.length < 6
                      ? "Weak"
                      : form.password.length < 8
                        ? "Fair"
                        : form.password.length < 10
                          ? "Good"
                          : "Strong"}
                  </Text>
                </View>
              )}

              <AuthInput
                label="Confirm Password *"
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
                placeholder="Re-enter your password"
                error={errors.confirmPassword}
                leftIcon={<LockIcon />}
                isPassword
              />

              {/* Submit button */}
              <View style={styles.submitWrapper}>
                <AuthButton
                  title="Create Account"
                  onPress={handleSignup}
                  loading={loading}
                />
              </View>

              {/* Back to login link */}
              {/* <TouchableOpacity
                style={styles.loginLinkRow}
                onPress={() => router.back()}
                // onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLinkText}>
                  Already registered?{" "}
                  <Text style={styles.loginLinkAccent}>Sign In</Text>
                </Text>
              </TouchableOpacity> */}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Toast message={toast.msg} visible={toast.show} />
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

export default SignupScreen;
