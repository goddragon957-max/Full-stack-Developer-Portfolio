import { create } from 'zustand';
import type { ProjectCategory } from '../data/portfolio';

type BuildMode = 'goal' | 'ralph';

type PortfolioState = {
  category: 'All' | ProjectCategory;
  selectedProjectId: string;
  buildMode: BuildMode;
  setCategory: (category: 'All' | ProjectCategory) => void;
  setSelectedProjectId: (id: string) => void;
  setBuildMode: (mode: BuildMode) => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  category: 'All',
  selectedProjectId: 'mom-voice',
  buildMode: 'ralph',
  setCategory: (category) => set({ category }),
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
  setBuildMode: (buildMode) => set({ buildMode }),
}));
