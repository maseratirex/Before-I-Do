import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LikertButton({ label, isPressed, onPress }) {
  return (
    <View testId={label} style={styles.container}>
      <TouchableOpacity style={[styles.radioButton, isPressed && styles.selectedRadioButton]} onPress={onPress}>
        {isPressed && <View style={styles.radioInner} />}
      </TouchableOpacity>
      <Text style={styles.radioLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // TODO How do I size each button the same
    // TODO How do I cause the text to wrap when it's too long?
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
