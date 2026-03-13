import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Clock, Filter, MapPin, Navigation, Phone, Search, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { theme } from '../theme';
import { RecyclingCenter, ScreenType } from '../types';

const { width, height } = Dimensions.get('window');

interface Props {
    onNavigate: (screen: ScreenType) => void;
}

const mockCenters: RecyclingCenter[] = [
    {
        id: '1',
        name: 'EcoHub City Center',
        address: '123 Green Ave, Downtown',
        distance: '0.8 miles',
        acceptedMaterials: ['Plastic', 'Glass', 'Paper', 'Electronics'],
        rating: 4.8,
        isOpen: true
    },
    {
        id: '2',
        name: 'Metro Scrap & Recycle',
        address: '456 Industrial Pkwy',
        distance: '2.4 miles',
        acceptedMaterials: ['Metal', 'Electronics', 'Large Appliances'],
        rating: 4.2,
        isOpen: false
    },
    {
        id: '3',
        name: 'Community Compost & Glass',
        address: '789 Neighborhood Ln',
        distance: '1.2 miles',
        acceptedMaterials: ['Glass', 'Organic', 'Paper'],
        rating: 4.9,
        isOpen: true
    }
];

export default function MapScreen({ onNavigate }: Props) {
    const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);

    // Position for the fake map pins
    const getMarkerStyle = (index: number) => {
        switch (index) {
            case 0: return { top: height * 0.3, left: width * 0.25 };
            case 1: return { top: height * 0.5, right: width * 0.25 };
            case 2: return { bottom: height * 0.35, left: width * 0.45 };
            default: return { top: height * 0.4, left: width * 0.5 };
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.container}>

            {/* Simulated Map Background */}
            <View style={StyleSheet.absoluteFillObject}>
                <Image
                    source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" }}
                    style={styles.mapBg}
                />
                <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.2)', theme.colors.ecoBg]}
                    locations={[0, 0.4, 0.9]}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            {/* Floating Header & Search */}
            <View style={styles.headerArea}>
                <View style={styles.searchRow}>
                    <Pressable
                        onPress={() => onNavigate('home')}
                        style={({ pressed }) => [
                            styles.backBtn,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                    >
                        <ChevronLeft size={20} color="#374151" />
                    </Pressable>

                    <View style={styles.searchContainer}>
                        <Search size={18} color="#9ca3af" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search recycling centers..."
                            placeholderTextColor="#9ca3af"
                            style={styles.searchInput}
                        />
                    </View>

                    <Pressable style={styles.filterBtn}>
                        <Filter size={20} color="#374151" />
                    </Pressable>
                </View>

                {/* Quick Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {['All', 'Plastic', 'Glass', 'Electronics', 'Metal'].map((filter, i) => (
                        <Pressable
                            key={filter}
                            style={[
                                styles.filterChip,
                                i === 0 ? styles.filterChipActive : styles.filterChipInactive
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                i === 0 ? styles.filterTextActive : styles.filterTextInactive
                            ]}>
                                {filter}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Map Markers */}
            <View style={styles.markersLayer}>
                {mockCenters.map((center, index) => {
                    const isSelected = selectedCenter?.id === center.id;
                    return (
                        <Pressable
                            key={center.id}
                            style={[styles.markerContainer, getMarkerStyle(index)]}
                            onPress={() => setSelectedCenter(center)}
                        >
                            <View style={[
                                styles.markerBubble,
                                isSelected ? styles.markerBubbleActive : styles.markerBubbleInactive
                            ]}>
                                <MapPin
                                    size={24}
                                    color={isSelected ? theme.colors.ecoPrimary : 'white'}
                                    fill={isSelected ? 'white' : theme.colors.ecoPrimary}
                                />
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* Bottom Sheet for Selected Center */}
            {selectedCenter && (
                <Animated.View
                    entering={SlideInDown.springify().damping(25).stiffness(200)}
                    exiting={SlideOutDown.duration(200)}
                    style={styles.bottomSheet}
                >
                    <View style={styles.dragIndicator} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>

                        <View style={styles.sheetHeaderRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.centerName} numberOfLines={1}>{selectedCenter.name}</Text>
                                <Text style={styles.centerAddress} numberOfLines={1}>{selectedCenter.address}</Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                <Text style={styles.ratingText}>{selectedCenter.rating}</Text>
                            </View>
                        </View>

                        <View style={styles.statusRow}>
                            <View style={styles.statusItem}>
                                <Navigation size={16} color={theme.colors.ecoPrimary} />
                                <Text style={styles.statusText}>{selectedCenter.distance}</Text>
                            </View>
                            <View style={styles.statusItem}>
                                <Clock size={16} color={selectedCenter.isOpen ? '#10b981' : '#f43f5e'} />
                                <Text style={[
                                    styles.statusText,
                                    { color: selectedCenter.isOpen ? '#059669' : '#e11d48' }
                                ]}>
                                    {selectedCenter.isOpen ? 'Open Now' : 'Closed'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.materialsSection}>
                            <Text style={styles.materialsHeader}>ACCEPTED MATERIALS</Text>
                            <View style={styles.materialsGrid}>
                                {selectedCenter.acceptedMaterials.map(material => (
                                    <View key={material} style={styles.materialChip}>
                                        <Text style={styles.materialText}>{material}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.actionRow}>
                            <Pressable style={styles.directionsBtn}>
                                <Navigation size={18} color="white" />
                                <Text style={styles.directionsText}>Directions</Text>
                            </Pressable>

                            <Pressable style={styles.phoneBtn}>
                                <Phone size={20} color="#374151" />
                            </Pressable>
                        </View>

                    </ScrollView>
                </Animated.View>
            )}

            {/* Invisible overlay to dismiss sheet on tap outside */}
            {selectedCenter && (
                <Pressable
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="auto"
                    onPress={() => setSelectedCenter(null)}
                />
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },
    mapBg: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    headerArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 24,
        zIndex: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'white',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 24,
        height: 44,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'white',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.ecoInk,
    },
    filterBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'white',
    },
    filtersScroll: {
        gap: 8,
        paddingBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    filterChipActive: {
        backgroundColor: theme.colors.ecoPrimary,
        borderColor: theme.colors.ecoPrimary,
    },
    filterChipInactive: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: 'white',
    },
    filterText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    filterTextActive: {
        color: 'white',
    },
    filterTextInactive: {
        color: '#4b5563',
    },
    markersLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },
    markerContainer: {
        position: 'absolute',
        width: 48,
        height: 48,
        marginLeft: -24, // offset center
        marginTop: -24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerBubble: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 6,
    },
    markerBubbleActive: {
        backgroundColor: theme.colors.ecoPrimary,
        transform: [{ scale: 1.15 }],
    },
    markerBubbleInactive: {
        backgroundColor: 'white',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 40,
        elevation: 20,
        zIndex: 30,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    dragIndicator: {
        width: 48,
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    sheetContent: {
        paddingHorizontal: 24,
        paddingBottom: 100, // account for floating nav manually
    },
    sheetHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    centerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    centerAddress: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fffbeb',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#b45309',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
    materialsSection: {
        marginBottom: 24,
    },
    materialsHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9ca3af',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    materialsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    materialChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    materialText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    directionsBtn: {
        flex: 1,
        backgroundColor: theme.colors.ecoPrimary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#1b4332',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 4,
    },
    directionsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    phoneBtn: {
        width: 56,
        height: 56,
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
