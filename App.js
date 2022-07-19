import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from "expo-location";
import axios from "axios";

import CurrentWeather from "./components/CurrentWeather";
import Forecasts from "./components/Forecasts";

const API_URL = (lat, lon) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f5c382e18131ee20c243227653a7d50c&lang=fr&units=metric`;

export default function App() {
  // Récupérer les coordonnées de user
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getCoordinates = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return
      }

      const userLocation = await Location.getCurrentPositionAsync();
      getWeather(userLocation);
    }

    getCoordinates();
  }, []);

  // Réaliser une requête vers notre serveur
  const getWeather = async (location) =>  {
    try {
      const response = await axios.get(API_URL(location.coords.latitude, location.coords.longitude));

      setData(response.data);
      setLoading(false);
    }
    catch (e) {
      console.log("Erreur dans getWeather");
    }
  }

  if (loading) {
    return <View style={styles.container}>
      <Text>Location est null</Text>
    </View>
  }

  return (
      <View style={styles.container}>
        <CurrentWeather data={data} />
        <Forecasts data={data} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E6E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
