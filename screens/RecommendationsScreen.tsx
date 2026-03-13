import { ArrowLeft, ArrowRight, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme';
import { AnalysisData, ScreenType, UpcycleIdea } from '../types';

interface Props {
    onNavigate: (screen: ScreenType) => void;
    analysisData: AnalysisData | null;
    scannedImage: string | null;
    onSelectIdea: (idea: UpcycleIdea) => void;
}

export default function RecommendationsScreen({ onNavigate, analysisData, scannedImage, onSelectIdea }: Props) {
    const [activeFilter, setActiveFilter] = useState("All");

    const defaultIdeas: UpcycleIdea[] = [
        {
            id: 'g1',
            title: 'Self-Watering Planter',
            description: 'Turn a plastic bottle into a clever self-watering system for your herbs.',
            difficulty: 'Beginner',
            previewImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400',
            estimatedTime: '15 mins',
            materials: ['Plastic Bottle', 'Cotton String', 'Potting Soil', 'Small Plant'],
            steps: [
                { stepNumber: 1, instruction: 'Cut the bottle in half carefully using scissors or a craft knife.', imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 2, instruction: 'Poke a small hole in the center of the bottle cap.', imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 3, instruction: 'Thread a thick cotton string through the hole to act as a wick.', imageUrl: 'https://images.unsplash.com/photo-1544816153-199d88248300?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 4, instruction: 'Invert the top half into the bottom half. Fill the top with soil and the bottom with water.', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400' }
            ]
        },
        {
            id: 'g2',
            title: 'Glass Jar Terrarium',
            description: 'Create a miniature ecosystem inside an old jam or pickle jar.',
            difficulty: 'Intermediate',
            previewImage: 'https://images.unsplash.com/photo-1446064448824-78381ad88020?auto=format&fit=crop&q=80&w=400',
            estimatedTime: '30 mins',
            materials: ['Glass Jar', 'Pebbles', 'Activated Charcoal', 'Moss', 'Small Plants'],
            steps: [
                { stepNumber: 1, instruction: 'Add a 1-inch layer of pebbles at the bottom for drainage.', imageUrl: 'https://images.unsplash.com/photo-1520302660447-340ad169718d?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 2, instruction: 'Add a thin layer of activated charcoal to keep the water fresh.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 3, instruction: 'Add potting soil and carefully plant your moss and small greenery.', imageUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=400' }
            ]
        },
        {
            id: 'g3',
            title: 'Cardboard Organizer',
            description: 'Transform shipping boxes into stylish desk or drawer organizers.',
            difficulty: 'Beginner',
            previewImage: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=400',
            estimatedTime: '20 mins',
            materials: ['Cardboard Boxes', 'Scissors', 'Glue', 'Decorative Paper'],
            steps: [
                { stepNumber: 1, instruction: 'Cut the boxes to your desired height based on what you want to store.', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 2, instruction: 'Wrap each box with decorative paper or fabric for a clean look.', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 3, instruction: 'Glue the boxes together in a grid pattern to create your organizer.', imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=400' }
            ]
        },
        {
            id: 'g4',
            title: 'T-Shirt Tote Bag',
            description: 'No-sew way to turn an old favorite shirt into a reusable shopping bag.',
            difficulty: 'Beginner',
            previewImage: 'https://images.unsplash.com/photo-1544816153-199d88248300?auto=format&fit=crop&q=80&w=400',
            estimatedTime: '10 mins',
            materials: ['Old T-Shirt', 'Sharp Scissors'],
            steps: [
                { stepNumber: 1, instruction: 'Lay the shirt flat and cut off the sleeves, leaving the seams intact.', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 2, instruction: 'Cut out the neckline to create the opening of the bag.', imageUrl: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 3, instruction: 'Cut fringe at the bottom and tie the front and back pieces together to close the bag.', imageUrl: 'https://images.unsplash.com/photo-1544816153-199d88248300?auto=format&fit=crop&q=80&w=400' }
            ]
        },
        {
            id: 'g5',
            title: 'Wine Cork Bath Mat',
            description: 'A non-slip, absorbent mat made from recycled wine corks.',
            difficulty: 'Advanced',
            previewImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=400',
            estimatedTime: '2 hours',
            materials: ['150+ Wine Corks', 'Hot Glue Gun', 'Non-slip Shelf Liner'],
            steps: [
                { stepNumber: 1, instruction: 'Cut all corks in half lengthwise using a sharp craft knife.', imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 2, instruction: 'Arrange the cork halves in a grid or pattern on the non-slip liner.', imageUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=400' },
                { stepNumber: 3, instruction: 'Glue each cork piece down firmly using a hot glue gun.', imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=400' }
            ]
        }
    ];

    const ideas = analysisData
        ? [...analysisData.ideas, ...defaultIdeas.filter(di => !analysisData.ideas.some(ai => ai.title === di.title))]
        : defaultIdeas;
    const materialType = analysisData?.materialType || "Materials";

    const filters = ["All", "Upcycle", "Recycle", "Beginner", "Intermediate"];
    const filteredIdeas = activeFilter === "All"
        ? ideas
        : ideas.filter(idea =>
            idea.difficulty === activeFilter ||
            (activeFilter === "Upcycle" && idea.steps.length > 0) ||
            (activeFilter === "Recycle" && idea.steps.length === 0)
        );

    return (
        <View style={styles.container}>

            {/* Header (Sticky) */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Pressable
                        onPress={() => onNavigate(analysisData ? 'analysis' : 'home')}
                        style={({ pressed }) => [
                            styles.backBtn,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                    >
                        <ArrowLeft size={20} color="#374151" />
                    </Pressable>
                    <View>
                        <Text style={styles.headerTitle}>Upcycling Ideas</Text>
                        <Text style={styles.headerSubtitle}>For {materialType}</Text>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Filters */}
                <View style={styles.filtersWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                        {filters.map((filter) => (
                            <Pressable
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter ? styles.filterChipActive : styles.filterChipInactive
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    activeFilter === filter ? styles.filterTextActive : styles.filterTextInactive
                                ]}>
                                    {filter}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Transformation Potential */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.transformCard}>
                    <View style={styles.transformCardHeader}>
                        <Zap size={14} color="#f59e0b" />
                        <Text style={styles.transformCardTitle}>TRANSFORMATION POTENTIAL</Text>
                    </View>

                    <View style={styles.transformRow}>
                        {/* Original Image */}
                        <View style={styles.transformCol}>
                            <View style={styles.originalImageWrapper}>
                                <Image
                                    source={{ uri: scannedImage || "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=200" }}
                                    style={[styles.transformImage, { opacity: 0.8 }]}
                                // Note: React Native Image doesn't support grayscale easily without external libraries, 
                                // so we omit grayscale filter here and rely on opacity.
                                />
                            </View>
                            <Text style={styles.transformLabel}>ORIGINAL</Text>
                        </View>

                        {/* Arrow Overlay */}
                        <View style={styles.arrowOverlay}>
                            <ArrowRight size={16} color="#9ca3af" />
                        </View>

                        {/* Upcycled Image */}
                        <View style={styles.transformCol}>
                            <View style={styles.upcycledImageWrapper}>
                                <Image
                                    source={{ uri: ideas[0]?.previewImage || "https://images.unsplash.com/photo-1416879598555-33e6f66b0eb5?auto=format&fit=crop&q=80&w=200" }}
                                    style={styles.transformImage}
                                />
                            </View>
                            <Text style={[styles.transformLabel, { color: theme.colors.ecoPrimary }]}>UPCYCLED</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Recommended Projects List */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.listSection}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>Recommended Projects</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{filteredIdeas.length} IDEAS</Text>
                        </View>
                    </View>

                    <View style={styles.cardsContainer}>
                        {filteredIdeas.length > 0 ? (
                            filteredIdeas.map((idea, index) => (
                                <Animated.View key={idea.id} entering={FadeIn.delay(200 + index * 100)}>
                                    <IdeaCard
                                        idea={idea}
                                        onPress={() => {
                                            onSelectIdea(idea);
                                            onNavigate('tutorial');
                                        }}
                                    />
                                </Animated.View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>🔍</Text>
                                <Text style={styles.emptyTitle}>No ideas found</Text>
                                <Text style={styles.emptyDesc}>Try a different filter category</Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

// Subcomponent: IdeaCard
function IdeaCard({ idea, onPress }: { idea: UpcycleIdea, onPress: () => void }) {

    const getDifficultyStyles = (diff: string) => {
        switch (diff) {
            case 'Beginner': return { bg: '#ecfdf5', text: '#047857', border: '#d1fae5' };
            case 'Intermediate': return { bg: '#fffbeb', text: '#b45309', border: '#fef3c7' };
            case 'Advanced': return { bg: '#fff1f2', text: '#e11d48', border: '#ffe4e6' };
            default: return { bg: '#f9fafb', text: '#374151', border: '#f3f4f6' };
        }
    };

    const diffStyle = getDifficultyStyles(idea.difficulty);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.ideaCard,
                { transform: [{ translateY: pressed ? -2 : 0 }] }
            ]}
        >
            <View style={styles.ideaCardTop}>
                <View style={styles.ideaImageWrapper}>
                    <Image source={{ uri: idea.previewImage }} style={styles.ideaImage} />
                </View>
                <View style={styles.ideaInfo}>

                    <View style={styles.ideaBadgesRow}>
                        <View style={[styles.diffBadge, { backgroundColor: diffStyle.bg, borderColor: diffStyle.border }]}>
                            <Text style={[styles.diffBadgeText, { color: diffStyle.text }]}>{idea.difficulty}</Text>
                        </View>
                        <Text style={styles.pointsText}>+50 pts</Text>
                    </View>

                    <Text style={styles.ideaTitle} numberOfLines={2}>{idea.title}</Text>
                    <Text style={styles.ideaDesc} numberOfLines={2}>{idea.description}</Text>
                </View>
            </View>

            <View style={styles.ideaFooter}>
                <View style={styles.footerPillLeft}>
                    <Text style={{ fontSize: 20 }}>📦</Text>
                    <Text style={styles.footerPillTextLeft}>INPUT</Text>
                </View>
                <ArrowRight size={16} color={theme.colors.ecoPrimary} style={{ opacity: 0.3 }} />
                <View style={styles.footerPillRight}>
                    <Text style={{ fontSize: 20 }}>✨</Text>
                    <Text style={styles.footerPillTextRight}>OUTPUT</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.ecoBg,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 2,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        gap: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        lineHeight: 24,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    scrollContent: {
        paddingVertical: 24,
        paddingBottom: 100, // accommodate tabBar
    },
    filtersWrapper: {
        marginBottom: 32,
    },
    filtersScroll: {
        paddingHorizontal: 24,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterChipActive: {
        backgroundColor: theme.colors.ecoPrimary,
        borderColor: theme.colors.ecoPrimary,
        shadowColor: theme.colors.ecoPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    filterChipInactive: {
        backgroundColor: 'white',
        borderColor: theme.colors.ecoMint,
    },
    filterText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    filterTextActive: {
        color: 'white',
    },
    filterTextInactive: {
        color: theme.colors.ecoMuted,
    },
    transformCard: {
        backgroundColor: 'white',
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 4,
        marginBottom: 32,
    },
    transformCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    transformCardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9ca3af',
        letterSpacing: 2,
    },
    transformRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    transformCol: {
        flex: 1,
        alignItems: 'center',
        gap: 12,
    },
    originalImageWrapper: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    upcycledImageWrapper: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#ecfdf5',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#d1fae5',
    },
    transformImage: {
        width: '100%',
        height: '100%',
    },
    transformLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9ca3af',
        letterSpacing: 1.5,
    },
    arrowOverlay: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
        marginHorizontal: -20,
    },
    listSection: {
        paddingHorizontal: 24,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    countBadge: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
    },
    countText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
    },
    cardsContainer: {
        gap: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        backgroundColor: 'white',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        borderStyle: 'dashed',
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    emptyDesc: {
        fontSize: 12,
        color: theme.colors.ecoMuted,
        marginTop: 4,
    },
    ideaCard: {
        backgroundColor: 'white',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.04,
        shadowRadius: 40,
        elevation: 4,
    },
    ideaCardTop: {
        flexDirection: 'row',
        padding: 24,
        gap: 16,
    },
    ideaImageWrapper: {
        width: 96,
        height: 96,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
    },
    ideaImage: {
        width: '100%',
        height: '100%',
    },
    ideaInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    ideaBadgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    diffBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    diffBadgeText: {
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    pointsText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    ideaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
        lineHeight: 22,
        marginBottom: 4,
    },
    ideaDesc: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
        lineHeight: 18,
    },
    ideaFooter: {
        backgroundColor: theme.colors.ecoBg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.ecoMint,
    },
    footerPillLeft: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
    },
    footerPillTextLeft: {
        fontSize: 9,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
    },
    footerPillRight: {
        flex: 1,
        backgroundColor: 'rgba(212, 237, 219, 0.4)',
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(20, 54, 33, 0.1)',
    },
    footerPillTextRight: {
        fontSize: 9,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: 1.5,
    }
});
