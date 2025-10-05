import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Switch } from "react-native";
import MapView, { UrlTile } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import HeaderBar from "../components/HeaderBar";
import colors from "../theme/colors";
import { getAgaveMap } from "../api/bloomwatchApi";

export default function MapScreen() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(4);
  const [showNDVI, setShowNDVI] = useState(false);
  const [urls, setUrls] = useState(null);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 2024 - 2017 + 1 }, (_, i) => 2017 + i);
  const months = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];

  const fetchMap = async (selectedYear, selectedMonth) => {
    setLoading(true);
    try {
      const data = await getAgaveMap(selectedYear, selectedMonth);
      setUrls(data);
    } catch (error) {
      console.error("Error cargando el mapa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMap(year, month);
  }, [year, month]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <HeaderBar
        title="🌵 BloomWatch"
        subtitle="Fenología de agaves"
        style={styles.header}
      />

      {/* Controles compactos en una fila */}
      <View style={styles.controlsRow}>
        {/* Año */}
        <View style={styles.control}>
          <Text style={styles.label}>Año</Text>
          <Picker
            selectedValue={year}
            onValueChange={setYear}
            style={styles.picker}
            itemStyle={{ fontSize: 16 }}
          >
            {years.map((y) => (
              <Picker.Item key={y} label={y.toString()} value={y} />
            ))}
          </Picker>
        </View>

        {/* Mes */}
        <View style={styles.control}>
          <Text style={styles.label}>Mes</Text>
          <Picker
            selectedValue={month}
            onValueChange={setMonth}
            style={styles.picker}
            itemStyle={{ fontSize: 16 }}
          >
            {months.map((m) => (
              <Picker.Item key={m.value} label={m.label} value={m.value} />
            ))}
          </Picker>
        </View>

        {/* Switch NDVI */}
        <View style={[styles.control, { alignItems: "center" }]}>
          <Text style={styles.label}>NDVI</Text>
          <Switch
            value={showNDVI}
            onValueChange={setShowNDVI}
            trackColor={{ false: "#ccc", true: colors.primary }}
            thumbColor={showNDVI ? colors.primaryDark : "#fff"}
          />
        </View>
      </View>

      {/* Loader */}
      {loading && (
        <ActivityIndicator size="large" color={colors.primaryDark} style={styles.loader} />
      )}

      {/* MAPA */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 20.5,
            longitude: -103.5,
            latitudeDelta: 3,
            longitudeDelta: 3,
          }}
        >
          {showNDVI && urls?.ndvi_vigor && (
            <UrlTile
              urlTemplate={urls.ndvi_vigor}
              zIndex={2}
              maximumZ={19}
              tileSize={256}
            />
          )}
          {urls?.ndre_salud && (
            <UrlTile
              urlTemplate={urls.ndre_salud}
              zIndex={1}
              maximumZ={19}
              tileSize={256}
            />
          )}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    paddingTop: 40,
  },
  header: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 12, // más altura para que no se corte
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
  },
  control: {
    flex: 1,
    alignItems: "center",
  },
  label: { 
    fontSize: 16, 
    color: colors.primaryDark, 
    marginBottom: 4,
  },
  picker: { 
    width: "100%",
    height: 50, // un poco más alto
  },
  mapContainer: { 
    flex: 1, 
    marginTop: 5, 
  },
  map: { 
    flex: 1, 
  },
  loader: { 
    marginVertical: 10,
  },
});
