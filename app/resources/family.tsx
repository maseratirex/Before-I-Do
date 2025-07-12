import PinkGradientContainer from "@/components/PinkGradientContainer";
import { Text, ScrollView, View } from "react-native";
import Card from "@/components/Card";
import Colors from "@/constants/colors";
import { useHeaderHeight } from '@react-navigation/elements';
import ExpandableButton from "@/components/ExpandableButton";

const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function FamilyScreen() {
    const headerHeight = useHeaderHeight();
    return (
        <PinkGradientContainer>
            <ScrollView style={{ width: "100%", flex: 1, }} contentContainerStyle={{ gap: 16, alignItems: "center", paddingTop: headerHeight, paddingBottom: TAB_BAR_HEIGHT + TAB_MARGIN_BOTTOM, }}>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Understanding Family Dynamics
                    </Text>
                    <Text style={{ color: Colors.textSecondary }}>
                        Family dynamics significantly shape how individuals perceive relationships, handle conflicts, and interact within partnerships. Recognizing how your respective family backgrounds influence your current relationship can empower you to create a healthy, fulfilling marriage.
                    </Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Key Areas of Personality Traits
                    </Text>
                    <ExpandableButton title="Family Closeness">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>Refers to the emotional bonds, support systems, and communication patterns experienced in one's family of origin.</Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Positive Signs</Text>
                            <Text style={{ color: Colors.textSecondary }}>Feeling emotionally supported by family, open lines of communication, healthy interdependence.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Warning Signs</Text>
                            <Text style={{ color: Colors.textSecondary }}>Enmeshment (excessive closeness), lack of emotional expression, emotional distance or neglect.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Implications</Text>
                            <Text style={{ color: Colors.textSecondary, }}>Partners from families with healthy closeness often bring a balanced sense of connection and autonomy into relationships. Those from disengaged or enmeshed families may struggle with trust, boundaries, or emotional sharing.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Reflect together on how family closeness shaped your emotional expectations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Create rituals in your relationship that foster emotional connection and safe sharing</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Practice establishing boundaries that honor your family while protecting your couple identiy</Text>
                        </View>
                    </ExpandableButton>
                    <ExpandableButton title="Parental Marital Relationship">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>Refers to how one's parents modeled marriage, including their levels of intimacy, communication, conflict resolution, and emotional availability.</Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Positive Signs</Text>
                            <Text style={{ color: Colors.textSecondary }}>Witnessing mutual respect, teamwork, healthy conflict resolution, and love between parents.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Warning Signs</Text>
                            <Text style={{ color: Colors.textSecondary }}>Exposure to high conflict, emotional neglect, avoidance, disrespect, or separation/divorce without healthy explanation.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Implications</Text>
                            <Text style={{ color: Colors.textSecondary, }}>The parental relationship serves as a subconscious blueprint for one’s own romantic behaviors and expectations. Negative experiences may result in fear of conflict, idealization of dysfunctional norms, or insecurity in close relationships.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Share narratives about your parents’ relationship and reflect on how they’ve shaped your views on love, roles, and expectations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Discuss what you want to emulate vs. change in your own marriages</Text>
                            <Text style={{ color: Colors.textSecondary }}>• If needed, seek therapeutic support to address unresolved emotional patterns linked to your parents’ relationship</Text>
                        </View>
                    </ExpandableButton>
                    <ExpandableButton title="Family Partner Relationships">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>It refers to how each partner's family interacts with and accepts their partner.</Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Positive Signs</Text>
                            <Text style={{ color: Colors.textSecondary }}>Mutual respect, acceptance, supportive in-laws, appropriate boundaries.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Warning Signs</Text>
                            <Text style={{ color: Colors.textSecondary }}>Hostility, favoritism, over-involvement or exclusion by one or both families.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Implications</Text>
                            <Text style={{ color: Colors.textSecondary, }}>Supportive relationships with in-laws strengthen emotional security and unity. Poor dynamics can lead to conflict, loyalty issues, or chronic tension.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Establish and maintain healthy boundaries between your family and your partner</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Encourage joint activities that build familiarity and trust between families</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Present a united front as a couple in interactions with extended family</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Use couple rituals (like debriefing after family visits) to manage stress and build resilience</Text>
                        </View>
                    </ExpandableButton>
                </Card>

                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        How Family Dynamics Influence Relationships
                    </Text>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Emotional Resolution</Text>
                        <Text style={{ color: Colors.textSecondary }}>Families teach us how to handle emotions—whether through open expression or suppression. If one partner learned to bottle emotions while the other grew up in a household of open dialogue, tension may arise unless these styles are addressed.</Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Attachment Style</Text>
                        <Text style={{ color: Colors.textSecondary }}>Secure or insecure attachment patterns often stem from early caregiving experiences. These patterns influence your level of trust, your reaction to distance or closeness, and how you seek reassurance or independence in a romantic relationship.</Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Conflict Patterns</Text>
                        <Text style={{ color: Colors.textSecondary }}>If your family handled conflict through avoidance, yelling, or silence, you may carry those patterns into your partnership. Recognizing and addressing inherited conflict styles helps prevent repeating unhealthy cycles.</Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Gender Roles and Power Structures</Text>
                        <Text style={{ color: Colors.textSecondary }}>Family influence can shape beliefs about roles and authority in a marriage. Clarifying and consciously redefining these expectations helps couples find a balance that works for both partners.</Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Sense of Belonging and Loyalty</Text>
                        <Text style={{ color: Colors.textSecondary }}>Individuals often feel torn between loyalty to their family of origin and loyalty to their partner. Navigating this tension with awareness prevents triangulation, guilt, or alienation.</Text>
                    </View>
                </Card>

                <Card>
                    <View style={{ gap: 16, }}>
                        <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                            Strategies for Navigating Family Dynamics
                        </Text>
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>Navigating family influences requires intentional communication, mutual support, and proactive boundary-setting. By gaining insight into each other’s family dynamics and intentionally shaping your shared future, you can foster a relationship grounded in awareness, mutual respect, and resilience.</Text>
                        <View style={{ gap: 16, }}>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Couple Dialogue Exercises
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Set aside time for structured conversations about your families. Use open-ended questions to explore: "What did love look like in your family growing up?" or "How did your parents manage conflict?" Aim to understand, not judge.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Boundary Mapping
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Draw or discuss a visual map of how involved different family members are in your life. Together, define what boundaries are needed and how you will communicate them clearly and respectfully.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Shared Rituals & Identity
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Develop couple-based traditions—like weekly check-ins or annual couple retreats—that affirm your bond and separate identity from your families of origin.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Unified Communication with Families
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    When addressing sensitive issues with relatives, plan and present your stance as a couple. This unified approach strengthens mutual trust and reduces triangulation.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Anticipate and Prepare for Family Events:
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Before family gatherings, agree on expectations, support signals, and exit strategies to manage tension as a team.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Professional Support
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Premarital or couples counseling provides a neutral space
                                    to address deep-rooted family dynamics, clarify values, and learn emotional coping
                                    tools.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </PinkGradientContainer>
    );
}
