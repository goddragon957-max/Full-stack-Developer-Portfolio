import { create } from 'zustand';
import type { ExperienceCategory } from '../data/portfolio';

type PortfolioState = {
  category: 'All' | ExperienceCategory;
  selectedExperienceId: string;
  activeCapabilityId: string;
  setCategory: (category: 'All' | ExperienceCategory) => void;
  setSelectedExperienceId: (id: string) => void;
  setActiveCapabilityId: (id: string) => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  category: 'All',
  selectedExperienceId: 'awp-bim-viewer',
  activeCapabilityId: 'fullstack',
  setCategory: (category) => set({ category }),
  setSelectedExperienceId: (selectedExperienceId) => set({ selectedExperienceId }),
  setActiveCapabilityId: (activeCapabilityId) => set({ activeCapabilityId }),
}));
