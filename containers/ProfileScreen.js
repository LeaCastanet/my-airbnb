import { useRoute } from "@react-navigation/core";
import { ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import imgProfileDefault from "../assets/imgProfileDefault.png";

export default function ProfileScreen({ setToken, setId, userId, userToken }) {
  const [infoUser, setInfoUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              authorization: `Bearer ${userToken}`,
            },
          }
        );
        setInfoUser(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const [selectedPicture, setSelectedPicture] = useState(null);

  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.cancelled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      setSelectedPicture(result.assets[0].uri);
    } else {
      alert("Permission refusée");
    }
  };

  const sendPicture = async () => {
    setIsLoading(true);
    const tab = selectedPicture.split(".");
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: selectedPicture,
        name: `my-pic.${tab[1]}`,
        type: `image/${tab[1]}`,
      });
      const responsePicture = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (responsePicture.data) {
        setIsLoading(false);
        alert("Photo Envoyée !");
        console.log(responsePicture.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#ec5a62"
      style={{ marginTop: 100 }}
    />
  ) : (
    <View style={[styles.container]}>
      <>
        <View style={[styles.pictureContainer]}>
          <View style={[styles.imgProfileContainer]}>
            {selectedPicture ? (
              <Image
                source={{ uri: selectedPicture }}
                style={[styles.imgProfile]}
                resizeMode="contain"
              ></Image>
            ) : (
              <Image
                source={imgProfileDefault}
                style={[styles.imgProfile]}
                resizeMode="contain"
              ></Image>
            )}
          </View>
          <View style={[styles.iconsContainer]}>
            <TouchableOpacity
              style={[styles.icons]}
              onPress={getPermissionAndGetPicture}
            >
              <MaterialCommunityIcons
                name="image-multiple"
                size={24}
                color="#717171"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.icons]}
              onPress={getPermissionAndTakePicture}
            >
              <FontAwesome name="camera" size={20} color="#717171" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput style={[styles.input]} value={infoUser.email}></TextInput>
          <TextInput
            style={[styles.input]}
            value={infoUser.username}
          ></TextInput>
          <TextInput
            style={[styles.inputDescription]}
            value={infoUser.description}
            multiline={true}
            textAlignVertical="top"
          ></TextInput>
        </View>
        <View style={[styles.buttonContainer]}>
          <TouchableOpacity style={[styles.buttonUpdate]} onPress={sendPicture}>
            <Text style={[styles.textButton]}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonLogOut]}
            onPress={() => {
              setToken(null);
              setId(null);
            }}
          >
            <Text style={[styles.textButton]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    paddingHorizontal: 20,
  },

  pictureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 40,
  },

  imgProfileContainer: {
    height: 170,
    width: 170,
    borderRadius: "100%",
    borderWidth: 1,
    borderColor: "#ec5a62",
  },

  imgProfile: {
    height: 170,
    width: 170,
    borderRadius: "100%",
  },

  icons: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ec5a62",
    height: 40,
    marginBottom: 20,
  },

  inputDescription: {
    borderWidth: 1,
    borderColor: "#ec5a62",
    height: 80,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 5,
  },

  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonUpdate: {
    borderWidth: 3,
    borderColor: "#ec5a62",
    height: 60,
    width: 200,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonLogOut: {
    borderWidth: 3,
    borderColor: "#ec5a62",
    height: 60,
    width: 200,
    borderRadius: 30,
    backgroundColor: "#e7e7e7",
    justifyContent: "center",
    alignItems: "center",
  },

  textButton: {
    fontWeight: "bold",
    color: "#717171",
  },
});
