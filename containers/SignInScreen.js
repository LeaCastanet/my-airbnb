import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Button,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

export default function SignInScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <View style={[styles.container]}>
      <View style={[styles.logoContainer]}>
        <FontAwesome5 name="airbnb" size={100} color="#ec5a62" />
        <Text style={[styles.textSignIn]}>Sign In</Text>
      </View>
      <View style={[styles.inputContainer]}>
        <View style={[styles.inputContainerHaut]}>
          <TextInput
            placeholder="email"
            style={[styles.input]}
            onChangeText={(textEmail) => {
              setEmail(textEmail);
            }}
            value={email}
            autoCapitalize="none"
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
                    "https://express-airbnb-api.herokuapp.com/user/log_in",
                    { email: email, password: password }
                  );
                  if (response.data.token && response.data.id) {
                    const userToken = response.data.token;
                    const userId = response.data.id;
                    // console.log(response.data.token);
                    // console.log(response.data.id);
                    setToken(userToken);
                    setId(userId);
                  }
                  alert("Successful connection");
                } catch (error) {
                  if (error.response?.data.error === "Missing parameter(s)") {
                    setErrorMessage("Please fill all fields");
                  } else if (error.response?.data.error === "Unauthorized") {
                    setErrorMessage("Incorrect email or password");
                  }
                }
              }}
            >
              <Text style={[styles.textButton]}>Sign In</Text>
            </Pressable>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={[styles.textUnderButton]}>No acount? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    flex: 1,
  },

  textSignIn: {
    marginTop: 10,
    fontSize: 25,
    color: "#737373",
    fontWeight: "bold",
  },

  inputContainer: {
    flex: 1,
  },

  inputContainerHaut: {
    flex: 1,
  },

  inputContainerBas: {
    flex: 1,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ec5a62",
    height: 40,
    marginBottom: 10,
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
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
