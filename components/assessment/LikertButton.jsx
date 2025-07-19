import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LikertButton({ label, isPressed, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity testID={label} style={[styles.radioButton, isPressed && styles.selectedRadioButton]} onPress={onPress}>
        {isPressed && <View testID={label + " pressed"} style={styles.radioInner} />}
      </TouchableOpacity>
      <Text style={styles.radioLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1, // Ensures equal spacing for all options
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#777",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: "#5856ce",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#5856ce",
  },
  radioLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
});
