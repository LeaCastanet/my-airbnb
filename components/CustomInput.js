import React from "react";
import { StyleSheet, TextInput } from "react-native";

function CustomInput({
  setFunction,
  keyboardType,
  secureTextEntry,
  placeholder,
  value,
  setNewInformations,
  setDisplayMessage,
  setIsInfosModified,
}) {
  return (
    <TextInput
      style={styles.textInput}
      keyboardType={keyboardType ? keyboardType : "default"}
      secureTextEntry={secureTextEntry ? true : false}
      placeholder={placeholder}
      autoCapitalize="none"
      textContentType="none"
      value={value && value}
      onChangeText={(text) => {
        setFunction(text);
        if (setNewInformations) {
          setNewInformations(true);
        }
        if (setDisplayMessage) {
          setDisplayMessage(false);
        }
        if (setIsInfosModified) {
          setIsInfosModified(true);
        }
      }}
    />
  );
}

export default CustomInput;

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#ec5a62",
    height: 40,
    marginBottom: 20,
    padding: 5,
  },
});
