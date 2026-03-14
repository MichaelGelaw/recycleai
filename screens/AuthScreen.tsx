import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Leaf, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { supabase } from '../utils/supabase';

export default function AuthScreen() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Missing fields', 'Please enter your email and password.');
            return;
        }
        if (mode === 'signup' && password !== confirmPassword) {
            Alert.alert('Password mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                Alert.alert(
                    'Check your email',
                    'We sent you a confirmation link. Confirm your email to continue.'
                );
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                // AuthContext listener will handle navigation
            }
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'recycleai://auth/callback',
                },
            });
            if (error) throw error;
        } catch (err: any) {
            Alert.alert('Google Sign In Error', err.message ?? 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo header */}
                <LinearGradient colors={['#16a34a', '#15803d']} style={styles.logoWrap}>
                    <View style={styles.logoIconBg}>
                        <Leaf size={36} color="white" strokeWidth={2} />
                    </View>
                </LinearGradient>

                <Text style={styles.heading}>
                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                </Text>
                <Text style={styles.subheading}>
                    {mode === 'signin'
                        ? 'Sign in to your eco journey'
                        : 'Start your green journey today'}
                </Text>

                {/* Tab switcher */}
                <View style={styles.tabs}>
                    <Pressable
                        onPress={() => setMode('signin')}
                        style={[styles.tab, mode === 'signin' && styles.tabActive]}
                    >
                        <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                            Sign In
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setMode('signup')}
                        style={[styles.tab, mode === 'signup' && styles.tabActive]}
                    >
                        <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                            Sign Up
                        </Text>
                    </Pressable>
                </View>

                {/* Email input */}
                <View style={styles.inputWrap}>
                    <View style={styles.inputIcon}>
                        <Mail size={18} color="#9ca3af" />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="#9ca3af"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Password input */}
                <View style={styles.inputWrap}>
                    <View style={styles.inputIcon}>
                        <Lock size={18} color="#9ca3af" />
                    </View>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Password"
                        placeholderTextColor="#9ca3af"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                        {showPassword ? (
                            <EyeOff size={18} color="#9ca3af" />
                        ) : (
                            <Eye size={18} color="#9ca3af" />
                        )}
                    </Pressable>
                </View>

                {/* Confirm Password (sign up only) */}
                {mode === 'signup' && (
                    <View style={styles.inputWrap}>
                        <View style={styles.inputIcon}>
                            <Lock size={18} color="#9ca3af" />
                        </View>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Confirm password"
                            placeholderTextColor="#9ca3af"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                    </View>
                )}

                {/* Primary CTA */}
                <Pressable
                    onPress={handleEmailAuth}
                    disabled={loading}
                    style={({ pressed }) => [styles.primaryBtn, { opacity: pressed ? 0.9 : 1 }]}
                >
                    <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.primaryBtnGrad}>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.primaryBtnText}>
                                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                            </Text>
                        )}
                    </LinearGradient>
                </Pressable>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google OAuth */}
                <Pressable
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    style={({ pressed }) => [styles.googleBtn, { opacity: pressed ? 0.8 : 1 }]}
                >
                    <Text style={styles.googleBtnText}>🔵  Continue with Google</Text>
                </Pressable>

                <Text style={styles.terms}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 60,
    },
    logoWrap: {
        width: 96,
        height: 96,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 10,
    },
    logoIconBg: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subheading: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 40,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        padding: 4,
        marginBottom: 32,
        width: '100%',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9ca3af',
    },
    tabTextActive: {
        color: '#16a34a',
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        marginBottom: 16,
        width: '100%',
        paddingRight: 8,
    },
    inputIcon: {
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        paddingVertical: 18,
        paddingRight: 16,
    },
    eyeBtn: {
        padding: 8,
    },
    primaryBtn: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
    },
    primaryBtnGrad: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 28,
        width: '100%',
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '600',
    },
    googleBtn: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    googleBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        letterSpacing: 0.2,
    },
    terms: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 18,
    },
});
