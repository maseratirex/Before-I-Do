import PinkGradientContainer from "@/components/PinkGradientContainer";
import { Text, ScrollView } from "react-native";
import Card from "@/components/Card";
import Colors from "@/constants/colors";
import { useHeaderHeight } from '@react-navigation/elements';

const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function CoupleScreen() {
    const headerHeight = useHeaderHeight();
    return (
        <PinkGradientContainer>
            <ScrollView style={{ width: "100%", flex: 1, }} contentContainerStyle={{ gap: 16, alignItems: "center", paddingTop: headerHeight, paddingBottom: TAB_BAR_HEIGHT + TAB_MARGIN_BOTTOM, }}>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Couple screen in development
                    </Text>
                </Card>
            </ScrollView>
        </PinkGradientContainer>
    );
}
