import { useRoute } from "@react-navigation/core";
import { Entypo } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useCallback } from "react";
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
    if (rating >= i) {
      stars.push(<Entypo name="star" size={24} color="orange" key={i} />);
    } else {
      stars.push(<Entypo name="star" size={24} color="#bbbbbb" key={i} />);
    }
  }

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 3); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#ec5a62"
      style={{ marginTop: 100 }}
    />
  ) : (
    <SafeAreaView>
      <ScrollView style={[styles.container]}>
        <Swiper
          style={styles.wrapper}
          dotColor="salmon"
          activeDotColor="red"
          autoplay
        >
          {infoRoom.photos.map((slide) => {
            return (
              <View style={styles.slide} key={slide.picture_id}>
                <Image
                  source={{ uri: slide.url }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            );
          })}
        </Swiper>

        <View style={[styles.priceContainer]}>
          <Text style={[styles.price]}>{infoRoom.price} €</Text>
        </View>

        <View style={[styles.infoContainer]}>
          <View style={[styles.infoTextContainer]}>
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
              key={infoRoom.user.account.photo.picture_id}
            />
          </View>
        </View>
        <View>
          <View style={[styles.descriptionContainer]}>
            <Text
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 3}
            >
              {infoRoom.description}
            </Text>
            {lengthMore ? (
              <Text
                onPress={toggleNumberOfLines}
                style={[styles.textDescription]}
              >
                {textShown ? "Show less ▲" : "Show more ▼"}
              </Text>
            ) : null}
          </View>
        </View>
        <MapView
          style={[styles.mapContainer]}
          initialRegion={{
            latitude: 48.856373,
            longitude: 2.353016,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            key={infoRoom._id}
            coordinate={{
              latitude: infoRoom.location[1],
              longitude: infoRoom.location[0],
            }}
          />
        </MapView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  },

  wrapper: {
    height: 250,
  },

  priceContainer: {
    position: "absolute",
    backgroundColor: "black",
    height: 60,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 175,
  },

  price: {
    color: "white",
    fontSize: 25,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
    paddingHorizontal: 10,
  },

  infoTextContainer: {
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

  descriptionContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  textDescription: {
    color: "gray",
    marginTop: 10,
  },

  slide: {
    height: 250,
  },

  mapContainer: {
    height: 235,
    width: "100%",
  },
});
