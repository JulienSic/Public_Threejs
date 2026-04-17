import {create} from  "zustand";


type currentModel = 'TestBreakWall' | 'BreakWall' | 'CIP3DModelHandler' | 'BasicShape';

interface modelStore {
    currentModel: currentModel
    setCurrentModel: (newModel: currentModel) => void
    debug: boolean
    setDebug: (isDebug: boolean) => void
    uiDebug: boolean
    setUiDebug: (isUIDebug: boolean) => void
    isAdmin: boolean
    setIsAdmin: (IsAdmin: boolean) => void
    isExploded: boolean
    setIsExploded: (IsExploded: boolean) => void
}

export const useModelStore = create<modelStore>((set) => ({
    currentModel: 'CIP3DModelHandler',
    debug: false,
    uiDebug: true,
    isAdmin: false,
    isExploded: false,

    setCurrentModel: (newModel) => set({
        currentModel: newModel,
    }),
    setDebug: (isDebug) => set({
        debug: isDebug,
    }),
    setUiDebug: (isUIDebug) => set({
        uiDebug: isUIDebug,
    }),
    setIsAdmin: (IsAdmin) => set({
        isAdmin: IsAdmin,
    }),
    setIsExploded: (isExploded) => set({
        isExploded: isExploded,
    }),
}))