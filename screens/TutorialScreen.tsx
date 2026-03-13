import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, CheckCircle2, ChevronRight, Clock, Droplets, Layout, PenTool, Scissors, Wrench } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme';
import { ScreenType, UpcycleIdea } from '../types';

const { width } = Dimensions.get('window');

interface Props {
    onNavigate: (screen: ScreenType) => void;
    idea: UpcycleIdea | null;
    onComplete: (points: number) => void;
}

export default function TutorialScreen({ onNavigate, idea, onComplete }: Props) {
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    if (!idea) return null;

    const toggleStep = (stepNumber: number) => {
        if (completedSteps.includes(stepNumber)) {
            setCompletedSteps(completedSteps.filter(s => s !== stepNumber));
        } else {
            const newCompleted = [...completedSteps, stepNumber];
            setCompletedSteps(newCompleted);

            // Check if all steps are completed
            if (newCompleted.length === idea.steps.length && !isFinished) {
                setIsFinished(true);
                onComplete(100); // Award 100 points for completion
            }
        }
    };

    const progress = idea.steps.length > 0
        ? Math.round((completedSteps.length / idea.steps.length) * 100)
        : 0;

    const getStepIcon = (instruction: string) => {
        const text = instruction.toLowerCase();
        if (text.includes('cut') || text.includes('scissors')) return <Scissors size={14} color="#9ca3af" />;
        if (text.includes('glue') || text.includes('attach') || text.includes('tie')) return <PenTool size={14} color="#9ca3af" />;
        if (text.includes('water') || text.includes('soil') || text.includes('plant')) return <Droplets size={14} color="#9ca3af" />;
        if (text.includes('arrange') || text.includes('grid') || text.includes('layout')) return <Layout size={14} color="#9ca3af" />;
        if (text.includes('poke') || text.includes('hole') || text.includes('thread')) return <Wrench size={14} color="#9ca3af" />;
        return <ChevronRight size={14} color="#9ca3af" />;
    };

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            style={styles.container}
        >
            <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Curved Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={{ uri: idea.previewImage }}
                        style={styles.headerImage}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />

                    <View style={styles.headerTop}>
                        <Pressable
                            onPress={() => onNavigate('recommendations')}
                            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
                        >
                            <ArrowLeft size={20} color="#fff" />
                        </Pressable>
                        <View style={styles.timePill}>
                            <Clock size={14} color="#fff" />
                            <Text style={styles.timeText}>{idea.estimatedTime}</Text>
                        </View>
                    </View>

                    <View style={styles.headerContent}>
                        <View style={styles.difficultyBadge}>
                            <Text style={styles.difficultyText}>{idea.difficulty}</Text>
                        </View>
                        <Text style={styles.titleText}>{idea.title}</Text>
                        <Text style={styles.descriptionText} numberOfLines={2}>
                            {idea.description}
                        </Text>
                    </View>
                </View>

                {/* Sticky Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressValue}>{progress}%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: `${progress}%` }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.contentPadding}>
                    {/* Materials Needed */}
                    {idea.materials && idea.materials.length > 0 && (
                        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.materialsCard}>
                            <View style={styles.sectionTitleRow}>
                                <Wrench size={14} color="#f59e0b" />
                                <Text style={styles.sectionTitle}>Materials Needed</Text>
                            </View>
                            <View style={styles.materialsList}>
                                {idea.materials.map((material, index) => (
                                    <View key={index} style={styles.materialItem}>
                                        <View style={styles.materialDot} />
                                        <Text style={styles.materialText}>{material}</Text>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Steps */}
                    {idea.steps && idea.steps.length > 0 ? (
                        <View style={styles.stepsSection}>
                            <Text style={styles.stepsHeaderTitle}>Step-by-Step Guide</Text>
                            <View style={styles.stepsList}>
                                {idea.steps.map((step, index) => {
                                    const isCompleted = completedSteps.includes(step.stepNumber);
                                    return (
                                        <Animated.View key={step.stepNumber} entering={FadeInDown.duration(400).delay(150 + (index * 50))}>
                                            <Pressable
                                                onPress={() => toggleStep(step.stepNumber)}
                                                style={[
                                                    styles.stepCard,
                                                    isCompleted ? styles.stepCardCompleted : null
                                                ]}
                                            >
                                                <View style={styles.stepRow}>
                                                    <View style={styles.stepIndicatorContainer}>
                                                        {isCompleted ? (
                                                            <View style={styles.stepCheckmark}>
                                                                <Check size={18} color="#fff" strokeWidth={3} />
                                                            </View>
                                                        ) : (
                                                            <View style={styles.stepNumberBadge}>
                                                                <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <View style={styles.stepContent}>
                                                        <View style={styles.stepTitleRow}>
                                                            <View style={styles.stepIconWrapper}>
                                                                {getStepIcon(step.instruction)}
                                                            </View>
                                                            <Text style={[
                                                                styles.stepLabel,
                                                                isCompleted ? styles.stepLabelCompleted : null
                                                            ]}>
                                                                Step {step.stepNumber}
                                                            </Text>
                                                        </View>
                                                        <Text style={[
                                                            styles.stepInstruction,
                                                            isCompleted ? styles.stepInstructionCompleted : null
                                                        ]}>
                                                            {step.instruction}
                                                        </Text>

                                                        {step.imageUrl && (
                                                            <View style={styles.stepImageContainer}>
                                                                <Image source={{ uri: step.imageUrl }} style={styles.stepImage} />
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            </Pressable>
                                        </Animated.View>
                                    );
                                })}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <Text style={styles.emptyStateText}>No steps available for this project yet.</Text>
                        </View>
                    )}

                    {/* Completion State */}
                    {progress === 100 && (
                        <Animated.View
                            entering={FadeIn.duration(600).delay(200)}
                            style={styles.completionCard}
                        >
                            <LinearGradient
                                colors={[theme.colors.ecoPrimary, theme.colors.ecoSecondary]}
                                style={StyleSheet.absoluteFillObject}
                            />
                            <View style={styles.glowTopRight} />
                            <View style={styles.glowBottomLeft} />

                            <View style={styles.completionIconContainer}>
                                <CheckCircle2 size={32} color="#fff" />
                            </View>
                            <Text style={styles.completionTitle}>Project Complete!</Text>
                            <Text style={styles.completionDesc}>
                                You've successfully upcycled this item and saved it from the landfill.
                            </Text>

                            <Pressable
                                onPress={() => onNavigate('home')}
                                style={({ pressed }) => [styles.backHomeBtn, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
                            >
                                <Text style={styles.backHomeText}>Back to Home</Text>
                                <ChevronRight size={16} color={theme.colors.ecoPrimary} />
                            </Pressable>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.ecoBg,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerImageContainer: {
        height: 288, // h-72
        width: '100%',
        position: 'relative',
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 8,
        backgroundColor: '#000',
    },
    headerImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    headerTop: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 24,
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 10,
    },
    backBtn: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    timePill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    timeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerContent: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
        zIndex: 10,
    },
    difficultyBadge: {
        backgroundColor: theme.colors.ecoPrimary,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    titleText: {
        fontSize: 30,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    descriptionText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
        lineHeight: 22,
    },
    progressContainer: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingHorizontal: 24,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 3,
        zIndex: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    progressValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    progressBarTrack: {
        width: '100%',
        height: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.ecoPrimary,
        borderRadius: 4,
    },
    contentPadding: {
        padding: 24,
        paddingBottom: 40,
        gap: 32,
    },
    materialsCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 4,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    materialsList: {
        gap: 12,
    },
    materialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    materialDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fbbf24', // amber-400
    },
    materialText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    stepsSection: {
        flex: 1,
    },
    stepsHeaderTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    stepsList: {
        gap: 16,
    },
    stepCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 4,
    },
    stepCardCompleted: {
        borderColor: theme.colors.ecoPrimary,
        backgroundColor: 'rgba(220, 252, 231, 0.3)', // green-50 / 30 loosely
    },
    stepRow: {
        flexDirection: 'row',
        gap: 16,
    },
    stepIndicatorContainer: {
        marginTop: 4,
    },
    stepNumberBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f9fafb',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#9ca3af',
    },
    stepCheckmark: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.ecoPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    stepContent: {
        flex: 1,
    },
    stepTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    stepIconWrapper: {
        opacity: 0.5,
    },
    stepLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    stepLabelCompleted: {
        color: theme.colors.ecoPrimary,
    },
    stepInstruction: {
        fontSize: 14,
        lineHeight: 22,
        color: '#4b5563',
        fontWeight: '500',
    },
    stepInstructionCompleted: {
        color: '#6b7280',
    },
    stepImageContainer: {
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    stepImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    emptyStateContainer: {
        paddingVertical: 48,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 32,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: theme.colors.ecoMint,
    },
    emptyStateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    completionCard: {
        padding: 32,
        borderRadius: 32,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: theme.colors.ecoPrimary,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 10,
        marginTop: 8,
    },
    glowTopRight: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    glowBottomLeft: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    completionIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        zIndex: 10,
    },
    completionTitle: {
        fontSize: 24,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        zIndex: 10,
    },
    completionDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 24,
        zIndex: 10,
    },
    backHomeBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
    },
    backHomeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    }
});
