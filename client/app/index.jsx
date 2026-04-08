/**
 * app/index.jsx
 * Redirects root "/" to "/login" — Expo Router entry point.
 */

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;
  // return <Redirect href="/login" />;
}
