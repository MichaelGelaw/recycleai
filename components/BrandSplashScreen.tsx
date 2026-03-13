import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, ZoomIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
    onNext: () => void;
}

function Particle({ delay, duration }: { delay: number, duration: number }) {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(delay, withRepeat(withTiming(-100, { duration, easing: Easing.linear }), -1, false));
        opacity.value = withDelay(delay, withRepeat(
            withTiming(1, { duration: duration / 2 }),
            -1,
            true
        ));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const startX = Math.random() * width;
    const startY = height / 2 + Math.random() * 200;

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: startX,
                    top: startY,
                    width: 4,
                    height: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                },
                style,
            ]}
        />
    );
}

export default function BrandSplashScreen({ onNext }: Props) {
    useEffect(() => {
        const timer = setTimeout(onNext, 3000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} pointerEvents="none" />

            <Animated.View entering={FadeIn.duration(1000)} style={styles.content}>
                <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.logoContainer}>
                    <Ionicons name="leaf" size={56} color="white" />
                </Animated.View>

                <Animated.Text entering={FadeInUp.duration(800).delay(400)} style={styles.title}>
                    EcoCycle AI
                </Animated.Text>

                <Animated.Text entering={FadeInUp.duration(800).delay(600)} style={styles.subtitle}>
                    Turn everyday waste into sustainable solutions.
                </Animated.Text>
            </Animated.View>

            <View style={styles.bottomShapes}>
                <Animated.View entering={FadeInUp.duration(1000).delay(800)} style={[styles.shape, { width: 64, height: 128, borderTopLeftRadius: 32, borderTopRightRadius: 32 }]} />
                <Animated.View entering={ZoomIn.duration(1000).delay(1000)} style={[styles.shape, { width: 80, height: 80, borderRadius: 40, marginBottom: 16 }]} />
                <Animated.View entering={FadeInUp.duration(1200).delay(900)} style={[styles.shape, { width: 80, height: 192, borderTopLeftRadius: 40, borderTopRightRadius: 40 }]} />
                <Animated.View entering={FadeInUp.duration(1000).delay(1100)} style={[styles.shape, { width: 64, height: 96, borderTopLeftRadius: 32, borderTopRightRadius: 32 }]} />
            </View>

            {/* Particles */}
            {[...Array(6)].map((_, i) => (
                <Particle key={i} delay={Math.random() * 2000} duration={4000 + Math.random() * 4000} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A4228',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    logoContainer: {
        width: 112,
        height: 112,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: 'white',
        letterSpacing: -1.5,
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 17,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        maxWidth: 260,
        fontWeight: '500',
        lineHeight: 24,
    },
    bottomShapes: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 40,
    },
    shape: {
        backgroundColor: 'rgba(184,223,196,0.4)',
    }
});
