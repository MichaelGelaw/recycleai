import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
    onNext: () => void;
}

function FloatingEmoji({ e, x, y, delayMs, r, speedX }: { e: string, x: string, y: string, delayMs: number, r: string, speedX: number }) {
    const transY = useSharedValue(0);

    useEffect(() => {
        transY.value = withDelay(
            delayMs,
            withRepeat(
                withSequence(
                    withTiming(-12, { duration: speedX, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: speedX, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: r },
            { translateY: transY.value }
        ]
    }));

    return (
        <Animated.View style={[styles.floatingItem, { left: x as any, top: y as any }, animatedStyle]}>
            <Text style={{ fontSize: 29 }}>{e}</Text>
        </Animated.View>
    );
}

function BreathingLogo() {
    const scale = useSharedValue(1);
    const ringScale = useSharedValue(1);
    const ringOpacity = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 2250, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2250, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        ringScale.value = withRepeat(
            withTiming(1.4, { duration: 3200, easing: Easing.out(Easing.ease) }),
            -1,
            false
        );

        ringOpacity.value = withRepeat(
            withTiming(0, { duration: 3200, easing: Easing.out(Easing.ease) }),
            -1,
            false
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value
    }));

    return (
        <View style={{ position: 'relative', marginBottom: 26, alignSelf: 'center' }}>
            <Animated.View style={[styles.ring, ringStyle]} />
            <Animated.View style={[logoStyle]}>
                <LinearGradient
                    colors={['#22c55e', '#166534']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logo}
                >
                    <Text style={{ fontSize: 42 }}>♻️</Text>
                </LinearGradient>
            </Animated.View>
        </View>
    );
}

export default function SplashScreen({ onNext }: Props) {
    const floatingItems = [
        { e: "🍶", x: "4%", y: "10%", d: 0, r: "-7deg", s: 1750 },
        { e: "📦", x: "70%", y: "4%", d: 500, r: "6deg", s: 1900 },
        { e: "👗", x: "58%", y: "55%", d: 1100, r: "-4deg", s: 2050 },
        { e: "🥤", x: "8%", y: "62%", d: 280, r: "5deg", s: 1800 },
        { e: "🫙", x: "34%", y: "0%", d: 750, r: "-5deg", s: 2200 }
    ];

    return (
        <LinearGradient colors={['#E4F2EA', '#ffffff', '#FDF4EE']} locations={[0, 0.45, 1]} style={styles.container}>
            <View style={[styles.blob1, { position: 'absolute', top: -90, right: -90 }]} />
            <View style={[styles.blob2, { position: 'absolute', bottom: 80, left: -50 }]} />

            <View style={{ width: '100%', height: 170, marginBottom: 32 }}>
                {floatingItems.map((it, k) => (
                    <FloatingEmoji key={k} e={it.e} x={it.x} y={it.y} delayMs={it.d} r={it.r} speedX={it.s} />
                ))}
            </View>

            <BreathingLogo />

            <Text style={styles.title}>
                Eco<Text style={{ color: '#16a34a' }}>Cycle</Text>{'\n'}
                <Text style={styles.titleAi}>AI</Text>
            </Text>

            <Text style={styles.subtitle}>
                Turn everyday waste into sustainable solutions, powered by AI.
            </Text>

            <Pressable onPress={onNext} style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.8 : 1 }]}>
                <Text style={styles.btnText}>Get Started →</Text>
            </Pressable>

            <Text style={styles.footerText}>Free · No account needed</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        overflow: 'hidden',
    },
    blob1: {
        width: 340,
        height: 340,
        borderRadius: 170,
        backgroundColor: 'rgba(91,174,119,0.10)',
    },
    blob2: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(208,107,56,0.08)',
    },
    floatingItem: {
        position: 'absolute',
        width: 60,
        height: 68,
        backgroundColor: 'white',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    logo: {
        width: 94,
        height: 94,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1a4228',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.32,
        shadowRadius: 42,
        elevation: 8,
    },
    ring: {
        position: 'absolute',
        top: -10,
        bottom: -10,
        left: -10,
        right: -10,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(91,174,119,0.22)',
    },
    title: {
        fontSize: 46,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -2,
        lineHeight: 46,
        textAlign: 'center',
        marginBottom: 4,
    },
    titleAi: {
        color: '#14b8a6',
        fontStyle: 'italic',
        fontSize: 38,
    },
    subtitle: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 24,
        textAlign: 'center',
        maxWidth: 240,
        marginTop: 16,
    },
    btn: {
        backgroundColor: '#111827',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 9999,
        marginTop: 48,
        width: '100%',
        maxWidth: 260,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 16,
    }
});
