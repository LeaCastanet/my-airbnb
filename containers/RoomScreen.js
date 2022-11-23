import { useRoute } from "@react-navigation/core";
import { Entypo } from "@expo/vector-icons";
import { SwiperFlatList } from "react-native-swiper-flatlist";
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
import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomScreen() {
  const route = useRoute();

  const navigation = useNavigation();

  const [infoRoom, setInfoRoom] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const id = route.params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`
        );
        setInfoRoom(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  let rating = infoRoom.ratingValue;
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    let path = <Entypo name="star" size={24} color="orange" />;
    if (i > rating) {
      path = <Entypo name="star" size={24} color="#bbbbbb" />;
    }
    stars.push(path);
  }

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
          data={infoRoom.photos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={[styles.imgWrap]}>
                  <Image
                    style={{ width: "100%", height: 200 }}
                    source={{ uri: item.url }}
                  />
                  <View style={[styles.priceContainer]}>
                    <Text style={[styles.price]}>{infoRoom.price} €</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
        <View style={[styles.descriptionContainer]}>
          <View style={[styles.descriptionTextContainer]}>
            <Text style={[styles.title]} numberOfLines={1}>
              {infoRoom.title}
            </Text>
            <View style={[styles.ratingContainer]}>
              <View style={[styles.starsContainer]}>{stars}</View>
              <Text style={[styles.reviews]}>{infoRoom.reviews} reviews</Text>
            </View>
          </View>
          <View>
            <Image
              style={[styles.imgProfile]}
              source={{ uri: infoRoom.user.account.photo.url }}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity>
            <Text numberOfLines={3}>{infoRoom.description}</Text>
          </TouchableOpacity>
        </View>
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

  imgWrap: {
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
  },
});
