import { createContext, useContext } from 'react';

export const AssistantShiftWorkspaceContext = createContext({
  openMobileSidebar: () => {},
});

export const useAssistantShiftWorkspace = () => useContext(AssistantShiftWorkspaceContext);
