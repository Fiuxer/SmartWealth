import MoneyText from "@/components/money-text";
import Panel from "@/components/panel";
import { Fonts, Styles } from "@/constants/theme";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";

export default function MainScreen() {
  const colorScheme = useColorScheme();

  /* Animación para picarle al button */
  const translateY = useRef(new Animated.Value(0)).current;
  const objOpacity = useRef(new Animated.Value(1)).current;
  const [isUp, setIsUp] = useState(false);

  return (
    <ScrollView style={[Styles.scrollview, { paddingTop: 200 }]}>
      <Animated.View
        style={{ transform: [{ translateY }], opacity: objOpacity }}
      >
        <Pressable onPress={toggleContent}>
          <Panel amount={670} />
        </Pressable>
      </Animated.View>
      <Animated.View>
        <MoneyText text="Hola" amount={10} />
        <MoneyText text="Adios" amount={20} />
        <MoneyText text="asdasda" amount={30} />
      </Animated.View>
    </ScrollView>
  );

  function toggleContent(): void {
    Animated.timing(translateY, {
      toValue: isUp ? 0 : -100,
      duration: 250,
      useNativeDriver: true,
    }).start();

    Animated.timing(objOpacity, {
      toValue: isUp ? 1 : 0.5,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setIsUp(!isUp);
  }
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 100,
    textAlign: "center",
    fontSize: 5 * 16,
    fontFamily: Fonts.primaryBold,
  },
});
