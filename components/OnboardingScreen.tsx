import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    onComplete: (name: string, goals: string[]) => void;
}

const colors = {
    g50: '#f0fdf4',
    g200: '#bbf7d0',
    g500: '#22c55e',
    g600: '#16a34a',
    bg: '#ffffff',
    t100: '#f3f4f6',
    txPrimary: '#111827',
    txSecondary: '#4b5563',
    txMuted: '#6b7280',
    surface: '#ffffff',
    bd: '#e5e7eb',
    bd2: '#d1d5db',
};

const goalOpts = ["♻️ Recycle more", "💡 DIY projects", "🌍 Reduce CO₂", "💧 Save water", "🌿 Zero waste", "🛍️ Eco swaps"];

function BouncingEmoji() {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, [translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[{ alignItems: 'center', marginBottom: 20 }, animatedStyle]}>
            <Text style={{ fontSize: 72 }}>♻️</Text>
        </Animated.View>
    );
}

export default function OnboardingScreen({ onComplete }: Props) {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);
    const [name, setName] = useState("");
    const [goals, setGoals] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const stepsData = [
        { heading: "Welcome to\nEcoCycle", sub: "Your AI-powered sustainability companion" },
        { heading: "What's your\nname?", sub: "Let's personalize your experience" },
        { heading: "What are your\neco goals?", sub: "Choose everything that applies" }
    ];

    const s = stepsData[step];
    const canNext = step === 0 || (step === 1 && name.trim().length > 0) || (step === 2 && goals.length > 0);

    const renderContent = () => {
        if (step === 0) {
            return (
                <Animated.View entering={FadeInDown.delay(100)} style={{ width: '100%' }}>
                    <BouncingEmoji />
                    <View style={{ gap: 12, marginBottom: 8 }}>
                        {[
                            ["🔍", "Scan any material", "AI identifies it instantly"],
                            ["💡", "Get upcycling ideas", "Turn waste into treasure"],
                            ["🏆", "Earn eco points", "Level up your impact"]
                        ].map(([e, t, desc], i) => (
                            <View key={i} style={styles.featureCard}>
                                <Text style={{ fontSize: 24, marginRight: 14 }}>{e}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.txPrimary }}>{t}</Text>
                                    <Text style={{ fontSize: 12, color: colors.txMuted, marginTop: 2 }}>{desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>
            );
        } else if (step === 1) {
            return (
                <Animated.View entering={FadeInDown.delay(100)} style={{ width: '100%' }}>
                    <Text style={{ fontSize: 56, textAlign: 'center', marginBottom: 24 }}>👋</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name…"
                        placeholderTextColor={colors.txMuted}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        style={[
                            styles.input,
                            { borderColor: isFocused ? colors.g500 : colors.bd2 }
                        ]}
                    />
                    <Text style={{ fontSize: 12, color: colors.txMuted, textAlign: 'center' }}>
                        Your name is only stored on this device
                    </Text>
                </Animated.View>
            );
        } else {
            return (
                <Animated.View entering={FadeInDown.delay(100)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                        {goalOpts.map((g) => {
                            const sel = goals.includes(g);
                            return (
                                <Pressable
                                    key={g}
                                    onPress={() => setGoals(prev => sel ? prev.filter(x => x !== g) : [...prev, g])}
                                    style={({ pressed }) => [
                                        styles.goalChip,
                                        {
                                            backgroundColor: sel ? colors.g600 : colors.surface,
                                            borderColor: sel ? 'transparent' : colors.bd2,
                                            transform: [{ scale: pressed ? 0.95 : 1 }],
                                            shadowColor: sel ? '#1a4228' : 'transparent',
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowOpacity: sel ? 0.2 : 0,
                                            shadowRadius: 20,
                                            elevation: sel ? 4 : 0,
                                        }
                                    ]}
                                >
                                    <Text style={{ color: sel ? 'white' : colors.txSecondary, fontSize: 14, fontWeight: '600' }}>
                                        {g}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    {goals.length === 0 && (
                        <Animated.Text entering={FadeIn} style={{ fontSize: 13, color: colors.txMuted, textAlign: 'center' }}>
                            Pick at least one goal to continue
                        </Animated.Text>
                    )}
                </Animated.View>
            );
        }
    };

    return (
        <LinearGradient
            colors={[colors.g50, colors.bg, colors.t100]}
            locations={[0, 0.5, 1]}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 32) }} keyboardShouldPersistTaps="handled">
                    <View style={{ flex: 1, paddingHorizontal: 24 }}>
                        {/* Progress dots */}
                        <View style={{ flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 28, marginTop: 12 }}>
                            {[0, 1, 2].map((i) => (
                                <Animated.View
                                    key={i}
                                    style={{
                                        height: 7,
                                        borderRadius: 4,
                                        width: i === step ? 22 : 7,
                                        backgroundColor: i <= step ? colors.g600 : colors.g200,
                                    }}
                                />
                            ))}
                        </View>

                        {/* Heading */}
                        <Animated.View
                            key={`heading-${step}`}
                            entering={FadeInDown}
                            style={{ marginBottom: 28 }}
                        >
                            <Text style={{ fontSize: 36, fontWeight: '800', color: colors.txPrimary, letterSpacing: -1.5, lineHeight: 40, marginBottom: 8 }}>
                                {s.heading}
                            </Text>
                            <Text style={{ fontSize: 15, color: colors.txSecondary, lineHeight: 23 }}>
                                {s.sub}
                            </Text>
                        </Animated.View>

                        {/* Content */}
                        <View style={{ flex: 1 }}>
                            {renderContent()}
                        </View>

                        {/* CTA */}
                        <View style={{ marginTop: 24, paddingBottom: 24 }}>
                            <Pressable
                                disabled={!canNext}
                                onPress={() => {
                                    if (step < 2) setStep(s => s + 1);
                                    else onComplete(name || "Friend", goals);
                                }}
                                style={({ pressed }) => [
                                    styles.primaryBtn,
                                    { opacity: canNext ? (pressed ? 0.8 : 1) : 0.45 }
                                ]}
                            >
                                <Text style={styles.primaryBtnText}>
                                    {step === 2 ? "Start Eco Journey →" : "Continue →"}
                                </Text>
                            </Pressable>
                            {step > 0 && (
                                <Pressable
                                    onPress={() => setStep(s => s - 1)}
                                    style={({ pressed }) => [
                                        styles.ghostBtn,
                                        { opacity: pressed ? 0.6 : 1 }
                                    ]}
                                >
                                    <Text style={styles.ghostBtnText}>← Back</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.bd,
    },
    input: {
        width: '100%',
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 18,
        fontSize: 16,
        color: colors.txPrimary,
        marginBottom: 8,
    },
    goalChip: {
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 9999,
        borderWidth: 1.5,
    },
    primaryBtn: {
        backgroundColor: colors.txPrimary,
        paddingVertical: 16,
        borderRadius: 9999,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    ghostBtn: {
        paddingVertical: 16,
        marginTop: 10,
        alignItems: 'center',
    },
    ghostBtnText: {
        color: colors.txSecondary,
        fontSize: 15,
        fontWeight: '600',
    }
});
