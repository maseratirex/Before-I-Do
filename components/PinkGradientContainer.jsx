import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function PinkGradientContainer({ children }) {
  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.container}>
        {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
});
