import React from "react";
import { View, Platform, Image, StyleSheet, SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const CustomHeader = (props) => {
  const id = "zfhzuhf";

  return (
    <View style={[styles.container]}>
      <SafeAreaView style={[styles.logoContainer]}>
        <FontAwesome5
          name="airbnb"
          size={45}
          color="#ec5a62"
          key={id}
          {...props}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },

  logoContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
});

export default CustomHeader;
