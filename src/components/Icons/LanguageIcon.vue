<template>
  <div>
    <img :src="renderIcon()" class="icon" :width="width" />
  </div>
</template>

<script>
import { getMaterialFileIcon, getVSIFileIcon } from "file-extension-icon-js";
export default {
  name: "LanguageIcon",
  props: {
    fileName: String,
    width: String,
  },
  methods: {
    getMaterialFileIcon,
    renderIcon: function () {
      return getMaterialFileIcon(this.fileName);
    },
  },
};
</script>
