import React from "react";
import { StyleSheet, TextInput } from "react-native";

function CustomLargeInput({
  setFunction,
  placeholder,
  value,
  setIsInfosModified,
}) {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      maxLength={250}
      multiline={true}
      numberOfLines={10}
      value={value}
      onChangeText={(text) => {
        setFunction(text);
        if (setIsInfosModified) {
          setIsInfosModified(true);
        }
      }}
    />
  );
}

export default CustomLargeInput;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#ec5a62",
    height: 80,
    padding: 5,
  },
});
