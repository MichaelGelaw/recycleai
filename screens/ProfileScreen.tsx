import { LinearGradient } from 'expo-linear-gradient';
import {
    Award,
    Bell,
    Check,
    ChevronRight,
    CircleUser,
    Flame,
    Leaf,
    LogOut,
    Moon,
    Recycle,
    Settings,
    Shield,
    Sun
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { ScreenType } from '../types';
import { getProfile } from '../utils/db';

const { width, height } = Dimensions.get('window');

interface Props {
    onNavigate: (screen: ScreenType) => void;
}

export default function ProfileScreen({ onNavigate }: Props) {
    const { user, signOut } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [profileStats, setProfileStats] = useState<{ eco_score: number; items_saved: number } | null>(null);

    useEffect(() => {
        if (!user) return;
        getProfile(user.id).then(p => {
            if (p) setProfileStats({ eco_score: p.eco_score ?? 0, items_saved: p.items_saved ?? 0 });
        });
    }, [user]);

    const displayName = user?.user_metadata?.full_name
        ?? user?.user_metadata?.name
        ?? user?.email?.split('@')[0]
        ?? 'Eco Warrior';

    const confirmLogout = async () => {
        setShowLogoutConfirm(false);
        await signOut();
        // AuthContext will set session to null → AuthScreen will be shown automatically
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <Pressable
                        onPress={() => setShowSettingsModal(true)}
                        style={({ pressed }) => [
                            styles.settingsBtn,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                    >
                        <Settings size={20} color={theme.colors.ecoMuted} />
                    </Pressable>
                </View>

                {/* User Info Card */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.userCard}>
                    <View style={styles.userCardGlow} />

                    <View style={styles.userInfo}>
                        <LinearGradient
                            colors={[theme.colors.ecoPrimary, theme.colors.ecoSecondary]}
                            style={styles.avatarBg}
                        >
                            <CircleUser size={48} color="white" strokeWidth={1.5} />
                        </LinearGradient>

                        <Text style={styles.userName}>{displayName}</Text>
                        <Text style={styles.userTitle}>Guardian of the Forest</Text>

                        <View style={styles.badgesRow}>
                            <View style={styles.levelBadge}>
                                <Award size={14} color={theme.colors.ecoPrimary} />
                                <Text style={styles.levelBadgeText}>LEVEL 5</Text>
                            </View>
                            <View style={styles.streakBadge}>
                                <Flame size={14} color="#d97706" />
                                <Text style={styles.streakBadgeText}>12 DAY STREAK</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Impact Stats */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                    <Text style={styles.sectionTitle}>ENVIRONMENTAL IMPACT</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <View style={styles.statIconBg}>
                                <Leaf size={24} color={theme.colors.ecoPrimary} />
                            </View>
                            <Text style={styles.statValue}>{profileStats?.eco_score ?? 0}</Text>
                            <Text style={styles.statLabel}>ECO SCORE</Text>
                        </View>
                        <View style={[styles.statBox, { borderColor: '#10b981' }]}>
                            <View style={[styles.statIconBg, { backgroundColor: '#ecfdf5' }]}>
                                <Recycle size={24} color="#047857" />
                            </View>
                            <Text style={styles.statValue}>{profileStats?.items_saved ?? 0}</Text>
                            <Text style={styles.statLabel}>ITEMS SAVED</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Achievements */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
                        <Pressable onPress={() => setShowAchievementModal(true)}>
                            <Text style={styles.sectionAction}>VIEW ALL</Text>
                        </Pressable>
                    </View>

                    <View style={styles.achievementsGrid}>
                        <AchievementMiniCard icon="🌱" title="First Scan" unlocked={true} />
                        <AchievementMiniCard icon="♻️" title="Recycle Pro" progress={45} total={50} />
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Settings Modal Built with React Native Modal */}
            <Modal visible={showSettingsModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setShowSettingsModal(false)} />
                    <View style={styles.modalContent}>
                        <View style={styles.modalDragIndicator} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Settings</Text>
                            <Pressable onPress={() => setShowSettingsModal(false)} style={styles.modalCloseBtn}>
                                <ChevronRight size={20} color={theme.colors.ecoMuted} style={{ transform: [{ rotate: '90deg' }] }} />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                            <Text style={styles.settingsSectionTitle}>ACCOUNT</Text>
                            <View style={styles.settingsGroup}>
                                <SettingsItem icon={<CircleUser size={20} color={theme.colors.ecoMuted} />} label="Edit Profile" onPress={() => alert("Profile editing coming soon!")} />
                                <View style={styles.divider} />
                                <SettingsItem
                                    icon={<Bell size={20} color={theme.colors.ecoMuted} />}
                                    label="Notifications"
                                    rightElement={<Toggle enabled={notificationsEnabled} onChange={setNotificationsEnabled} />}
                                    onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                                />
                                <View style={styles.divider} />
                                <SettingsItem
                                    icon={darkMode ? <Moon size={20} color={theme.colors.ecoMuted} /> : <Sun size={20} color={theme.colors.ecoMuted} />}
                                    label="Dark Mode"
                                    rightElement={<Toggle enabled={darkMode} onChange={setDarkMode} />}
                                    onPress={() => setDarkMode(!darkMode)}
                                />
                            </View>

                            <Text style={styles.settingsSectionTitle}>SUPPORT</Text>
                            <View style={styles.settingsGroup}>
                                <SettingsItem icon={<Shield size={20} color={theme.colors.ecoMuted} />} label="Help Center" onPress={() => alert("Help center is currently offline.")} />
                                <View style={styles.divider} />
                                <SettingsItem icon={<Leaf size={20} color={theme.colors.ecoMuted} />} label="About EcoAdvisor" onPress={() => alert("EcoAdvisor v1.0.0 - Built for a greener future.")} />
                            </View>

                            <Pressable
                                onPress={() => setShowLogoutConfirm(true)}
                                style={({ pressed }) => [
                                    styles.logoutBtn,
                                    { opacity: pressed ? 0.7 : 1 }
                                ]}
                            >
                                <LogOut size={20} color="#dc2626" />
                                <Text style={styles.logoutBtnText}>Log Out</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Logout Confirm Modal */}
            <Modal visible={showLogoutConfirm} transparent={true} animationType="fade">
                <View style={styles.centeredModalOverlay}>
                    <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setShowLogoutConfirm(false)} />
                    <View style={styles.centeredModalContent}>
                        <Text style={styles.centeredModalTitle}>Log Out?</Text>
                        <Text style={styles.centeredModalDesc}>Are you sure you want to log out of your eco-account?</Text>
                        <View style={styles.modalActionRow}>
                            <Pressable style={styles.cancelBtn} onPress={() => setShowLogoutConfirm(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.confirmBtn} onPress={confirmLogout}>
                                <Text style={styles.confirmBtnText}>Log Out</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Achievement Modal */}
            <Modal visible={showAchievementModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setShowAchievementModal(false)} />
                    <View style={[styles.modalContent, { height: height * 0.7 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Achievements</Text>
                            <View style={styles.achievementIconBg}>
                                <Award size={20} color={theme.colors.ecoPrimary} />
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                            <AchievementCard title="First Scan" description="You identified your first item!" unlocked={true} />
                            <AchievementCard title="Recycle Pro" description="Recycle 50 items." progress={45} total={50} />
                            <AchievementCard title="DIY Master" description="Complete 10 upcycling projects." progress={3} total={10} />
                            <AchievementCard title="Eco Explorer" description="Visit 5 recycling centers." progress={1} total={5} />
                        </ScrollView>

                        <Pressable onPress={() => setShowAchievementModal(false)} style={styles.closeBtn}>
                            <Text style={styles.closeBtnText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Subcomponents

function AchievementMiniCard({ icon, title, unlocked = false, progress, total }: { icon: string, title: string, unlocked?: boolean, progress?: number, total?: number }) {
    const percent = progress && total ? (progress / total) * 100 : 0;

    return (
        <View style={styles.achievementMiniCard}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{icon}</Text>
            <Text style={styles.achievementTitle}>{title}</Text>
            {unlocked ? (
                <View style={styles.unlockedRow}>
                    <Check size={10} color="#059669" />
                    <Text style={styles.unlockedText}>UNLOCKED</Text>
                </View>
            ) : (
                <View style={styles.progressSection}>
                    <View style={styles.progressRow}>
                        <Text style={styles.progressText}>{progress}/{total}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                    </View>
                </View>
            )}
        </View>
    );
}

function AchievementCard({ title, description, unlocked = false, progress, total }: { title: string, description: string, unlocked?: boolean, progress?: number, total?: number }) {
    const percent = progress && total ? (progress / total) * 100 : 0;

    return (
        <View style={[styles.achievementCard, unlocked ? styles.achievementUnlocked : styles.achievementLocked]}>
            <View style={styles.achievementReqRow}>
                <Text style={[styles.achievementCardTitle, { color: unlocked ? '#065f46' : '#1f2937' }]}>{title}</Text>
                {unlocked && (
                    <View style={styles.achievementCheck}>
                        <Check size={12} color="white" />
                    </View>
                )}
            </View>
            <Text style={styles.achievementDesc}>{description}</Text>

            {!unlocked && progress !== undefined && total !== undefined && (
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>PROGRESS</Text>
                        <Text style={styles.progressText}>{progress}/{total}</Text>
                    </View>
                    <View style={[styles.progressBarBg, { height: 6, backgroundColor: '#e5e7eb' }]}>
                        <Animated.View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                    </View>
                </View>
            )}
        </View>
    );
}

function SettingsItem({ icon, label, rightElement, onPress }: { icon: React.ReactNode, label: string, rightElement?: React.ReactNode, onPress?: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.settingsItem,
                { backgroundColor: pressed && onPress ? '#f3f4f6' : 'transparent' }
            ]}
        >
            <View style={styles.settingsItemLeft}>
                <View style={styles.settingsIconBg}>
                    {icon}
                </View>
                <Text style={styles.settingsLabel}>{label}</Text>
            </View>
            {rightElement || <ChevronRight size={20} color="#9ca3af" />}
        </Pressable>
    );
}

function Toggle({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) {
    return (
        <Pressable
            onPress={() => onChange(!enabled)}
            style={[styles.toggleBg, { backgroundColor: enabled ? theme.colors.ecoPrimary : '#e5e7eb' }]}
        >
            <View style={[styles.toggleNob, { transform: [{ translateX: enabled ? 22 : 2 }] }]} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.ecoBg,
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: -0.5,
    },
    settingsBtn: {
        width: 48,
        height: 48,
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    userCard: {
        backgroundColor: 'white',
        marginHorizontal: 24,
        borderRadius: 48,
        padding: 32,
        borderColor: theme.colors.ecoMint,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.03,
        shadowRadius: 30,
        elevation: 4,
        overflow: 'hidden',
        marginBottom: 32,
    },
    userCardGlow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 192,
        height: 192,
        backgroundColor: 'rgba(212, 237, 219, 0.2)',
        borderRadius: 96,
    },
    userInfo: {
        alignItems: 'center',
        zIndex: 10,
    },
    avatarBg: {
        width: 96,
        height: 96,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '3deg' }],
        marginBottom: 16,
        shadowColor: theme.colors.ecoPrimary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
    },
    userTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
        marginTop: 4,
        marginBottom: 16,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 12,
    },
    levelBadge: {
        backgroundColor: theme.colors.ecoMint,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(20, 54, 33, 0.1)',
    },
    levelBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: 1,
    },
    streakBadge: {
        backgroundColor: '#fffbeb',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    streakBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#b45309',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 2,
        marginBottom: 20,
        marginLeft: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    sectionAction: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: 1.5,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    statIconBg: {
        width: 48,
        height: 48,
        backgroundColor: theme.colors.ecoMint,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
    },
    achievementsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    achievementMiniCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    achievementTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoInk,
        marginBottom: 4,
    },
    unlockedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    unlockedText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#059669',
        letterSpacing: 1.5,
    },
    progressSection: {
        gap: 6,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#f3f4f6',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.ecoPrimary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 32,
        maxHeight: height * 0.9,
    },
    modalDragIndicator: {
        width: 48,
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    modalCloseBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsSectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9ca3af',
        letterSpacing: 1.5,
        marginBottom: 16,
        marginLeft: 8,
    },
    settingsGroup: {
        backgroundColor: '#f9fafb',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        overflow: 'hidden',
        marginBottom: 32,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingsIconBg: {
        width: 40,
        height: 40,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 16,
    },
    toggleBg: {
        width: 48,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleNob: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fef2f2',
        padding: 20,
        borderRadius: 24,
    },
    logoutBtnText: {
        color: '#dc2626',
        fontWeight: 'bold',
        fontSize: 16,
    },
    centeredModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    centeredModalContent: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 32,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    centeredModalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    centeredModalDesc: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
    },
    modalActionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontWeight: 'bold',
        color: '#4b5563',
    },
    confirmBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmBtnText: {
        fontWeight: 'bold',
        color: 'white',
    },
    achievementIconBg: {
        width: 40,
        height: 40,
        backgroundColor: theme.colors.ecoMint,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    achievementCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    achievementUnlocked: {
        backgroundColor: '#ecfdf5',
        borderColor: '#d1fae5',
    },
    achievementLocked: {
        backgroundColor: '#f9fafb',
        borderColor: '#f3f4f6',
        opacity: 0.7,
    },
    achievementReqRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    achievementCardTitle: {
        fontWeight: 'bold',
    },
    achievementCheck: {
        backgroundColor: '#10b981',
        padding: 2,
        borderRadius: 10,
    },
    achievementDesc: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    closeBtn: {
        marginTop: 32,
        padding: 16,
        borderRadius: 16,
        backgroundColor: theme.colors.ecoPrimary,
        alignItems: 'center',
    },
    closeBtnText: {
        fontWeight: 'bold',
        color: 'white',
    }
});
