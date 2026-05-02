import { create } from 'zustand'

export type NodeOrientation = 'horizontal' | 'vertical'

interface WorkflowCanvasStore {
  orientation: NodeOrientation
  setOrientation: (o: NodeOrientation) => void
  toggleOrientation: () => void
}

export const useWorkflowCanvasStore = create<WorkflowCanvasStore>((set) => ({
  orientation: 'vertical',
  setOrientation: (orientation) => set({ orientation }),
  toggleOrientation: () =>
    set((s) => ({
      orientation: s.orientation === 'horizontal' ? 'vertical' : 'horizontal',
    })),
}))
