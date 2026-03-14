import { ArrowRight, ChevronLeft, Leaf, Search } from 'lucide-react-native';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme';
import { ScreenType, SwapSuggestion } from '../types';

interface Props {
    onNavigate: (screen: ScreenType) => void;
    swaps: SwapSuggestion[];
}

const mockSwaps: SwapSuggestion[] = [
    {
        id: '1',
        from: 'Plastic Containers',
        to: 'Glass Containers',
        description: 'Glass is infinitely recyclable, doesn\'t leach chemicals, and lasts longer than plastic.',
        imageUrl: 'https://picsum.photos/seed/swap1/400/400'
    },
    {
        id: '2',
        from: 'Plastic Bags',
        to: 'Cloth Totes',
        description: 'A single cloth bag can replace hundreds of single-use plastic bags over its lifetime.',
        imageUrl: 'https://picsum.photos/seed/swap2/400/400'
    },
    {
        id: '3',
        from: 'Disposable Bottles',
        to: 'Stainless Steel',
        description: 'Keeps drinks cold/hot longer and prevents thousands of plastic bottles from entering landfills.',
        imageUrl: 'https://picsum.photos/seed/swap3/400/400'
    },
    {
        id: '4',
        from: 'Paper Towels',
        to: 'Swedish Dishcloths',
        description: 'One dishcloth replaces 17 rolls of paper towels and is fully compostable.',
        imageUrl: 'https://picsum.photos/seed/swap4/400/400'
    }
];

export default function SwapsScreen({ onNavigate, swaps }: Props) {
    const displaySwaps = swaps && swaps.length > 0 ? swaps : mockSwaps;
    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Pressable
                        onPress={() => onNavigate('home')}
                        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
                    >
                        <ChevronLeft size={20} color="#374151" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Eco Swaps</Text>
                </View>

                <View style={styles.searchContainer}>
                    <Search color="#9ca3af" size={20} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search for an item..."
                        placeholderTextColor="#9ca3af"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Leaf size={16} color={theme.colors.ecoPrimary} />
                        <Text style={styles.sectionTitle}>Popular Swaps</Text>
                    </View>
                    <View style={styles.itemCountBadge}>
                        <Text style={styles.itemCountText}>{displaySwaps.length} items</Text>
                    </View>
                </View>

                <View style={styles.swapsList}>
                    {displaySwaps.map((swap, index) => (
                        <Animated.View key={swap.id || index} entering={FadeInDown.duration(400).delay(index * 100)}>
                            <SwapCard swap={swap} />
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </Animated.View>
    );
}

function SwapCard({ swap }: { swap: SwapSuggestion }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.swapDirectionRow}>
                    <View style={[styles.pill, styles.fromPill]}>
                        <Text style={styles.fromPillText}>{swap.from}</Text>
                    </View>
                    <ArrowRight size={20} color="#d1d5db" style={styles.swapArrow} />
                    <View style={[styles.pill, styles.toPill]}>
                        <Text style={styles.toPillText}>{swap.to}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: swap.imageUrl }} style={styles.image} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.whySwitchTitle}>Why switch?</Text>
                        <Text style={styles.description}>{swap.description}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.impactRatingLabel}>Impact Rating</Text>
                <View style={styles.leavesContainer}>
                    <Leaf size={16} color={theme.colors.ecoPrimary} fill={theme.colors.ecoPrimary} />
                    <Leaf size={16} color={theme.colors.ecoPrimary} fill={theme.colors.ecoPrimary} />
                    <Leaf size={16} color={theme.colors.ecoPrimary} fill={theme.colors.ecoPrimary} />
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
    header: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        height: '100%',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100, // accommodate bottom tab bar or safe area
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    itemCountBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    itemCountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9ca3af',
    },
    swapsList: {
        gap: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 4,
    },
    cardContent: {
        padding: 24,
    },
    swapDirectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pill: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    fromPill: {
        backgroundColor: '#fff1f2',
        borderColor: '#ffe4e6',
    },
    fromPillText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9f1239',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    swapArrow: {
        marginHorizontal: 12,
    },
    toPill: {
        backgroundColor: theme.colors.ecoMint,
        borderColor: '#bbf7d0',
    },
    toPillText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    cardBody: {
        flexDirection: 'row',
        gap: 20,
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        backgroundColor: '#f9fafb',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    whySwitchTitle: {
        fontFamily: theme.fonts.display,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 6,
    },
    description: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 18,
        fontWeight: '500',
    },
    cardFooter: {
        backgroundColor: '#f9fafb',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    impactRatingLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    leavesContainer: {
        flexDirection: 'row',
        gap: 6,
    }
});
