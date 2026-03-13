export type ScreenType =
    | "brand-splash"
    | "splash"
    | "onboarding"
    | "home"
    | "scan"
    | "analysis"
    | "recommendations"
    | "tutorial"
    | "map"
    | "swaps"
    | "discover"
    | "chat"
    | "impact"
    | "profile";

export interface AnalysisData {
    materialType: string;
    confidence: number;
    condition: string;
    recyclabilityScore: number;
    reasoning: string[];
    relatableImpact: {
        label: string;
        value: string;
        icon: string;
    };
    impact: {
        wastePrevented: number; // kg
        co2Saved: number; // kg
        waterSaved: number; // L
    };
    ideas: UpcycleIdea[];
}

export interface CommunityPost {
    id: string;
    userName: string;
    userAvatar: string;
    image: string;
    title: string;
    likes: number;
    timeAgo: string;
}

export interface UserStats {
    ecoScore: number;
    streak: number;
    itemsSaved: number;
    rank: string;
}

export interface UpcycleIdea {
    id: string;
    title: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    previewImage: string;
    estimatedTime?: string;
    materials?: string[];
    steps: TutorialStep[];
}

export interface TutorialStep {
    stepNumber: number;
    instruction: string;
    imageUrl?: string;
}

export interface RecyclingCenter {
    id: string;
    name: string;
    distance: string;
    address?: string;
    rating?: number;
    isOpen?: boolean;
    acceptedMaterials: string[];
    lat?: number;
    lng?: number;
}

export interface SwapSuggestion {
    id: string;
    from: string;
    to: string;
    description: string;
    imageUrl: string;
}
