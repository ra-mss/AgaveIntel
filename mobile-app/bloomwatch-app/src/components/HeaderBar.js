import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function HeaderBar({ title, subtitle, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center", // centra horizontalmente
    justifyContent: "center",
  },
  title: {
    fontSize: 24, // más grande y legible
    fontWeight: "bold",
    color: colors.primaryDark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    marginTop: 2,
  },
});
