import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ChatAssistant({ onClose }: any) {
    return (
        <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.overlay} />
            <View style={styles.modal}>
                <Text style={styles.text}>ChatAssistant Placeholder</Text>
                <Pressable onPress={onClose} style={styles.closeBtn}>
                    <Text style={{ color: 'white' }}>Close</Text>
                </Pressable>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    modal: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 400, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
    text: { fontSize: 18, marginBottom: 20 },
    closeBtn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 8 }
});
