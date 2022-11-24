import { useRoute } from "@react-navigation/core";
import { Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";

export default function AroundMeScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState();

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        const position = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoords(position);
      } else {
        setError(true);
      }
      setIsLoading(false);
    };
    askPermission();
  }, []);

  const [dataLocation, setDataLocation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms/around"
        );
        setDataLocation(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  let markers = [];

  dataLocation.map((info) => {
    markers.push({
      id: info._id,
      title: info.title,
      description: info.description,
      location: info.location,
    });
  });

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#ec5a62"
      style={{ marginTop: 100 }}
    />
  ) : error ? (
    <Text>Permission refusée</Text>
  ) : (
    <MapView
      style={[styles.mapContainer]}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
    >
      {markers.map((marker) => {
        return (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.location[1],
              longitude: marker.location[0],
            }}
            onPress={() => {
              navigation.navigate("Room", { id: marker.id });
            }}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: "100%",
    width: "100%",
  },
});
