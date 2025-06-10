import { Text, View, ScrollView } from "react-native";
import Card from "@/components/Card";
import PinkGradientContainer from "@/components/PinkGradientContainer";
import ExpandableButton from "@/components/ExpandableButton";
import Colors from "@/constants/colors";
import { useHeaderHeight } from '@react-navigation/elements';

const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function PersonalityScreen() {
  const headerHeight = useHeaderHeight();
  return (
    <PinkGradientContainer>
      <ScrollView style={{ width: "100%", flex: 1, }} contentContainerStyle={{ gap: 16, alignItems: "center", paddingTop: headerHeight, paddingBottom: TAB_BAR_HEIGHT + TAB_MARGIN_BOTTOM, }}>
        <Card>
          <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
            Understanding Personality Traits
          </Text>
          <Text style={{ color: Colors.textSecondary }}>
            Personality dynamics refer to the stable individual characteristics that influence how people think, feel, and behave in their relationships. In the context of pre-marital relationships, awareness of each partner’s personality traits fosters mutual understanding, encourages emotional growth, and helps couples build stronger, more resilient connections.
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
            Key Areas of Personality Traits
          </Text>
          <ExpandableButton title="Emotional Stability">
            <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>The ability to remain calm and balanced, especially in the face of stress or emotional adversity.</Text>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Traits Reflected</Text>
              <Text style={{ color: Colors.textSecondary }}>• Positive mood</Text>
              <Text style={{ color: Colors.textSecondary }}>• Emotional self-regulation</Text>
              <Text style={{ color: Colors.textSecondary }}>• Stress resilience</Text>
              <Text style={{ color: Colors.textSecondary }}>• Flexibility and adaptability</Text>
              <Text style={{ color: Colors.textSecondary }}>• Low general anxiety</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Relevance</Text>
              <Text style={{ color: Colors.textSecondary, }}>Emotionally stable individuals bring predictability, calmness, and patience into relationships. They help defuse conflict, adapt to change without becoming overwhelmed, and support their partners during difficult times.</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
              <Text style={{ color: Colors.textSecondary }}>• Practice mindfulness and grounding techniques</Text>
              <Text style={{ color: Colors.textSecondary }}>• Emotional self-regulation</Text>
              <Text style={{ color: Colors.textSecondary }}>• Recognize stress triggers and discuss them proactively with your partner</Text>
              <Text style={{ color: Colors.textSecondary }}>• Encourage mutual emotional support rituals (e.g., comfort talks, stress debriefs)</Text>
            </View>
          </ExpandableButton>
          <ExpandableButton title="Openness to Experience">
            <Text>Wassup</Text>
          </ExpandableButton>
        </Card>

        <Card>
          <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
            How Personality Traits Influence Relationships
          </Text>
          <View>
            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Conflict Resolution</Text>
            <Text style={{ color: Colors.textSecondary }}>Emotional stability and empathy determine how partners handle disagreements—whether they escalate or de-escalate, seek solutions or blame.</Text>
          </View>
          <View>
            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Intimacy and Communication</Text>
            <Text style={{ color: Colors.textSecondary }}>Openness and secure attachment foster deeper emotional and physical intimacy. Couples can be vulnerable, ask for what they need, and share joyfully.</Text>
          </View>
          <View>
            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Resilience</Text>
            <Text style={{ color: Colors.textSecondary }}>High self-confidence and adaptability contribute to better coping with life stressors, transitions, and uncertainty.</Text>
          </View>
          <View>
            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth as a Couple</Text>
            <Text style={{ color: Colors.textSecondary }}>Openness and empathy drive curiosity about each other, paving the way for lifelong discovery and growth.</Text>
          </View>
        </Card>

        <Card>
          <View style={{ gap: 16, }}>
          <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
            Strategies for Compatibility
          </Text>
          <View style={{ gap: 16, }}>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                Develop a Strengths-Based Understanding
              </Text>
              <Text style={{ color: Colors.textSecondary }}>
                Personality shapes how partners think, feel, and act within the relationship
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                Trait-Informed Communication
              </Text>
              <Text style={{ color: Colors.textSecondary }}>
                Acknowledge personality tendencies when expressing needs. For example, “I know I’m less emotionally expressive than you, but I care deeply and want to show it more.”
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                Support Trait Development
              </Text>
              <Text style={{ color: Colors.textSecondary }}>
                Encourage growth in areas like emotional regulation or confidence with patience—not pressure.
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                Shared Learning Experiences
              </Text>
              <Text style={{ color: Colors.textSecondary }}>
                Read about personality psychology together or take relationship courses to deepen your understanding.
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                Use Personality as a Planning Tool
              </Text>
              <Text style={{ color: Colors.textSecondary }}>
                Design routines, vacations, or decision-making processes with your differing traits in mind (e.g., a spontaneous weekend vs. structured itinerary).
              </Text>
            </View>
          </View>
          </View>
        </Card>
      </ScrollView>
    </PinkGradientContainer>
  );
}
