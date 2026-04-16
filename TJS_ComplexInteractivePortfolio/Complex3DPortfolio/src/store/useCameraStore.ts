import {create} from  "zustand";

type viewTarget = 'main' | 'projects' | 'skills' | 'resume' | 'explode';

interface CameraState {
    currentTarget: viewTarget;
    setCurrentTarget: (newTarget: viewTarget) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
    currentTarget: 'main',
    setCurrentTarget: (newTarget) => set({
        currentTarget: newTarget,
    }),
}))