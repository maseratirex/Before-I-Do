import { Text, View } from "react-native";
import { useLocalSearchParams } from 'expo-router';

export default function Assessment2Screen() {
    const { name } = useLocalSearchParams();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Section {name}</Text>
        </View>
    );
}
