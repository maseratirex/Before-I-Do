import { Text, View } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import LikertScale from '@/components/LikertScale'
import { questionnaire } from "../../../components/questionnaire";

type SectionName = 'personality' | 'family' | 'couple' | 'cultural';

export default function Assessment2Screen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const section = name.toLowerCase() as SectionName;
    const questions = questionnaire[section];
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
