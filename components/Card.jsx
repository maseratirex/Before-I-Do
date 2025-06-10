import { View, StyleSheet } from 'react-native';

export default function Card({ children }) {
    return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: "83%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,
    elevation: 3,
  },
});
