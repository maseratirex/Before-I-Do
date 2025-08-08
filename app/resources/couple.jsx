import PinkGradientContainer from "@/components/PinkGradientContainer";
import { Text, ScrollView, View } from "react-native";
import Card from "@/components/Card";
import Colors from "@/constants/colors";
import { useHeaderHeight } from '@react-navigation/elements';
import ExpandableButton from "@/components/ExpandableButton";


const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function CoupleScreen() {
    const headerHeight = useHeaderHeight();
    return (
        <PinkGradientContainer>
            <ScrollView style={{ width: "100%", flex: 1, }} contentContainerStyle={{ gap: 16, alignItems: "center", paddingTop: headerHeight, paddingBottom: TAB_BAR_HEIGHT + TAB_MARGIN_BOTTOM, }}>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Understanding Relationship Dynamics
                    </Text>
                    <Text style={{ color: Colors.textSecondary }}>
                        The dynamics between partners form the heartbeat of a relationship. They shape how
                        couples navigate communication, intimacy, conflict, decision-making, and shared
                        responsibilities. In pre-marital relationships, developing awareness of both strengths
                        and challenges in your dynamic helps build a resilient and mutually satisfying marriage.
                    </Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Key Areas of Relationship Dynamics
                    </Text>
                    <ExpandableButton title="Harmony and Cooperation">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>This dimension includes factors that promote a strong, mutually supportive
                            relationship. It reflects emotional connection, effective communication, shared
                            responsibilities, and mutual respect.</Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Key Themes & Expectations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Open and honest communication</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Shared values and mutual respect</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Joint decision-making and cooperation</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Emotional and sexual intimacy</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Work-life balance and mutual support</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Loyalty, trust, and long-term planning</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Set weekly or monthly couple check-ins to align on emotional needs, shared goals,
                                and practical matters</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Alternate leadership in responsibilities such as budgeting, trip planning, or
                                parenting</Text>
                            <Text style={{ color: Colors.textSecondary }}>•Use "we" language to reinforce unity (e.g., “our goals,” “our time,” “our decisions”)</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Schedule regular quality time that nurtures intimacy and connection, even in busy
                                seasons</Text>
                        </View>
                    </ExpandableButton>
                    <ExpandableButton title="Relationship Challenges">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>This dimension includes relational stressors or risks that may impact
                            relationship satisfaction or stability. Recognizing and addressing these early can
                            prevent long-term conflict.</Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Key Themes & Expectations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Key Themes & Expectations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Communication breakdowns and criticism</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Power imbalance or lack of compromise</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Mismatched intimacy or sexual expectations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Parenting disagreements</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Financial tensions and career conflicts</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Use active listening and emotional regulation techniques during conflicts. Validate
                                each other's experiences</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Develop conflict "ground rules"—no name-calling, taking turns speaking, pausing
                                when overwhelmed</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Attend premarital workshops or couple therapy to navigate sensitive issues like
                                finances, sex, or family</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Make values-based decisions together, especially around children, finances, and
                                lifestyle</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Accept that challenges are not signs of failure but opportunities to grow in empathy, patience, and creativity</Text>
                        </View>
                    </ExpandableButton>
                </Card>

                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        How Relationship Dynamics Influence Relationships
                    </Text>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Emotional Security</Text>
                        <Text style={{ color: Colors.textSecondary }}>A relationship characterized by harmony and cooperation
                            builds a secure base for both partners. It allows each individual to feel safe, seen,
                            and supported.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Conflict Recovery</Text>
                        <Text style={{ color: Colors.textSecondary }}>How you fight is often more important than how often you fight.
                            Couples who express criticism, defensiveness, or contempt are more likely to
                            erode trust over time. Couples with healthy dynamics learn to repair ruptures
                            quickly and respectfully.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Shared Identiy and Purpose</Text>
                        <Text style={{ color: Colors.textSecondary }}>Harmony in a couple’s dynamic allows for the
                            formation of a “we” identity. This shared narrative supports joint goals, resilience
                            through stress, and a greater sense of partnership.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Sexual and Emotional Intimacy</Text>
                        <Text style={{ color: Colors.textSecondary }}>Intimacy: Openness, loyalty, and mutual respect create
                            fertile ground for physical closeness and emotional depth. Avoidant patterns,
                            suspicion, or withdrawal—left unchecked—can lead to detachment.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Parental and Financial Collaboration</Text>
                        <Text style={{ color: Colors.textSecondary }}>Relationship dynamics extend into
                            parenting and financial decisions. Couples with equal power, mutual respect, and
                            aligned values tend to make collaborative and satisfying life choices.
                        </Text>
                    </View>
                </Card>

                <Card>
                    <View style={{ gap: 16, }}>
                        <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                            Strategies for Navigating Relationship Dynamics
                        </Text>
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>
                            Creating and sustaining healthy couple dynamics requires both self-awareness
                            and shared intentionality. By actively attending to your couple dynamics, you lay the foundation for a joyful,
                            resilient, and deeply connected marriage. Harmony is not the absence of conflict—but
                            the presence of mutual care, respect, and growth-oriented commitment.
                        </Text>
                        <View style={{ gap: 16, }}>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Construct a Couple Mission Statement
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Outline your shared values, what kind of
                                    couple you want to be, and how you’ll navigate challenges together. Revisit and
                                    revise it annually.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Daily Connection Rituals
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Whether it’s a morning coffee together or a five-minute
                                    check-in at bedtime, simple rituals maintain emotional connection.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Normalize Emotional Check-ins
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Ask each other, “How are we doing lately?”
                                    “What do you need from me this week?” or “Is there anything we’ve been avoiding
                                    that we should talk about?”
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Develop Repair Strategies
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Learn how to apologize sincerely, listen without
                                    defensiveness, and show empathy after conflict. Practice re-connection rituals
                                    (e.g., hugging, sharing a positive memory) after a disagreement.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Strengthen Your Intimacy Toolbox
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Toolbox: Read or take courses on sexual
                                    communication, physical affection, and meeting one another’s emotional needs.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Create a Balanced Responsibility System
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Write out all household, financial,
                                    parenting, and emotional labor tasks. Discuss whether the distribution feels fair and
                                    renegotiate roles when needed.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Conflict Management Frameworks
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Use structured tools like the "Gottman-
                                    Rapoport Intervention" or "Nonviolent Communication" to de-escalate and resolve
                                    disagreements.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </PinkGradientContainer>
    );
}
