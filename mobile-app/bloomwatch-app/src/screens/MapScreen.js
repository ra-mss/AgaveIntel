import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Provider as PaperProvider, Card, HelperText } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import HeaderBar from "../components/HeaderBar";
import colors from "../theme/colors";

export default function MapScreen() {
  const [year, setYear] = useState(2025);
  const [agaveData, setAgaveData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulación de consulta automática al cambiar año
  const handleYearChange = async (selectedYear) => {
    setYear(selectedYear);
    setLoading(true);

    // Simula retardo de red (solo visual)
    setTimeout(() => {
      const simulatedData = {
        area: Math.round(Math.random() * 10000),
        prediction:
          selectedYear > 2025
            ? "🌿 Predicción de incremento moderado"
            : "🌾 Datos históricos confirmados",
      };
      setAgaveData(simulatedData);
      setLoading(false);
    }, 1000);
  };

  // Carga inicial automática
  useEffect(() => {
    handleYearChange(year);
  }, []);

  const years = Array.from({ length: 31 }, (_, i) => 2000 + i);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <HeaderBar
          title="🌵 BloomWatch Prototype"
          subtitle="Fenología de agaves por año"
        />

        {/* Selector de año */}
        <Card style={styles.card}>
          <Text style={styles.label}>Selecciona un año:</Text>
          <Picker
            selectedValue={year}
            onValueChange={handleYearChange}
            style={styles.picker}
          >
            {years.map((y) => (
              <Picker.Item key={y} label={y.toString()} value={y} />
            ))}
          </Picker>
        </Card>

        {/* Estado de carga */}
        {loading && (
          <ActivityIndicator size="large" color={colors.primaryDark} />
        )}

        {/* Resultados simulados */}
        {!loading && agaveData && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Datos para {year}</Text>
            <HelperText type="info">
              Cobertura vegetal estimada: {agaveData.area.toLocaleString()} ha
            </HelperText>
            <Text style={styles.prediction}>{agaveData.prediction}</Text>
          </Card>
        )}

        {/* Placeholder para el mapa */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ </Text>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 80,
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: colors.primaryDark,
  },
  picker: {
    width: "100%",
    marginTop: 10,
  },
  resultCard: {
    width: "85%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: colors.secondaryLight,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  prediction: {
    fontSize: 16,
    marginTop: 5,
    color: colors.primaryDark,
  },
  mapPlaceholder: {
    width: "85%",
    height: 180,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: "#F1F8E9",
  },
  mapText: {
    color: colors.primary,
    fontSize: 14,
  },
});
