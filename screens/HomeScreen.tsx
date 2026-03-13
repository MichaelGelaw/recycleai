import { LinearGradient } from 'expo-linear-gradient';
import { Award, Camera, ChevronRight, Droplets, Flame, Leaf, MapPin, RefreshCw, Sparkles, Wind } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { theme } from '../theme';
import { ScreenType } from '../types';

const { width } = Dimensions.get('window');

interface Props {
    onNavigate: (screen: ScreenType) => void;
    ecoScore: number;
}

export default function HomeScreen({ onNavigate, ecoScore }: Props) {
    const level = Math.floor(ecoScore / 200) + 1;
    const progressPercent = ((ecoScore % 200) / 200) * 100;

    const barWidth = useSharedValue(0);
    const floatAnim = useSharedValue(0);

    useEffect(() => {
        // Animate progress bar
        barWidth.value = withTiming(progressPercent, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

        // Animate floating map pin
        floatAnim.value = withRepeat(
            withTiming(8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [progressPercent]);

    const animatedBar = useAnimatedStyle(() => ({
        width: `${barWidth.value}%`
    }));

    const animatedPin = useAnimatedStyle(() => ({
        transform: [{ translateY: -floatAnim.value }]
    }));

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(400)}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header & Profile Summary */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.title}>EcoCycle</Text>
                        <Text style={styles.subtitle}>Welcome back, Eco-Guardian</Text>
                    </View>
                    <View style={styles.streakBadge}>
                        <Flame size={14} color="#f59e0b" fill="#f59e0b" />
                        <Text style={styles.streakText}>12 Day Streak</Text>
                    </View>
                </View>

                {/* Hero: Level & Growth Visualization */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.heroCard}>
                    <View style={styles.heroGlow} />

                    <View style={styles.heroContent}>
                        <View style={styles.levelBadgeContainer}>
                            <View style={styles.levelBadge}>
                                <Leaf size={48} color={theme.colors.ecoPrimary} />
                                <View style={styles.levelIndicator}>
                                    <Text style={styles.levelIndicatorText}>L{level}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressLabel}>LEVEL PROGRESS</Text>
                                <Text style={styles.progressValue}>{ecoScore}/500 XP</Text>
                            </View>

                            <View style={styles.progressBarBg}>
                                <Animated.View style={[styles.progressBarFill, animatedBar]}>
                                    <LinearGradient
                                        colors={[theme.colors.ecoSecondary, theme.colors.ecoPrimary]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                </Animated.View>
                            </View>

                            <Text style={styles.progressDesc}>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.ecoPrimary }}>380 XP</Text> to reach <Text style={{ fontStyle: 'italic', color: theme.colors.ecoTerra }}>Forest Protector</Text>
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            {/* Impact Strip */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                <View style={styles.impactStrip}>
                    <ImpactStat icon={<Camera size={18} color="white" />} value="24" label="Scanned" />
                    <View style={styles.divider} />
                    <ImpactStat icon={<Wind size={18} color="white" />} value="12.4kg" label="CO₂ Saved" />
                    <View style={styles.divider} />
                    <ImpactStat icon={<Droplets size={18} color="white" />} value="85L" label="Water" />
                </View>
            </Animated.View>

            {/* Main Action: Scan */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                <Pressable
                    onPress={() => onNavigate('scan')}
                    style={({ pressed }) => [
                        styles.scanCard,
                        { transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                >
                    <View style={styles.scanCardContent}>
                        <View style={styles.scanIconContainer}>
                            <Camera size={28} color={theme.colors.ecoPrimary} />
                        </View>
                        <View style={styles.scanTextContainer}>
                            <Text style={styles.scanTitle}>Scan an Item</Text>
                            <Text style={styles.scanDesc}>Identify & get upcycling ideas</Text>
                        </View>
                    </View>
                    <View style={styles.chevronBtn}>
                        <ChevronRight size={20} color={theme.colors.ecoPrimary} />
                    </View>
                </Pressable>
            </Animated.View>

            {/* Explore Grid */}
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>EXPLORE FEATURES</Text>
                    <Text style={styles.sectionAction}>VIEW ALL</Text>
                </View>

                <View style={styles.grid}>
                    <FeatureCard
                        icon={<Sparkles size={22} color="#c2410c" />}
                        title="Upcycling"
                        desc="DIY Projects"
                        bgColor="#fff7ed"
                        onPress={() => onNavigate('recommendations')}
                    />
                    <FeatureCard
                        icon={<MapPin size={22} color="#1d4ed8" />}
                        title="Centers"
                        desc="Drop-off points"
                        bgColor="#eff6ff"
                        onPress={() => onNavigate('map')}
                    />
                    <FeatureCard
                        icon={<RefreshCw size={22} color="#047857" />}
                        title="Eco Swaps"
                        desc="Better choices"
                        bgColor="#ecfdf5"
                        onPress={() => onNavigate('swaps')}
                    />
                    <FeatureCard
                        icon={<Award size={22} color="#7e22ce" />}
                        title="Challenges"
                        desc="Earn badges"
                        bgColor="#faf5ff"
                        onPress={() => onNavigate('profile')}
                    />
                </View>
            </Animated.View>

            {/* Recycling Map Section */}
            <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>NEARBY CENTERS</Text>
                    <Text
                        style={styles.sectionAction}
                        onPress={() => onNavigate('map')}
                    >
                        OPEN MAP
                    </Text>
                </View>

                <Pressable
                    onPress={() => onNavigate('map')}
                    style={({ pressed }) => [
                        styles.mapCard,
                        { transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                >
                    <View style={styles.mapInfo}>
                        <View style={styles.mapIconBg}>
                            <MapPin size={24} color="#2563eb" />
                        </View>
                        <View>
                            <Text style={styles.mapTitle}>Green Valley Recycling</Text>
                            <Text style={styles.mapDesc}>0.8 miles away • Open now</Text>
                        </View>
                    </View>

                    <View style={styles.mapPreview}>
                        <View style={styles.mapMockBg} />
                        <Animated.View style={[styles.mapMarker, animatedPin]}>
                            <MapPin size={16} color="white" />
                        </Animated.View>
                    </View>
                </Pressable>
            </Animated.View>

            {/* Recent Activity */}
            <Animated.View entering={FadeInDown.delay(600)} style={[styles.section, { marginBottom: 40 }]}>
                <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>FIELD JOURNAL</Text>
                <View style={styles.activityList}>
                    <ActivityCard
                        title="Plastic Water Bottle"
                        time="2 hours ago"
                        points="+15"
                        type="Recycled"
                        icon="🥤"
                    />
                    <ActivityCard
                        title="Glass Jar Planter"
                        time="Yesterday"
                        points="+50"
                        type="Upcycled"
                        icon="🌿"
                    />
                </View>
            </Animated.View>
        </Animated.ScrollView>
    );
}

// Subcomponents

function ImpactStat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ opacity: 0.6, marginBottom: 4 }}>{icon}</View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 2 }}>{value}</Text>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
        </View>
    );
}

function FeatureCard({ icon, title, desc, bgColor, onPress }: { icon: React.ReactNode, title: string, desc: string, bgColor: string, onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.featureCard,
                { backgroundColor: bgColor, transform: [{ scale: pressed ? 0.96 : 1 }] }
            ]}
        >
            <View style={{ marginBottom: 12 }}>{icon}</View>
            <Text style={[styles.featureTitle, { color: (icon as any).props.color }]}>{title}</Text>
            <Text style={styles.featureDesc}>{desc}</Text>
        </Pressable>
    );
}

function ActivityCard({ icon, title, time, points, type }: { icon: string, title: string, time: string, points: string, type: string }) {
    return (
        <View style={styles.activityCard}>
            <View style={styles.activityIconBg}>
                <Text style={{ fontSize: 24 }}>{icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{title}</Text>
                    <View style={styles.activityPointsBg}>
                        <Text style={styles.activityPoints}>{points}</Text>
                    </View>
                </View>
                <View style={styles.activityFooter}>
                    <Text style={styles.activityType}>{type}</Text>
                    <View style={styles.activityDot} />
                    <Text style={styles.activityTime}>{time}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.ecoBg,
    },
    contentContainer: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
        marginTop: 4,
    },
    streakBadge: {
        backgroundColor: 'white',
        borderColor: theme.colors.ecoMint,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    streakText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    heroCard: {
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 24,
        borderColor: theme.colors.ecoMint,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.03,
        shadowRadius: 30,
        elevation: 4,
        overflow: 'hidden',
    },
    heroGlow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        backgroundColor: 'rgba(212, 237, 219, 0.4)',
        borderRadius: 80,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    levelBadgeContainer: {
        position: 'relative',
    },
    levelBadge: {
        width: 96,
        height: 96,
        backgroundColor: theme.colors.ecoBg,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.ecoMint,
    },
    levelIndicator: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: theme.colors.ecoPrimary,
        width: 32,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    levelIndicatorText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressContainer: {
        flex: 1,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1,
    },
    progressValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: theme.colors.ecoBg,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
    },
    progressBarFill: {
        height: '100%',
    },
    progressDesc: {
        fontSize: 11,
        color: theme.colors.ecoMuted,
        marginTop: 12,
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    impactStrip: {
        backgroundColor: theme.colors.ecoPrimary,
        borderRadius: 32,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: theme.colors.ecoPrimary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scanCard: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: theme.colors.ecoPrimary,
        padding: 32,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scanCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    scanIconContainer: {
        width: 56,
        height: 56,
        backgroundColor: theme.colors.ecoMint,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanTextContainer: {
        maxWidth: '80%',
    },
    scanTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        marginBottom: 4,
    },
    scanDesc: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
    },
    chevronBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.ecoPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 2,
    },
    sectionAction: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    featureCard: {
        width: (width - 48 - 16) / 2, // Half width minus padding and gap
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 10,
        fontWeight: '500',
        opacity: 0.6,
    },
    mapCard: {
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 20,
        borderColor: theme.colors.ecoMint,
        borderWidth: 1,
    },
    mapInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    mapIconBg: {
        width: 48,
        height: 48,
        backgroundColor: '#eff6ff',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
    },
    mapDesc: {
        fontSize: 10,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
        marginTop: 2,
    },
    mapPreview: {
        height: 96,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapMockBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#e5e7eb', // Simple placeholder for the map
    },
    mapMarker: {
        width: 32,
        height: 32,
        backgroundColor: theme.colors.ecoPrimary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    activityList: {
        gap: 16,
    },
    activityCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 24,
        borderColor: theme.colors.ecoMint,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    activityIconBg: {
        width: 56,
        height: 56,
        backgroundColor: 'rgba(212, 237, 219, 0.3)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
    },
    activityPointsBg: {
        backgroundColor: theme.colors.ecoMint,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    activityPoints: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    activityFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activityType: {
        fontSize: 9,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activityDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(61, 82, 69, 0.3)',
    },
    activityTime: {
        fontSize: 9,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
    }
});
