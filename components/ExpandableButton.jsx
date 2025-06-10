import { Text, View, TouchableOpacity, Alert } from "react-native";
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

export default function ExpandableButton({ title, children }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <TouchableOpacity
            onPress={toggleExpanded}
            style={{ paddingBottom: 16 }}
            activeOpacity={1} // Prevents the button from turning gray when held down
        >
            <View
                style={{ 
                    marginBottom: 16,
                    borderBottomColor: Colors.textSecondary,
                    borderBottomWidth: 1,
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                    {title}
                </Text>
                <Ionicons
                    name={isExpanded ? "chevron-down-sharp" : "chevron-forward-sharp"}
                    size={20}
                    color={Colors.primary}
                />
            </View>
            {isExpanded && <View style={{ gap: 16, }}>{children}</View>}
        </TouchableOpacity>
    );
}
