import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LikertButton({ label, isPressed, onPress }) {
    return (
        <View testId={label} style={styles.radioContainer}>
            <TouchableOpacity style={styles.radioButton} onPress={onPress}>
                {isPressed && <View style={styles.radioInner} />}
            </TouchableOpacity>
            <Text style={styles.radioLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  autoSaveText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4A4A4A',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 20, // After the auto save text, there will be a 20 gap
  },
  subsectionContainer: {
    // marginBottom: 20, // After the last card, there will be a 20 margin
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  subsectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 10,
  },
  questionContainer: { // Aka card
    width: '83%',
    marginBottom: 20, 
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: 'center'
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  radioContainer: {
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
