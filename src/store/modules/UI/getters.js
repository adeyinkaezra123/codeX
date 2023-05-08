import { PANELS } from "./initialState";

export default {
  getPanels: (state) => {
    return state.panelsById.map((panelId) => PANELS[panelId]);
  },
  getActivePanelId: (state) => {
    return state.activePanelId;
  },
  getShowCommandCenter: (state) => {
    return state.showCommandCenter;
  },
  getShowExecutionPanel: (state) => {
    return state.showExecutionPanel;
  },
  getActiveTheme: (state) => {
    return state.activeTheme;
  },
  getShowCreateFileModal: (state) => {
    return state.showCreateFileModal;
  },
  getBootstrappedFileName: (state) => {
    return state.bootstrappedFileName;
  },
};
