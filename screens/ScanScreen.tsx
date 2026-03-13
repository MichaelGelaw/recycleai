import { LinearGradient } from "expo-linear-gradient";
import { Image as ImageIcon, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
// Import Camera
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { theme } from "../theme";
import { AnalysisData, ScreenType } from "../types";

const { width, height } = Dimensions.get("window");

interface Props {
    onNavigate: (screen: ScreenType) => void;
    setScannedImage: (img: string) => void;
    setAnalysisData: (data: AnalysisData) => void;
}

export default function ScanScreen({
    onNavigate,
    setScannedImage,
    setAnalysisData,
}: Props) {
    const [isCapturing, setIsCapturing] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    // Animations
    const scanLineY = useSharedValue(0);
    const spinValue = useSharedValue(0);

    useEffect(() => {
        scanLineY.value = withRepeat(
            withTiming(360, { duration: 3000, easing: Easing.linear }),
            -1,
            true
        );
        spinValue.value = withRepeat(
            withTiming(360, { duration: 1500, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }],
    }));

    const spinnerStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${spinValue.value}deg` }],
    }));

    // Permission check
    if (!permission) return <View style={styles.container} />;
    if (!permission.granted) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.infoText}>We need your permission to show the camera</Text>
                <Pressable style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </Pressable>
            </View>
        );
    }

    const handleCapture = async () => {
        if (cameraRef.current && !isCapturing) {
            try {
                setIsCapturing(true);
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                    skipProcessing: false,
                });

                if (photo) {
                    setScannedImage(photo.uri);
                    simulateAnalysis(); // You can eventually replace this with a real API call
                }
            } catch (error) {
                console.error("Capture failed:", error);
                setIsCapturing(false);
            }
        }
    };

    const simulateAnalysis = () => {
        // Mock data for the demo

        const mockData: AnalysisData = {

            materialType: "PET Plastic Bottle",

            confidence: 92,

            condition: "Reusable",

            recyclabilityScore: 85,

            reasoning: [

                "Shape resembles plastic bottle",

                "Surface transparency detected",

                "Common household plastic material",

            ],

            relatableImpact: {

                label: "Phone Charging",

                value: "3 days",

                icon: "zap",

            },

            impact: {

                wastePrevented: 0.5,

                co2Saved: 0.8,

                waterSaved: 3,

            },

            ideas: [

                {

                    id: "1",

                    title: "Self-Watering Planter",

                    description: "Turn this bottle into a clever self-watering system for your herbs.",

                    difficulty: "Beginner",

                    previewImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400",

                    estimatedTime: "15 mins",

                    materials: ["Plastic Bottle", "Cotton String", "Potting Soil", "Small Plant"],

                    steps: [

                        { stepNumber: 1, instruction: "Clean the bottle thoroughly and remove the label.", imageUrl: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=400" },

                        { stepNumber: 2, instruction: "Cut the bottle in half horizontally.", imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=400" },

                        { stepNumber: 3, instruction: "Invert the top half and place it into the bottom half with a cotton wick.", imageUrl: "https://images.unsplash.com/photo-1544816153-199d88248300?auto=format&fit=crop&q=80&w=400" },

                        { stepNumber: 4, instruction: "Add soil and your plant to the top half, water in the bottom.", imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400" },

                    ],

                },

                {

                    id: "2",

                    title: "Bottle Drip Irrigation",

                    description: "Create a slow-release watering system for your garden.",

                    difficulty: "Intermediate",

                    previewImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4ee88?auto=format&fit=crop&q=80&w=400",

                    estimatedTime: "20 mins",

                    materials: ["Plastic Bottle", "Hammer & Nail", "Water"],

                    steps: [

                        { stepNumber: 1, instruction: "Poke small holes in the bottle cap using a nail.", imageUrl: "https://images.unsplash.com/photo-1520302660447-340ad169718d?auto=format&fit=crop&q=80&w=400" },

                        { stepNumber: 2, instruction: "Fill the bottle with water and screw the cap on tight.", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400" },

                        { stepNumber: 3, instruction: "Bury the bottle upside down near the roots of your plant.", imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=400" },

                    ],

                },

            ],

        };
        setAnalysisData(mockData);
        onNavigate("analysis");
    };

    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Pressable onPress={() => onNavigate("home")} style={styles.iconButton}>
                    <X size={24} color="#fff" />
                </Pressable>
                <View style={styles.statusPill}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.statusText}>AI Vision Active</Text>
                </View>
                <View style={styles.spacer} />
            </View>

            {/* LIVE CAMERA VIEW */}
            <CameraView
                ref={cameraRef}
                style={styles.previewArea}
                facing="back"
                autofocus="on"
            >
                <View style={styles.overlayDarken} />

                <View style={styles.scanningFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />

                    <Animated.View style={[styles.scanLine, scanLineStyle]} />

                    {isCapturing && (
                        <Animated.View entering={FadeIn} style={styles.capturingOverlay}>
                            <Animated.View style={[styles.spinner, spinnerStyle]} />
                        </Animated.View>
                    )}
                </View>
            </CameraView>

            {/* Bottom Controls */}
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)", "#000"]} style={styles.bottomArea}>
                <Text style={styles.instructionsText}>Center the item in the frame to identify materials</Text>
                <View style={styles.controlsRow}>
                    <Pressable style={styles.galleryButton}>
                        <ImageIcon size={24} color="#fff" />
                    </Pressable>

                    <Pressable onPress={handleCapture} disabled={isCapturing} style={styles.captureButtonWrapper}>
                        <View style={styles.captureButtonOuter}>
                            <View style={[styles.captureButtonInner, isCapturing && styles.captureButtonInnerActive]}>
                                {isCapturing ? <ActivityIndicator color={theme.colors.ecoMint} /> : <View style={styles.captureButtonCore} />}
                            </View>
                        </View>
                    </Pressable>

                    <View style={styles.spacer} />
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // ... keep your existing styles, but add/update these:
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20
    },
    infoText: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16
    },
    permissionButton: {
        backgroundColor: theme.colors.ecoMint,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12
    },
    permissionButtonText: {
        color: '#000',
        fontWeight: '700'
    },
    previewArea: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    topBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 20,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 8,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.ecoMint,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    // previewArea: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#111827',
    // },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
        transform: [{ scale: 1.1 }],
    },
    overlayDarken: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scanningFrame: {
        width: 280,
        height: 360,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
    },
    corner: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderColor: theme.colors.ecoMint,
        opacity: 0.8,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 32,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 32,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 32,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 32,
    },
    scanLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: theme.colors.ecoMint,
        shadowColor: theme.colors.ecoMint,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 5,
    },
    capturingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(212,237,219,0.2)',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: '#fff',
        borderTopColor: 'transparent',
    },
    bottomArea: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 80,
        paddingBottom: Platform.OS === 'ios' ? 48 : 32,
        paddingHorizontal: 32,
        alignItems: 'center',
        zIndex: 20,
    },
    instructionsText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
        maxWidth: 250,
    },
    controlsRow: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 320,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    galleryButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonWrapper: {
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonOuter: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonInner: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
    },
    captureButtonInnerActive: {
        transform: [{ scale: 0.9 }],
        backgroundColor: '#e5e7eb',
    },
    captureButtonCore: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#f3f4f6',
    },
    spacer: {
        width: 56,
        height: 56,
    }
});
