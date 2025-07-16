import PinkGradientContainer from "@/components/PinkGradientContainer";
import { Text, ScrollView, View } from "react-native";
import Card from "@/components/Card";
import Colors from "@/constants/colors";
import { useHeaderHeight } from '@react-navigation/elements';
import ExpandableButton from "@/components/ExpandableButton";


const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function CultureScreen() {
    const headerHeight = useHeaderHeight();
    return (
        <PinkGradientContainer>
            <ScrollView style={{ width: "100%", flex: 1, }} contentContainerStyle={{ gap: 16, alignItems: "center", paddingTop: headerHeight, paddingBottom: TAB_BAR_HEIGHT + TAB_MARGIN_BOTTOM, }}>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Understanding Cultural Dynamics
                    </Text>
                    <Text style={{ color: Colors.textSecondary }}>
                        Cultural dynamics refer to the interplay of values, beliefs, traditions, and lifestyles
                        shaped by family, religion, education, and societal norms. For couples preparing for
                        marriage, navigating these dynamics with awareness and respect is essential. Cultural
                        similarities can provide comfort and familiarity, while cultural differences—if
                        unaddressed—can lead to misunderstandings or conflict. However, when approached
                        intentionally, they can become powerful assets in strengthening connection and resilience.
                    </Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        Key Areas of Cultural Dynamics
                    </Text>
                    <ExpandableButton title="Spiritual Beliefs">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>
                            The values, rituals, and personal faith systems that guide a person’s worldview
                            and moral compass.
                        </Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Relevance</Text>
                            <Text style={{ color: Colors.textSecondary, }}>
                                Shared or respectful coexistence of religious beliefs
                                enhances mutual understanding, especially when it comes to values, child-rearing,
                                family rituals, and holiday celebrations. Differences, if not navigated thoughtfully,
                                may cause tension between partners or with extended families.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Create safe, open spaces to talk about belief systems and their role in your life</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Define together what spiritual harmony looks like in daily practices and family
                                decisions</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Discuss expectations for raising children in terms of religion or spirituality</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Set clear boundaries and agreements for handling external family pressure or
                                disapproval</Text>
                        </View>
                    </ExpandableButton>
                    <ExpandableButton title="Marriage Preparations">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>
                            The decisions, negotiations, and customs surrounding wedding planning, gift
                            exchanges, financial contributions, and post-marriage arrangements.
                        </Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Relevance</Text>
                            <Text style={{ color: Colors.textSecondary, }}>
                                Relevance: Marriage preparations are often the first major joint project a
                                couple undertakes. They involve financial, logistical, and symbolic decisions that may
                                reflect broader family values and cultural norms. If unaddressed, they can bring up
                                loyalty conflicts, emotional stress, and couple tension.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Hold structured conversations about expectations regarding wedding gifts, living
                                arrangements, and expenses</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Involve both families in a way that respects their input but preserves couple
                                autonomy</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Anticipate potential family conflicts and strategize as a couple how to address them
                                calmly and respectfully</Text>
                            <Text style={{ color: Colors.textSecondary }}>• View wedding planning as a team effort rather than a cultural test—focus on the
                                meaning, not just the form</Text>
                        </View>
                    </ExpandableButton>
                    <ExpandableButton title="Lifestyle Compatibility">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>
                            The values, rituals, and personal faith systems that guide a person’s worldview
                            and moral compass.
                        </Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Relevance</Text>
                            <Text style={{ color: Colors.textSecondary, }}>
                                Lifestyle similarities can create ease and predictability in a
                                relationship, while differences can either enrich or complicate a couple’s shared life.
                                Unspoken lifestyle expectations—about work, leisure, goals, and social habits—can be
                                sources of hidden tension if not acknowledged. </Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Share stories about your typical day, your values, and long-term aspirations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Explore how political or ideological differences impact your decision-making or
                                communication</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Maintain mutual respect for differing preferences in hobbies, dress, or time use</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Focus on building a shared lifestyle that incorporates aspects of both partners’
                                identities</Text>
                        </View>
                    </ExpandableButton>
                    <ExpandableButton title="Traditions and Cultural Practices">
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>
                            Rituals, ceremonies, and customs—often family or community-based—that
                            reflect a couple’s cultural background and collective memory.
                        </Text>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Relationship Relevance</Text>
                            <Text style={{ color: Colors.textSecondary, }}>
                                Traditional rituals (e.g., engagement ceremonies, dowries,
                                and henna nights) are deeply meaningful and symbolic. However, if partners' or
                                families' expectations differ, they can also be a source of stress or disconnection.
                                Finding a respectful balance between these two cultural heritages is key.</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Growth Strategies</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Discuss with your partner which traditions are meaningful to you and why</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Plan cultural events together so that each family’s customs are respected and
                                integrated</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Set joint expectations early about what will or won’t be included in your wedding
                                preparations</Text>
                            <Text style={{ color: Colors.textSecondary }}>• Educate each other’s families in a respectful way about the other’s culture if
                                needed</Text>
                        </View>
                    </ExpandableButton>
                </Card>

                <Card>
                    <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                        How Cultural Dynamics Influence Relationships
                    </Text>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Values Alignment</Text>
                        <Text style={{ color: Colors.textSecondary }}>A shared or harmonized worldview helps couples make
                            decisions more cohesively. Clashing values—if not communicated—can create
                            underlying tension.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Family Involvement</Text>
                        <Text style={{ color: Colors.textSecondary }}>In many cultures, families play an active role in decisions.
                            Couples must balance honoring traditions while protecting their relationship
                            boundaries.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Communication Styles</Text>
                        <Text style={{ color: Colors.textSecondary }}>Culture influences how people express love,
                            disagreement, or apology. Understanding these nuances prevents
                            misinterpretation.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Social Perception</Text>
                        <Text style={{ color: Colors.textSecondary }}>Cultural expectations from the wider community (e.g., gender
                            roles, career paths, image) can influence how partners feel about themselves and
                            each other.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary, }}>Resilience Through Diversity</Text>
                        <Text style={{ color: Colors.textSecondary }}>When handled well, cultural differences become
                            sources of strength, flexibility, and mutual enrichment in long-term partnerships.
                        </Text>
                    </View>
                </Card>

                <Card>
                    <View style={{ gap: 16, }}>
                        <Text style={{ fontWeight: "bold", fontSize: 24, color: Colors.textPrimary }}>
                            Strategies for Navigating Cultural Dynamics
                        </Text>
                        <Text style={{ fontStyle: "italic", color: Colors.textSecondary, }}>
                            By treating cultural dynamics not as obstacles but as opportunities, couples can forge a
                            uniquely blended partnership—one rooted in shared respect, creativity, and resilience
                            across traditions.
                        </Text>
                        <View style={{ gap: 16, }}>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Build a Shared Cultural Identity
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Rather than choosing one culture over the
                                    other, define what "our culture" looks like. Integrate aspects of both heritages to
                                    form a cohesive identity.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Clarify Non-Negotiables
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Identify which beliefs or traditions are essential to each
                                    partner. Negotiate around what can be adapted, blended, or omitted.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Ritual Design Together
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Create or adapt rituals (e.g., holidays, anniversaries) that
                                    reflect shared values and respect both cultures.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Preempt Cultural Clashes
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Talk through potentially sensitive topics—child-rearing,
                                    family roles, finances—before they become urgent. Anticipate where culture may
                                    cause friction and address it with empathy.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Cultural Curiosity & Humility
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>Stay curious about each other’s backgrounds. Ask,
                                    listen, and learn without judgment. Cultural humility creates room for compassion
                                    and deeper connection.
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                    Involve Support Systems Thoughtfully
                                </Text>
                                <Text style={{ color: Colors.textSecondary }}>
                                    Consider counseling with professionals
                                    experienced in intercultural relationships. Engage family members in discussions
                                    where appropriate but always center the couple’s shared decisions.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </PinkGradientContainer>
    );
}
