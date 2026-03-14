import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Compass, Home, Lightbulb, MessageCircle, User } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalysisData, ScreenType, UpcycleIdea } from '../types';

import BrandSplashScreen from '../components/BrandSplashScreen';
import OnboardingScreen from '../components/OnboardingScreen';
import SplashScreen from '../components/SplashScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import AuthScreen from '../screens/AuthScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ScanScreen from '../screens/ScanScreen';
import SwapsScreen from '../screens/SwapsScreen';
import TutorialScreen from '../screens/TutorialScreen';

import ChatAssistant from '../components/ChatAssistant';
import { Celebration, Toast } from '../components/Notifications';
import { useAuth } from '../context/AuthContext';
import { saveIdeaToHistory } from '../utils/db';

export default function App() {
  const { session, loading } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('brand-splash');
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<UpcycleIdea | null>(null);
  const [ecoScore, setEcoScore] = useState(120);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<UpcycleIdea[]>([]);

  const [toast, setToast] = useState<{ msg: string; icon?: React.ReactNode } | null>(null);
  const [celebration, setCelebration] = useState<{ pts: number; title: string; sub: string } | null>(null);

  // ── ALL hooks must be declared before any conditional returns ──

  const navigateTo = useCallback((screen: ScreenType) => {
    setCurrentScreen(screen);
  }, []);

  const showToast = useCallback((msg: string, icon?: React.ReactNode) => {
    setToast({ msg, icon });
  }, []);

  const celebrate = useCallback((pts: number, title: string, sub: string) => {
    setEcoScore(prev => prev + pts);
    setCelebration({ pts, title, sub });
  }, []);

  const handleScanResult = useCallback((data: AnalysisData, image: string) => {
    setAnalysisData(data);
    setScannedImage(image);
    showToast("+10 pts • Item identified!", "📷");
    navigateTo('analysis');
  }, [showToast, navigateTo]);

  const handleTutorialComplete = useCallback(() => {
    celebrate(50, "Project Complete!", "Your upcycling project is finished. Great job for the planet! 🌿");
    navigateTo('home');
  }, [celebrate, navigateTo]);

  const handleAcceptIdea = useCallback(async (idea: UpcycleIdea) => {
    setSavedIdeas(prev => {
      if (!prev.find(i => i.id === idea.id)) {
        return [idea, ...prev];
      }
      return prev;
    });
    setSelectedIdea(idea);

    // Persist to Supabase
    if (session?.user?.id) {
      await saveIdeaToHistory(session.user.id, idea, scannedImage);
    }

    navigateTo('tutorial');
  }, [session, scannedImage, navigateTo]);

  // ── Conditional returns AFTER all hooks ──

  // Show a loading spinner while Supabase resolves the session
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  // Gate the entire app behind auth
  if (!session) {
    return <AuthScreen />;
  }


  const renderScreen = () => {
    switch (currentScreen) {
      case 'brand-splash':
        return <BrandSplashScreen onNext={() => navigateTo('splash')} />;
      case 'splash':
        return <SplashScreen onNext={() => navigateTo('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={(name, goals) => {
          console.log("Onboarding complete:", { name, goals });
          navigateTo('home');
        }} />;
      case 'home':
        return <HomeScreen onNavigate={navigateTo} ecoScore={ecoScore} />;
      case 'scan':
        return <ScanScreen onNavigate={navigateTo} setScannedImage={setScannedImage} setAnalysisData={setAnalysisData} />;
      case 'analysis':
        return <AnalysisScreen onNavigate={navigateTo} scannedImage={scannedImage} analysisData={analysisData} onAcceptIdea={handleAcceptIdea} />;
      case 'recommendations':
        return <RecommendationsScreen onNavigate={navigateTo} savedIdeas={savedIdeas} onSelectIdea={setSelectedIdea} />;
      case 'tutorial':
        return <TutorialScreen onNavigate={navigateTo} idea={selectedIdea} onComplete={handleTutorialComplete} />;
      case 'map':
        return <MapScreen onNavigate={navigateTo} />;
      case 'discover':
        return <DiscoverScreen onNavigate={navigateTo} />;
      case 'swaps':
        return <SwapsScreen onNavigate={navigateTo} swaps={analysisData?.swaps || []} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigateTo} />;
      default:
        return <HomeScreen onNavigate={navigateTo} ecoScore={ecoScore} />;
    }
  };

  const showBottomNav = currentScreen !== 'brand-splash' && currentScreen !== 'splash' && currentScreen !== 'onboarding' && currentScreen !== 'scan' && currentScreen !== 'tutorial';

  return (
    <SafeAreaView style={styles.container}>
      {/* Notifications */}
      {toast && (
        <Toast msg={toast.msg} icon={toast.icon} onClose={() => setToast(null)} />
      )}
      {celebration && (
        <Celebration pts={celebration.pts} title={celebration.title} sub={celebration.sub} onDone={() => setCelebration(null)} />
      )}

      {/* Main Content Area */}
      <View style={[styles.mainArea, { paddingBottom: showBottomNav ? 90 : 0 }]}>
        {renderScreen()}
      </View>

      {/* Floating Chat Button */}
      {showBottomNav && (
        <Pressable
          onPress={() => setIsChatOpen(true)}
          style={({ pressed }) => [
            styles.chatBtn,
            { transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
        >
          <MessageCircle size={24} color="white" />
        </Pressable>
      )}

      {/* Chat Assistant */}
      {isChatOpen && <ChatAssistant onClose={() => setIsChatOpen(false)} />}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <View style={styles.navBar}>
          <NavItem
            icon={<Home size={22} color={currentScreen === 'home' ? '#16a34a' : '#9ca3af'} strokeWidth={currentScreen === 'home' ? 2.5 : 2} />}
            label="Home"
            active={currentScreen === 'home'}
            onClick={() => navigateTo('home')}
          />
          <NavItem
            icon={<Compass size={22} color={currentScreen === 'discover' || currentScreen === 'swaps' ? '#16a34a' : '#9ca3af'} strokeWidth={currentScreen === 'discover' || currentScreen === 'swaps' ? 2.5 : 2} />}
            label="Discover"
            active={currentScreen === 'discover' || currentScreen === 'swaps'}
            onClick={() => navigateTo('discover')}
          />

          {/* Centered Scan Button */}
          <View style={styles.scanBtnContainer}>
            <Pressable
              onPress={() => navigateTo('scan')}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
            >
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.scanBtn}
              >
                <Camera size={28} color="white" strokeWidth={2.5} />
              </LinearGradient>
            </Pressable>
            <Text style={styles.scanBtnLabel}>SCAN</Text>
          </View>

          <NavItem
            icon={<Lightbulb size={22} color={currentScreen === 'recommendations' ? '#16a34a' : '#9ca3af'} strokeWidth={currentScreen === 'recommendations' ? 2.5 : 2} />}
            label="Ideas"
            active={currentScreen === 'recommendations'}
            onClick={() => navigateTo('recommendations')}
          />
          <NavItem
            icon={<User size={22} color={currentScreen === 'profile' ? '#16a34a' : '#9ca3af'} strokeWidth={currentScreen === 'profile' ? 2.5 : 2} />}
            label="Profile"
            active={currentScreen === 'profile'}
            onClick={() => navigateTo('profile')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <Pressable
      onPress={onClick}
      style={({ pressed }) => [
        styles.navItem,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={{ transform: [{ scale: active ? 1.1 : 1 }] }}>
        {icon}
      </View>
      <Text style={[
        styles.navLabel,
        { color: active ? '#16a34a' : '#9ca3af', opacity: active ? 1 : 0.6 }
      ]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mainArea: {
    flex: 1,
  },
  chatBtn: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#16a34a',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a4228',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 40,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 16,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.03,
    shadowRadius: 30,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scanBtnContainer: {
    position: 'relative',
    top: -24,
    alignItems: 'center',
    flex: 1,
  },
  scanBtn: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#f9fafb',
    shadowColor: '#1a4228',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },
  scanBtnLabel: {
    position: 'absolute',
    bottom: -20,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#16a34a',
  }
});
