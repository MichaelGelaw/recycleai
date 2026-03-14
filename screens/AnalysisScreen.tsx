import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight, Droplets, Globe, Recycle, RefreshCw, Share2, Sparkles, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { theme } from '../theme';
import { AnalysisData, ScreenType, UpcycleIdea } from '../types';
import { generateTutorialWithGemini, fetchAndCacheGeneratedImage } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { loadTutorial, saveTutorial } from '../utils/db';

const { width } = Dimensions.get('window');

interface Props {
    onNavigate: (screen: ScreenType) => void;
    scannedImage: string | null;
    analysisData: AnalysisData | null;
    onAcceptIdea?: (idea: UpcycleIdea) => void;
}

export default function AnalysisScreen({ onNavigate, scannedImage, analysisData, onAcceptIdea }: Props) {
    const { user } = useAuth();
    const [showProgress, setShowProgress] = useState(false);
    const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
    const [isGeneratingTutorial, setIsGeneratingTutorial] = useState(false);
    const progressWidth = useSharedValue(0);

    const handleReloadIdea = () => {
        if (analysisData?.ideas) {
            setCurrentIdeaIndex((prev) => (prev + 1) % analysisData.ideas.length);
        }
    };

    const handleAcceptIdea = async (idea: UpcycleIdea) => {
        if (!onAcceptIdea) return;
        try {
            setIsGeneratingTutorial(true);

            // Check DB cache first to avoid redundant Gemini calls
            let materials: string[];
            let processedSteps: UpcycleIdea['steps'];

            const cached = user ? await loadTutorial(user.id, idea.id) : null;
            if (cached) {
                materials = cached.materials;
                processedSteps = cached.steps;
            } else {
                const generated = await generateTutorialWithGemini(idea);
                materials = generated.materials;

                processedSteps = await Promise.all(
                    generated.steps.map(async (step, index) => {
                        if (step.imagePrompt) {
                            const imgUrl = await fetchAndCacheGeneratedImage(
                                step.imagePrompt,
                                `tutorial_step_${idea.id}_${index}`,
                                "zimage"
                            );
                            return { ...step, imageUrl: imgUrl || undefined };
                        }
                        return step;
                    })
                );

                // Persist to DB for future visits
                if (user) {
                    await saveTutorial(user.id, idea.id, materials, processedSteps ?? []);
                }
            }

            const finalIdea = { ...idea, materials, steps: processedSteps };
            setIsGeneratingTutorial(false);
            onAcceptIdea(finalIdea);
        } catch (e) {
            console.error('Failed to generate tutorial:', e);
            setIsGeneratingTutorial(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowProgress(true);
            if (analysisData) {
                progressWidth.value = withTiming(analysisData.recyclabilityScore, { duration: 1500, easing: Easing.out(Easing.ease) });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [analysisData]);

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`
        };
    });

    if (!analysisData) return null;

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(400)}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => onNavigate('home')}
                    style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
                >
                    <ArrowLeft size={20} color={theme.colors.ecoPrimary} />
                </Pressable>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Item Analysis</Text>
                    <Text style={styles.headerSubtitle}>Botanical ID · {analysisData.confidence}% Confidence</Text>
                </View>
                <Pressable style={({ pressed }) => [styles.shareBtn, { opacity: pressed ? 0.7 : 1 }]}>
                    <Share2 size={18} color={theme.colors.ecoMuted} />
                </Pressable>
            </View>

            <View style={styles.cardsContainer}>
                {/* Item Hero Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(100)}
                    style={styles.heroCard}
                >
                    <View style={styles.heroImageContainer}>
                        <LinearGradient
                            colors={[theme.colors.ecoMint, '#fff']}
                            style={StyleSheet.absoluteFillObject}
                        />
                        {scannedImage ? (
                            <Image source={{ uri: scannedImage }} style={styles.heroImage} />
                        ) : (
                            <Text style={{ fontSize: 80 }}>🥤</Text>
                        )}
                        <LinearGradient
                            colors={['rgba(0,0,0,0.2)', 'transparent']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <View style={styles.recyclableBadge}>
                            <View style={styles.recyclableDot} />
                            <Text style={styles.recyclableText}>Recyclable</Text>
                        </View>
                    </View>

                    <View style={styles.detailsGrid}>
                        {[
                            { label: "Material", value: analysisData.materialType },
                            { label: "Condition", value: analysisData.condition },
                            { label: "Category", value: "Bottle" },
                            { label: "Recyclable", value: "✓ Yes", color: "#059669" }
                        ].map((detail, i) => (
                            <View key={i} style={[
                                styles.detailCell,
                                i < 2 ? styles.borderBottom : null,
                                i % 2 === 0 ? styles.borderRight : null
                            ]}>
                                <Text style={styles.detailLabel}>{detail.label}</Text>
                                <Text style={[styles.detailValue, { color: detail.color || theme.colors.ecoInk }]}>{detail.value}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Recyclability Score */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(200)}
                    style={styles.scoreCard}
                >
                    <View style={styles.scoreHeader}>
                        <Text style={styles.scoreTitle}>Recyclability Score</Text>
                        <Text style={styles.scoreValue}>
                            {showProgress ? analysisData.recyclabilityScore : 0}%
                        </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <Animated.View style={[styles.progressBarContainer, progressStyle]}>
                            <LinearGradient
                                colors={[theme.colors.ecoSecondary, theme.colors.ecoPrimary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFillObject}
                            />
                        </Animated.View>
                    </View>

                    <Text style={styles.scoreDesc}>
                        Excellent potential. This material is widely accepted at most local curbside programs.
                    </Text>
                </Animated.View>

                {/* Relatable Impact */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(250)}
                    style={styles.ecoFactCard}
                >
                    <View style={styles.ecoFactIconBg}>
                        <Zap size={24} color={theme.colors.ecoPrimary} />
                    </View>
                    <View style={styles.ecoFactContent}>
                        <Text style={styles.ecoFactTitle}>Eco Fact</Text>
                        <Text style={styles.ecoFactDesc}>
                            Recycling this saves enough energy to power a laptop for <Text style={styles.ecoFactHighlight}>3 hours</Text>.
                        </Text>
                    </View>
                </Animated.View>

                {/* AI Reasoning Panel */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(300)}
                    style={styles.reasoningCard}
                >
                    <View style={styles.reasoningHeader}>
                        <LinearGradient
                            colors={[theme.colors.ecoSecondary, theme.colors.ecoPrimary]}
                            style={styles.reasoningIconBg}
                        >
                            <Sparkles size={20} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.reasoningTitle}>AI Reasoning</Text>
                        <View style={styles.confidenceBadge}>
                            <Text style={styles.confidenceText}>{analysisData.confidence}% Sure</Text>
                        </View>
                    </View>

                    <View style={styles.reasoningList}>
                        {analysisData.reasoning.map((reason, idx) => (
                            <View key={idx} style={styles.reasoningItem}>
                                <View style={styles.bulletPointBg}>
                                    <View style={styles.bulletPoint} />
                                </View>
                                <Text style={styles.reasoningText}>{reason}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Environmental Impact Potential */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(400)}
                    style={styles.impactCard}
                >
                    <View style={styles.impactGlow} />

                    <View style={styles.impactHeader}>
                        <Text style={styles.impactTitle}>Impact Potential</Text>
                        <View style={styles.impactBadge}>
                            <Text style={styles.impactBadgeText}>Lifetime</Text>
                        </View>
                    </View>

                    <View style={styles.impactGrid}>
                        <ImpactBox icon={<Recycle size={22} color="#fff" />} value={`${analysisData.impact.wastePrevented}kg`} label="Waste" />
                        <ImpactBox icon={<Globe size={22} color="#fff" />} value={`${analysisData.impact.co2Saved}kg`} label="CO₂" />
                        <ImpactBox icon={<Droplets size={22} color="#fff" />} value={`${analysisData.impact.waterSaved}L`} label="Water" />
                    </View>
                </Animated.View>

                {/* Better Alternatives (Eco Swaps) */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(500)}
                    style={styles.swapsCard}
                >
                    <View style={styles.swapsHeader}>
                        <View style={styles.swapsTitleRow}>
                            <RefreshCw size={20} color={theme.colors.ecoTerra} />
                            <Text style={styles.swapsTitle}>Better Alternatives</Text>
                        </View>
                        <Pressable onPress={() => onNavigate('swaps')}>
                            <Text style={styles.swapsSeeAll}>See All</Text>
                        </Pressable>
                    </View>

                    {analysisData.swaps && analysisData.swaps.length > 0 ? (
                        <Pressable 
                            style={({ pressed }) => [styles.swapItem, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                            onPress={() => onNavigate('swaps')}
                        >
                            <View style={styles.swapItemImageContainer}>
                                <Image source={{ uri: analysisData.swaps[0].imageUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                            </View>
                            <View style={styles.swapContent}>
                                <Text style={styles.swapItemTitle}>Switch to {analysisData.swaps[0].to}</Text>
                                <Text style={styles.swapItemDesc} numberOfLines={2}>{analysisData.swaps[0].description}</Text>
                            </View>
                            <ChevronRight size={16} color="rgba(139, 69, 19, 0.4)" />
                        </Pressable>
                    ) : (
                        <Pressable style={({ pressed }) => [styles.swapItem, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
                            <Text style={{ fontSize: 24 }}>🥤</Text>
                            <Text style={styles.swapArrow}>→</Text>
                            <Text style={{ fontSize: 24 }}>🫗</Text>
                            <View style={styles.swapContent}>
                                <Text style={styles.swapItemTitle}>Switch to a reusable steel bottle</Text>
                                <Text style={styles.swapItemDesc}>Saves ~156 disposables per year</Text>
                            </View>
                            <ChevronRight size={16} color="rgba(139, 69, 19, 0.4)" />
                        </Pressable>
                    )}
                </Animated.View>

                {/* Single Idea Display */}
                {analysisData.ideas && analysisData.ideas.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.ideaCardBlock}>
                        <View style={styles.ideaHeader}>
                            <View style={styles.diffBadge}>
                                <Text style={styles.diffBadgeText}>{analysisData.ideas[currentIdeaIndex].difficulty}</Text>
                            </View>
                            <Pressable onPress={handleReloadIdea} style={styles.reloadBtn}>
                                <RefreshCw size={14} color={theme.colors.ecoPrimary} />
                                <Text style={styles.reloadText}>Reload idea</Text>
                            </Pressable>
                        </View>
                        <Text style={styles.ideaTitleBlock}>{analysisData.ideas[currentIdeaIndex].title}</Text>
                        <Text style={styles.ideaDescBlock}>{analysisData.ideas[currentIdeaIndex].description}</Text>
                        
                        <Pressable
                            onPress={() => handleAcceptIdea(analysisData.ideas[currentIdeaIndex])}
                            disabled={isGeneratingTutorial}
                            style={({ pressed }) => [styles.actionButtonContainer, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                        >
                            <LinearGradient
                                colors={isGeneratingTutorial ? ['#d1fae5', '#a7f3d0'] : [theme.colors.ecoSecondary, theme.colors.ecoPrimary]}
                                style={styles.actionButtonBg}
                            >
                                {isGeneratingTutorial ? (
                                    <>
                                        <ActivityIndicator color={theme.colors.ecoPrimary} />
                                        <Text style={[styles.actionButtonText, { color: theme.colors.ecoPrimary }]}>Generating Tutorial...</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.actionButtonText}>Accept Idea</Text>
                                        <ArrowLeft size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
                                    </>
                                )}
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}
            </View>
        </Animated.ScrollView>
    );
}

function ImpactBox({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <View style={styles.impactBox}>
            <View style={styles.impactBoxIcon}>{icon}</View>
            <Text style={styles.impactBoxValue}>{value}</Text>
            <Text style={styles.impactBoxLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.ecoBg,
    },
    contentContainer: {
        paddingBottom: 120, // pb-32
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 64 : 48,
        paddingBottom: 16,
        gap: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    shareBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: theme.fonts.display,
        color: theme.colors.ecoPrimary,
    },
    headerSubtitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 2,
    },
    cardsContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    heroCard: {
        backgroundColor: '#fff',
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.03,
        shadowRadius: 30,
        elevation: 5,
    },
    heroImageContainer: {
        height: 192, // h-48
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    recyclableBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    recyclableDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    recyclableText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(212, 237, 219, 0.1)', // ecoMint / 10
    },
    detailCell: {
        width: '50%',
        padding: 16,
        borderColor: theme.colors.ecoMint,
    },
    borderBottom: {
        borderBottomWidth: 1,
    },
    borderRight: {
        borderRightWidth: 1,
    },
    detailLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    scoreCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.03,
        shadowRadius: 30,
        elevation: 5,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    scoreValue: {
        fontSize: 30, // 3xl
        fontWeight: 'bold',
        fontFamily: theme.fonts.display,
        color: theme.colors.ecoPrimary,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: theme.colors.ecoMint,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarContainer: {
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    scoreDesc: {
        fontSize: 12,
        color: theme.colors.ecoMuted,
        marginTop: 16,
        fontWeight: '500',
        lineHeight: 18,
    },
    ecoFactCard: {
        backgroundColor: 'rgba(212, 237, 219, 0.3)', // ecoMint / 30
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        padding: 20,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    ecoFactIconBg: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    ecoFactContent: {
        flex: 1,
    },
    ecoFactTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        marginBottom: 2,
    },
    ecoFactDesc: {
        fontSize: 12,
        color: theme.colors.ecoMuted,
        fontWeight: '500',
        lineHeight: 16,
    },
    ecoFactHighlight: {
        color: theme.colors.ecoPrimary,
        fontWeight: 'bold',
    },
    reasoningCard: {
        backgroundColor: '#fff', // fallback
        padding: 24,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(46, 112, 72, 0.1)', // ecoSecondary / 10
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    reasoningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    reasoningIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    reasoningTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: theme.fonts.display,
        color: theme.colors.ecoPrimary,
        flex: 1,
    },
    confidenceBadge: {
        backgroundColor: theme.colors.ecoPrimary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    confidenceText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    reasoningList: {
        gap: 12,
    },
    reasoningItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    bulletPointBg: {
        width: 20,
        height: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(46, 112, 72, 0.2)', // ecoSecondary/20
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.ecoSecondary,
    },
    reasoningText: {
        flex: 1,
        fontSize: 12,
        color: theme.colors.ecoMuted,
        lineHeight: 18,
        fontWeight: '500',
    },
    impactCard: {
        backgroundColor: theme.colors.ecoPrimary,
        padding: 32,
        borderRadius: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    impactGlow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 192,
        height: 192,
        borderRadius: 96,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    impactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        zIndex: 10,
    },
    impactTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: theme.fonts.display,
        color: '#fff',
    },
    impactBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    impactBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    impactGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        zIndex: 10,
    },
    impactBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    impactBoxIcon: {
        marginBottom: 8,
        opacity: 0.8,
    },
    impactBoxValue: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: theme.fonts.display,
        color: '#fff',
        marginBottom: 4,
    },
    impactBoxLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        opacity: 0.6,
    },
    swapsCard: {
        backgroundColor: '#F5DDD0',
        borderWidth: 1,
        borderColor: 'rgba(139, 69, 19, 0.2)', // ecoTerra / 20
        padding: 24,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    swapsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    swapsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    swapsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: theme.fonts.display,
        color: theme.colors.ecoTerra,
    },
    swapsSeeAll: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoTerra,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    swapItem: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 69, 19, 0.1)', // ecoTerra / 10
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    swapArrow: {
        color: theme.colors.ecoTerra,
        fontWeight: 'bold',
        fontSize: 16,
    },
    swapItemImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        overflow: 'hidden',
    },
    swapContent: {
        flex: 1,
        marginLeft: 8,
    },
    swapItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
    },
    swapItemDesc: {
        fontSize: 10,
        color: theme.colors.ecoMuted,
        marginTop: 2,
    },
    actionButtonContainer: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 20, // Add some padding below button
    },
    actionButtonBg: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        borderRadius: 40,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: theme.fonts.sans,
    },
    ideaCardBlock: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.03,
        shadowRadius: 30,
        elevation: 5,
        marginBottom: 20,
    },
    ideaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    diffBadge: {
        backgroundColor: '#ecfdf5',
        borderColor: '#d1fae5',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    diffBadgeText: {
        color: '#047857',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    reloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(212, 237, 219, 0.4)', // light ecoMint
        borderRadius: 16,
    },
    reloadText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    ideaTitleBlock: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
        marginBottom: 8,
    },
    ideaDescBlock: {
        fontSize: 14,
        color: theme.colors.ecoMuted,
        lineHeight: 20,
        marginBottom: 20,
    }
});
