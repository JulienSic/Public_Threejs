import {create} from  "zustand";

interface AnimationState {
    isExploded: boolean;
    triggerExplosion:()=>void;
    resetExplosion:()=>void;

}

export const useAnimateStore = create<AnimationState>((set) => ({
    isExploded: false,
    triggerExplosion: () => set({isExploded: true}),
    resetExplosion: () => set({isExploded: false}),
}))