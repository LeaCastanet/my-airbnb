import { useNavigation } from "@react-navigation/core";
import { Entypo } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import {
  Button,
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [infoHome, setInfoHome] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        setInfoHome(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#ec5a62"
      style={{ marginTop: 100 }}
    />
  ) : (
    <SafeAreaView>
      <View style={[styles.container]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={infoHome}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            let rating = item.ratingValue;
            let stars = [];
            for (let i = 1; i <= 5; i++) {
              let path = (
                <Entypo name="star" size={24} color="orange" key={i} />
              );
              if (i > rating) {
                path = <Entypo name="star" size={24} color="#bbbbbb" key={i} />;
              }
              stars.push(path);
            }
            return (
              <TouchableOpacity
                style={[styles.offreContainer]}
                onPress={() => {
                  navigation.navigate("Room", { id: item._id });
                }}
              >
                <View>
                  <Image
                    style={{ width: "100%", height: 200 }}
                    source={{ uri: item.photos[0].url }}
                    key={item.photos[0].picture_id}
                  />
                  <View style={[styles.priceContainer]}>
                    <Text style={[styles.price]}>{item.price} €</Text>
                  </View>
                </View>

                <View style={[styles.descriptionContainer]}>
                  <View style={[styles.descriptionTextContainer]}>
                    <Text style={[styles.title]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={[styles.ratingContainer]}>
                      <View style={[styles.starsContainer]}>{stars}</View>
                      <Text style={[styles.reviews]}>
                        {item.reviews} reviews
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Image
                      style={[styles.imgProfile]}
                      source={{ uri: item.user.account.photo.url }}
                      key={item.user.account.photo.picture_id}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    paddingHorizontal: 20,
  },

  offreContainer: {
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    marginBottom: 10,
    marginTop: 10,
  },

  priceContainer: {
    position: "absolute",
    backgroundColor: "black",
    height: 60,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 130,
  },

  price: {
    color: "white",
    fontSize: 25,
  },

  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  descriptionTextContainer: {
    flex: 1,
  },

  imgProfile: {
    flex: 1,
    height: 80,
    width: 80,
    borderRadius: 50,
    marginLeft: 5,
  },

  title: {
    fontSize: 18,
    marginBottom: 15,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  starsContainer: {
    flexDirection: "row",
    marginRight: 5,
  },

  reviews: {
    color: "gray",
  },
});
