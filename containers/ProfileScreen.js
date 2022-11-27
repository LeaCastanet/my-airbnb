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
  const [displayMessage, setDisplayMessage] = useState(null);

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
        // console.log(response.data);
        if (response.data.photo) {
          setPicture(response.data.photo.url);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        setDisplayMessage({
          message: "An error occurred",
          color: "error",
        });
      }
    };
    fetchData();
  }, []);

  const [picture, setPicture] = useState(null);
  const [isPictureModified, setIsPictureModified] = useState(false);
  const [isInfosModified, setIsInfosModified] = useState(false);

  const editInformations = async () => {
    setDisplayMessage(false);
    if (isPictureModified || isInfosModified) {
      setIsLoading(true);

      if (isPictureModified) {
        try {
          const uri = picture;
          const uriParts = uri.split(".");
          const fileType = uriParts[1];

          const formData = new FormData();
          formData.append("photo", {
            uri,
            name: `userPicture`,
            type: `image/${fileType}`,
          });

          const response = await axios.put(
            `https://express-airbnb-api.herokuapp.com/user/upload_picture`,
            formData,
            {
              headers: {
                authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (response.data) {
            setPicture(response.data.photo.url);
            setDisplayMessage({
              message: "Your profile has been updated",
              color: "success",
            });
          }
        } catch (error) {
          setDisplayMessage({
            message: error.response.data.error,
            color: "error",
          });
        }
      }

      if (isInfosModified) {
        try {
          const obj = {};
          obj.email = email;
          obj.username = userName;
          obj.description = description;
          const response = await axios.put(
            `https://express-airbnb-api.herokuapp.com/user/update`,
            obj,
            {
              headers: {
                authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (response.data) {
            setUserName(response.data.username);
            setEmail(response.data.email);
            setDescription(response.data.description);
            setDisplayMessage({
              message: "Your profile has been updated",
              color: "success",
            });
          } else {
            setDisplayMessage({
              message: "An error occurred",
              color: "error",
            });
          }
        } catch (error) {
          setDisplayMessage({
            message: error.response.data.error,
            color: "error",
          });
        }
      }

      isPictureModified && setIsPictureModified(false);
      isInfosModified && setIsInfosModified(false);
      setIsLoading(false);
      fetchData();
    } else {
      setDisplayMessage({
        message: "Change at least one information",
        color: "error",
      });
    }
  };

  const uploadPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        setPicture(result.assets[0].uri);
        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setDisplayMessage(false);
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        setPicture(result.assets[0].uri);
        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setDisplayMessage(false);
  };

  // const [selectedPicture, setSelectedPicture] = useState(null);

  // const getPermissionAndGetPicture = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status === "granted") {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //     });
  //     if (result.cancelled === true) {
  //       alert("Pas de photo sélectionnée");
  //     } else {
  //       setSelectedPicture(result.assets[0].uri);
  //     }
  //   } else {
  //     alert("Permission refusée");
  //   }
  // };

  // const getPermissionAndTakePicture = async () => {
  //   const { status } = await ImagePicker.requestCameraPermissionsAsync();
  //   if (status === "granted") {
  //     const result = await ImagePicker.launchCameraAsync();
  //     setSelectedPicture(result.assets[0].uri);
  //   } else {
  //     alert("Permission refusée");
  //   }
  // };

  // const sendPicture = async () => {
  //   setIsLoading(true);
  //   const tab = selectedPicture.split(".");
  //   try {
  //     const formData = new FormData();
  //     formData.append("photo", {
  //       uri: selectedPicture,
  //       name: `my-pic.${tab[1]}`,
  //       type: `image/${tab[1]}`,
  //     });
  //     const responsePicture = await axios.put(
  //       "https://express-airbnb-api.herokuapp.com/user/upload_picture",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           authorization: `Bearer ${userToken}`,
  //         },
  //       }
  //     );

  //     if (responsePicture.data) {
  //       setIsLoading(false);
  //       alert("Photo Envoyée !");
  //       console.log(responsePicture.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
            {picture ? (
              <Image
                source={{ uri: picture }}
                style={[styles.imgProfile]}
                resizeMode="cover"
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
              onPress={() => {
                uploadPicture();
              }}
            >
              <MaterialCommunityIcons
                name="image-multiple"
                size={24}
                color="#717171"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.icons]}
              onPress={() => {
                takePicture();
              }}
            >
              <FontAwesome name="camera" size={20} color="#717171" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            style={[styles.input]}
            value={infoUser.email}
            setFunction={setInfoUser}
            setDisplayMessage={setDisplayMessage}
            setIsInfosModified={setIsInfosModified}
          ></TextInput>
          <TextInput
            style={[styles.input]}
            value={infoUser.username}
            setFunction={setInfoUser}
            setDisplayMessage={setDisplayMessage}
            setIsInfosModified={setIsInfosModified}
          ></TextInput>
          <TextInput
            style={[styles.inputDescription]}
            value={infoUser.description}
            setFunction={setInfoUser}
            setDisplayMessage={setDisplayMessage}
            setIsInfosModified={setIsInfosModified}
            multiline={true}
            textAlignVertical="top"
          ></TextInput>
        </View>
        <View style={styles.view}>
          {displayMessage && (
            <Message
              message={displayMessage.message}
              color={displayMessage.color}
            />
          )}
        </View>
        <View style={[styles.buttonContainer]}>
          <TouchableOpacity
            style={[styles.buttonUpdate]}
            setFunction={editInformations}
          >
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
    alignItems: "center",
    justifyContent: "center",
  },

  imgProfile: {
    height: 160,
    width: 160,
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

  view: {
    height: 30,
  },
});
