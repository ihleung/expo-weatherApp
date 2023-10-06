import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

function WeatherComponent() {
  const [data, setData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch(
      "http://api.weatherapi.com/v1/current.json?key=1e206a1519654771a20150206231909&q=Toronto"
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  //const icon = "https:" + data.current.condition.icon;
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Function to handle manual refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        data.current && (
          <SafeAreaView style={styles.tempArea}>
            <Text style={styles.cityName}>{data.location.name}</Text>
            <Text style={styles.tempText}>{data.current.temp_c}°C</Text>
            <Text>Humidity: {data.current.humidity}%</Text>
            <Text>UV Index: {data.current.uv}</Text>
            <Image
              style={styles.avatarImage}
              source={{ uri: "https:" + data.current.condition.icon }}
            />
          </SafeAreaView>
        )
      )}
    </ScrollView>
  );
}

export default WeatherComponent;

const styles = StyleSheet.create({
  avatarImage: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  tempText: {
    fontSize: 50,
  },
  cityName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  activityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tempArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
