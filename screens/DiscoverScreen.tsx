import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Filter, Heart, Leaf, MessageCircle, Search, Share2, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { theme } from '../theme';
import { CommunityPost, ScreenType, SwapSuggestion } from '../types';

const { width } = Dimensions.get('window');

interface Props {
    onNavigate: (screen: ScreenType) => void;
}

const mockPosts: CommunityPost[] = [
    {
        id: '1',
        userName: 'EcoWarrior_99',
        userAvatar: 'https://i.pravatar.cc/100?img=1',
        image: 'https://picsum.photos/seed/recycle1/600/400',
        title: 'Turned old glass jars into a vertical herb garden!',
        likes: 245,
        timeAgo: '2h ago'
    },
    {
        id: '2',
        userName: 'GreenThumb_Sarah',
        userAvatar: 'https://i.pravatar.cc/100?img=5',
        image: 'https://picsum.photos/seed/recycle2/600/400',
        title: 'Composting bin made from a discarded plastic tub.',
        likes: 189,
        timeAgo: '5h ago'
    },
    {
        id: '3',
        userName: 'UpcycleKing',
        userAvatar: 'https://i.pravatar.cc/100?img=8',
        image: 'https://picsum.photos/seed/recycle3/600/400',
        title: 'Denim tote bags from old jeans. No waste!',
        likes: 532,
        timeAgo: '1d ago'
    }
];

const mockSwaps: SwapSuggestion[] = [
    {
        id: '1',
        from: 'Plastic Containers',
        to: 'Glass Containers',
        description: 'Glass is infinitely recyclable and doesn\'t leach chemicals.',
        imageUrl: 'https://picsum.photos/seed/swap1/400/400'
    },
    {
        id: '2',
        from: 'Paper Towels',
        to: 'Swedish Dishcloths',
        description: 'One dishcloth replaces 17 rolls of paper towels.',
        imageUrl: 'https://picsum.photos/seed/swap2/400/400'
    },
    {
        id: '3',
        from: 'Plastic Wrap',
        to: 'Beeswax Wraps',
        description: 'Natural, breathable, and compostable alternative to cling film.',
        imageUrl: 'https://picsum.photos/seed/swap3/400/400'
    }
];

const mockContributors = [
    { name: 'EcoWarrior', points: 2450, avatar: 'https://i.pravatar.cc/100?img=1' },
    { name: 'GreenThumb', points: 1890, avatar: 'https://i.pravatar.cc/100?img=5' },
    { name: 'UpcycleKing', points: 1532, avatar: 'https://i.pravatar.cc/100?img=8' },
    { name: 'EarthLover', points: 1200, avatar: 'https://i.pravatar.cc/100?img=4' },
];

export default function DiscoverScreen({ onNavigate }: Props) {
    const [activeTab, setActiveTab] = useState<'feed' | 'swaps'>('feed');

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.title}>Discover</Text>
                            <Text style={styles.subtitle}>Explore the Eco-Community</Text>
                        </View>
                        <Pressable style={styles.filterBtn}>
                            <Filter size={20} color={theme.colors.ecoPrimary} />
                        </Pressable>
                    </View>

                    {/* Daily Tip Card */}
                    <Animated.View entering={FadeInDown.delay(100)} style={styles.tipCard}>
                        <LinearGradient
                            colors={[theme.colors.ecoSecondary, theme.colors.ecoPrimary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <View style={styles.tipGlow} />

                        <View style={styles.tipContent}>
                            <View style={styles.tipHeader}>
                                <View style={styles.tipIconBg}>
                                    <Sparkles size={16} color="white" />
                                </View>
                                <Text style={styles.tipLabel}>DAILY ECO-TIP</Text>
                            </View>
                            <Text style={styles.tipTitle}>Use cold water for laundry</Text>
                            <Text style={styles.tipDesc}>
                                Switching to cold water can save up to 90% of the energy used by a washing machine.
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <Pressable
                            onPress={() => setActiveTab('feed')}
                            style={[styles.tabBtn, activeTab === 'feed' && styles.tabBtnActive]}
                        >
                            <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>COMMUNITY</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveTab('swaps')}
                            style={[styles.tabBtn, activeTab === 'swaps' && styles.tabBtnActive]}
                        >
                            <Text style={[styles.tabText, activeTab === 'swaps' && styles.tabTextActive]}>ECO SWAPS</Text>
                        </Pressable>
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Search size={20} color={theme.colors.ecoMuted} style={styles.searchIcon} />
                        <TextInput
                            placeholder={activeTab === 'feed' ? "Search projects..." : "Search swaps..."}
                            placeholderTextColor={theme.colors.ecoMuted}
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Content feed based on Tab */}
                <View style={styles.contentArea}>
                    {activeTab === 'feed' ? (
                        <Animated.View key="feed" entering={FadeIn.duration(300)} exiting={FadeOutUp}>

                            {/* Trending Section */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>TRENDING CHALLENGES</Text>
                                    <Text style={styles.sectionAction}>JOIN ALL</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                                    {[
                                        { tag: '#ZeroWasteWeek', participants: '2.4k', color: '#ecfdf5' },
                                        { tag: '#HerbGardenDIY', participants: '1.8k', color: '#eff6ff' },
                                        { tag: '#PlasticFreeJuly', participants: '5.1k', color: '#fffbeb' }
                                    ].map((item, i) => (
                                        <View key={i} style={[styles.trendingCard, { backgroundColor: item.color }]}>
                                            <Text style={styles.trendingTag}>{item.tag}</Text>
                                            <Text style={styles.trendingParticipants}>{item.participants} PARTICIPANTS</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Top Contributors */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { marginLeft: 24, marginBottom: 16 }]}>TOP CONTRIBUTORS</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                                    {mockContributors.map((user, i) => (
                                        <View key={i} style={styles.contributorItem}>
                                            <View style={styles.contributorAvatarBg}>
                                                <Image source={{ uri: user.avatar }} style={styles.contributorAvatar} />
                                            </View>
                                            <Text style={styles.contributorName}>{user.name}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Feed Posts */}
                            <View style={styles.postsContainer}>
                                {mockPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </View>

                        </Animated.View>
                    ) : (
                        <Animated.View key="swaps" entering={FadeIn.duration(300)} exiting={FadeOutUp}>

                            <View style={styles.whySwapCard}>
                                <Text style={styles.whySwapTitle}>Why Swap?</Text>
                                <Text style={styles.whySwapDesc}>
                                    Small changes in your daily routine can lead to massive environmental impact over time. Start your journey with these simple swaps.
                                </Text>
                            </View>

                            <View style={[styles.sectionHeader, { paddingHorizontal: 24, marginBottom: 16 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Leaf size={16} color={theme.colors.ecoPrimary} />
                                    <Text style={styles.sectionTitle}>POPULAR SWAPS</Text>
                                </View>
                            </View>

                            <View style={styles.swapsContainer}>
                                {mockSwaps.map((swap) => (
                                    <SwapCard key={swap.id} swap={swap} />
                                ))}
                            </View>

                        </Animated.View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const PostCard = ({ post }: { post: CommunityPost }) => {
    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.postAuthorInfo}>
                    <View style={styles.postAvatarBg}>
                        <Image source={{ uri: post.userAvatar }} style={styles.postAvatar} />
                    </View>
                    <View>
                        <Text style={styles.postAuthorName}>{post.userName}</Text>
                        <Text style={styles.postTime}>{post.timeAgo}</Text>
                    </View>
                </View>
                <View style={styles.postSparkleBtn}>
                    <Sparkles size={16} color={theme.colors.ecoPrimary} />
                </View>
            </View>

            <View style={styles.postImageContainer}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.postImageOverlay}
                />
                <Text style={styles.postTitle}>{post.title}</Text>
            </View>

            <View style={styles.postActions}>
                <View style={styles.postActionLeft}>
                    <Pressable style={styles.actionBtn}>
                        <Heart size={20} color={theme.colors.ecoMuted} />
                        <Text style={styles.actionCount}>{post.likes}</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn}>
                        <MessageCircle size={20} color={theme.colors.ecoMuted} />
                        <Text style={styles.actionCount}>12</Text>
                    </Pressable>
                </View>
                <Pressable>
                    <Share2 size={20} color={theme.colors.ecoMuted} />
                </Pressable>
            </View>
        </View>
    );
};

const SwapCard = ({ swap }: { swap: SwapSuggestion }) => {
    const [isSaved, setIsSaved] = useState(false);

    return (
        <View style={styles.swapCard}>
            <View style={styles.swapHeader}>
                <View style={styles.swapBadgeFrom}>
                    <Text style={styles.swapBadgeTextFrom}>{swap.from}</Text>
                </View>
                <ArrowRight size={20} color={theme.colors.ecoMuted} style={{ opacity: 0.3, marginHorizontal: 16 }} />
                <View style={styles.swapBadgeTo}>
                    <Text style={styles.swapBadgeTextTo}>{swap.to}</Text>
                </View>
            </View>

            <View style={styles.swapBody}>
                <View style={styles.swapImageBg}>
                    <Image source={{ uri: swap.imageUrl }} style={styles.swapImage} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.swapInsightLabel}>IMPACT INSIGHT</Text>
                    <Text style={styles.swapInsightDesc}>{swap.description}</Text>
                </View>
            </View>

            <View style={styles.swapFooter}>
                <View style={styles.swapImpact}>
                    <View style={styles.swapImpactIconBg}>
                        <Sparkles size={14} color="#059669" />
                    </View>
                    <Text style={styles.swapImpactText}>SAVES ~50KG CO₂/YR</Text>
                </View>
                <Pressable
                    onPress={() => setIsSaved(!isSaved)}
                    style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
                >
                    <Heart size={14} color={isSaved ? 'white' : theme.colors.ecoMuted} fill={isSaved ? 'white' : 'transparent'} />
                    <Text style={[styles.saveBtnText, isSaved && styles.saveBtnTextActive]}>
                        {isSaved ? 'SAVED' : 'SAVE SWAP'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.ecoBg,
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
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
    filterBtn: {
        width: 48,
        height: 48,
        backgroundColor: 'white',
        borderRadius: 16,
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
    tipCard: {
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: 32,
        shadowColor: theme.colors.ecoPrimary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 10,
    },
    tipGlow: {
        position: 'absolute',
        top: -24,
        right: -24,
        width: 128,
        height: 128,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 64,
    },
    tipContent: {
        padding: 24,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    tipIconBg: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1.5,
    },
    tipTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    tipDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 18,
        fontWeight: '500',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        marginBottom: 24,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBtnActive: {
        backgroundColor: theme.colors.ecoPrimary,
        shadowColor: theme.colors.ecoPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    tabText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
    },
    tabTextActive: {
        color: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        borderRadius: 24,
        paddingHorizontal: 20,
        height: 56,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.ecoInk,
    },
    contentArea: {
        marginTop: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 2,
    },
    sectionAction: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: 1.5,
    },
    horizontalScroll: {
        paddingHorizontal: 24,
        gap: 16,
    },
    trendingCard: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        minWidth: 180,
    },
    trendingTag: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    trendingParticipants: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        marginTop: 4,
        letterSpacing: 1.5,
    },
    contributorItem: {
        alignItems: 'center',
        gap: 8,
    },
    contributorAvatarBg: {
        width: 64,
        height: 64,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.colors.ecoMint,
        padding: 2,
        backgroundColor: 'white',
    },
    contributorAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    contributorName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    postsContainer: {
        paddingHorizontal: 24,
        gap: 24,
    },
    postCard: {
        backgroundColor: 'white',
        borderRadius: 48,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 4,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    postAuthorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    postAvatarBg: {
        width: 40,
        height: 40,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.ecoMint,
        overflow: 'hidden',
    },
    postAvatar: {
        width: '100%',
        height: '100%',
    },
    postAuthorName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
    },
    postTime: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
        marginTop: 2,
    },
    postSparkleBtn: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(212, 237, 219, 0.4)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postImageContainer: {
        aspectRatio: 4 / 3,
        width: '100%',
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    postImageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    postTitle: {
        position: 'absolute',
        bottom: 16,
        left: 20,
        right: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 24,
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
    },
    postActionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
    },
    whySwapCard: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        marginHorizontal: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    whySwapTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        marginBottom: 8,
    },
    whySwapDesc: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.ecoMuted,
        lineHeight: 20,
    },
    swapsContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    swapCard: {
        backgroundColor: 'white',
        borderRadius: 48,
        borderWidth: 1,
        borderColor: theme.colors.ecoMint,
        overflow: 'hidden',
    },
    swapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 32,
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    swapBadgeFrom: {
        flex: 1,
        backgroundColor: '#fff1f2',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ffe4e6',
        alignItems: 'center',
    },
    swapBadgeTextFrom: {
        color: '#9f1239',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    swapBadgeTo: {
        flex: 1,
        backgroundColor: theme.colors.ecoMint,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(46, 112, 72, 0.1)',
        alignItems: 'center',
    },
    swapBadgeTextTo: {
        color: theme.colors.ecoPrimary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    swapBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    swapImageBg: {
        width: 96,
        height: 96,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: theme.colors.ecoMint,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        transform: [{ rotate: '-2deg' }],
    },
    swapImage: {
        width: '100%',
        height: '100%',
    },
    swapInsightLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.ecoPrimary,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    swapInsightDesc: {
        fontSize: 14,
        color: theme.colors.ecoMuted,
        lineHeight: 22,
        fontWeight: '500',
    },
    swapFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    swapImpact: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    swapImpactIconBg: {
        width: 32,
        height: 32,
        backgroundColor: '#ecfdf5',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    swapImpactText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#059669',
        letterSpacing: 1.5,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    saveBtnActive: {
        backgroundColor: theme.colors.ecoPrimary,
    },
    saveBtnText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.ecoMuted,
        letterSpacing: 1.5,
    },
    saveBtnTextActive: {
        color: 'white',
    }
});
