import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export function Toast({ msg, icon, onClose }: { msg: string, icon?: React.ReactNode, onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.toast}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={styles.msg}>{msg}</Text>
        </Animated.View>
    );
}

export function Celebration({ pts, title, sub, onDone }: { pts: number, title: string, sub: string, onDone: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDone, 4000);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.celebration}>
            <Text style={styles.pts}>+{pts} pts</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sub}>{sub}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100,
    },
    icon: {
        marginRight: 8,
        fontSize: 20,
    },
    msg: {
        color: 'white',
        fontSize: 16,
    },
    celebration: {
        position: 'absolute',
        top: 120,
        left: 40,
        right: 40,
        backgroundColor: '#16a34a',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        zIndex: 100,
    },
    pts: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    sub: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    }
});
