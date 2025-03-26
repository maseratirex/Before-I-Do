import { Text, View } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import LikertScale from '@/components/LikertScale'

export default function Assessment2Screen() {
    const { name } = useLocalSearchParams();
    // May need to convert "name" to lowercase
    // Example questions and answers. Should actually be based on "name"
    const questions = [
        "I feel comfortable using this app.",
        "The app's layout is intuitive.",
        "I would recommend this app to others.",
        "This app meets my needs."
    ];
    const answers = "0".repeat(questions.length);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Section {name}</Text>
            <Text>{answers}</Text>
            <LikertScale questions={questions} answers={answers} />
        </View>
    );
}
