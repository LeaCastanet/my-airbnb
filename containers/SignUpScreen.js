import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

export default function SignUpScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <KeyboardAwareScrollView style={[styles.container]}>
      <SafeAreaView>
        <View style={[styles.logoContainer]}>
          <FontAwesome5 name="airbnb" size={100} color="#ec5a62" />
          <Text style={[styles.textSignIn]}>Sign Up</Text>
        </View>
        <View style={[styles.inputContainer]}>
          <View style={[styles.inputContainerHaut]}>
            <TextInput
              placeholder="Email"
              style={[styles.input]}
              onChangeText={(textEmail) => {
                setEmail(textEmail);
              }}
              value={email}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Username"
              style={[styles.input]}
              onChangeText={(textUsername) => {
                setUsername(textUsername);
              }}
              value={username}
            />
            <TextInput
              placeholder="Describe yourself in a few words"
              style={[styles.inputDescription]}
              multiline={true}
              textAlignVertical="top"
              onChangeText={(textDescription) => {
                setDescription(textDescription);
              }}
              value={description}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={[styles.input]}
              onChangeText={(textPassword) => {
                setPassword(textPassword);
              }}
              value={password}
            />
            <TextInput
              placeholder="Confirm password"
              secureTextEntry={true}
              style={[styles.input]}
              onChangeText={(textconfirmPassword) => {
                setConfirmPassword(textconfirmPassword);
              }}
              value={confirmPassword}
            />
          </View>
          <View style={[styles.inputContainerBas]}>
            <View style={[styles.buttonContainer]}>
              <Text style={[styles.errorMessage]}>{errorMessage}</Text>
              <Pressable
                style={[styles.button]}
                onPress={async () => {
                  setErrorMessage("");

                  try {
                    const response = await axios.post(
                      "https://express-airbnb-api.herokuapp.com/user/sign_up",
                      {
                        email: email,
                        username: username,
                        description: description,
                        password: password,
                      }
                    );
                    if (response.data.token && response.data.id) {
                      const userToken = response.data.token;
                      const userId = response.data.id;
                      setToken(userToken);
                      setId(userId);
                    }
                    alert("Successful registration");
                  } catch (error) {
                    if (confirmPassword !== password) {
                      setErrorMessage("Your two passwords are not identical");
                    } else if (
                      error.response?.data.error === "Missing parameters"
                    ) {
                      setErrorMessage("Please fill all fields");
                    } else if (
                      error.response?.data.error ===
                      "This email already has an account."
                    ) {
                      setErrorMessage("This email already has an account");
                    } else if (
                      error.response?.data.error ===
                      "This username already has an account."
                    ) {
                      setErrorMessage("This username already has an account.");
                    }
                  }
                }}
              >
                <Text style={[styles.textButton]}>Sign Up</Text>
              </Pressable>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={[styles.textUnderButton]}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },

  textSignIn: {
    marginTop: 10,
    fontSize: 25,
    color: "#737373",
    fontWeight: "bold",
  },

  inputContainer: {
    flex: 2,
  },

  inputContainerHaut: {
    flex: 2,
  },

  inputContainerBas: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },

  button: {
    backgroundColor: "white",
    borderColor: "#ec5a62",
    borderWidth: 3,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    borderRadius: 50,
  },

  textButton: {
    color: "#737373",
    fontWeight: "bold",
    fontSize: 17,
  },

  textUnderButton: {
    marginTop: 20,
    textAlign: "center",
    color: "#737373",
  },

  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});
