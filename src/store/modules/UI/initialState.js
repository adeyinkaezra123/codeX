export const PANELS = {
  explorer: {
    id: "explorer",
    icon: "FileTextIcon",
    name: "File Explorer",
  },
  search: {
    id: "search",
    icon: "SearchIcon",
    name: "Search",
  },
  execute: {
    id: "execute",
    icon: "PlayIcon",
    name: "Run Code ",
  },
};

export const THEMES = {
  dark: "dark",
  light: "light",
};

const getActiveTheme = () => {
  const theme = localStorage.getItem("appTheme");
  if (theme) {
    return theme;
  } else {
    return THEMES.dark;
  }
};

export default function initialState() {
  return {
    activePanelId: PANELS.explorer.id,
    panelsById: ["explorer", "search"],
    showCommandCenter: false,
    showExecutionPanel: false,
    activeTheme: getActiveTheme(),
    showCreateFileModal: false,
    bootstrappedFileName: "", // used to pass a filename to the create file modal
  };
}
