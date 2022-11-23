import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function AroundMeScreen() {
  const { params } = useRoute();
  return (
    <View>
      <Text>Je suis le screnn around me</Text>
    </View>
  );
}
