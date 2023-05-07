<template>
  <main>
    <div
      id="main-layout"
      :class="[{ hidePanel: !getActivePanelId }]"
      @drop.prevent="captureDrop"
      @dragover.prevent
    >
      <SideNavigationBar />
      <splitpanes>
        <pane
          v-show="getActivePanelId"
          class="explorer-panel"
          min-size="15%"
          max-size="45%"
        >
          <FileExplorer v-if="getActivePanelId === 'explorer'" />
          <SearchPanel :key="'search'" v-if="getActivePanelId === 'search'" />
        </pane>
        <pane><Editor /></pane>
      </splitpanes>
      <!-- <div v-show="getActivePanelId" class="explorer-panel">
        <FileExplorer v-if="getActivePanelId === 'explorer'" />
        <SearchPanel :key="'search'" v-if="getActivePanelId === 'search'" />
      </div>
      <Editor /> -->
    </div>
    <FileCreationModal />
    <CommandCenter />
    <SlideYUpTransition>
      <router-view></router-view>
    </SlideYUpTransition>
    <SwitchToMobileViewModal />
  </main>
</template>

<script>
// import FileExplorer from "@/components/FileExplorer";
import Editor from "@/components/Editor";
import CommandCenter from "@/components/CommandCenter";
import SideNavigationBar from "@/components/SideNavigationBar";
import SearchPanel from "@/components/SearchPanel";
import { mapActions, mapGetters } from "vuex";
import debounce from "lodash/debounce";
import { SlideYUpTransition } from "vue2-transitions";
import FileCreationModal from "@/components/FileCreationModal";
import SwitchToMobileViewModal from "@/components/SwitchToMobileViewModal.vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

export default {
  components: {
    FileExplorer: () => import("@/components/FileExplorer"),
    // Editor: () => import("@/components/Editor"),
    Editor,
    CommandCenter,
    SideNavigationBar,
    SearchPanel,
    SlideYUpTransition,
    FileCreationModal,
    SwitchToMobileViewModal,
    Splitpanes,
    Pane,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("UI", ["getActivePanelId"]),
  },
  methods: {
    ...mapActions("Files", ["createFile"]),
    ...mapActions("Editor", ["openLocalFile"]),
    setActivePanel(optionId) {
      this.activePanel = optionId;
    },
    async captureDrop(event) {
      const { dataTransfer } = event;
      const files = dataTransfer.files;
      if (files && files.length > 0) {
        const filename = files[0]?.name;
        const regex = new RegExp(`.*[.geojson|.kml|.csv]`, "i");
        if (filename && regex.test(filename)) {
          const file = files[0];
          if (file.type.startsWith("image") || file.type.startsWith("video")) {
            // we donot support videos or images yet
            return;
          }
          // check file size, open only if below 10MB
          if (file.size / 1024 / 1024 < 10) {
            try {
              console.log(`Opening`, file);
              await this.openLocalFile({ file });
            } catch (error) {
              console.error(error);
              return;
            }
          }
        }
      }
    },
  },
  mounted() {
    new ResizeObserver(_.debounce((entries) => {}, 200));
  },
};
</script>

<style lang="scss" scoped>
main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
#main-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 50px auto;
  background: var(--color-secondary-light);
  position: relative;

  .explorer-panel {
    width: 170px;
    height: 100%;
    overflow: hidden;
  }
}


</style>
