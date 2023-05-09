<template>
  <MonacoEditor
    ref="editor"
    class="monaco-editor"
    v-model="code"
    :language="getLanguage"
    :options="editorOptions"
    @change="onCodeChanged"
    @editorDidMount="editorDidMount"
  />
</template>

<script>
import MonacoEditor from "@/components/Editors/MonacoEditor/index";
// import NightOwl from "@/themes/NightOwl";
import DraculaTheme from "@/themes/Dracula";
import GitHubTheme from "@/themes/GitHub";
import { mapGetters } from "vuex";
import { THEMES } from "@/store/modules/UI/initialState";
// import BlackBoard from "@/themes/BlackBoard";
// import CloudsMidnight from "@/themes/CloudsMidnight";

export default {
  components: {
    MonacoEditor,
  },
  props: {
    file: Object,
  },
  data() {
    return {
      code: "",
      editorOptions: {
        automaticLayout: true,
        selectOnLineNumbers: true,
        theme: "vs-dark",
        fontSize: 16,
        fontLigatures: true,
        wordWrap: "wordWrapColumn",
        wordWrapMinified: true,
        wrappingIndent: "indent",
        minimap: {
          enabled: false,
        },
      },
    };
  },
  methods: {
    onCodeChanged(newCode) {
      // this.code = newCode;
      this.$emit("contentChanged", newCode);
    },
    applyAppTheme() {
      switch (this.getActiveTheme) {
        case THEMES.dark: {
          this.monacoEditor.setTheme("Dracula");
          break;
        }
        case THEMES.light: {
          this.monacoEditor.setTheme("GitHub");
          break;
        }
      }
    },
    editorDidMount(editor) {
      // monaco.editor.defineTheme("night-owl", NightOwl);
      // monaco.editor.setTheme("night-owl");
      editor.focus();
      this.monacoEditor = this.$refs.editor.monaco.editor;
      this.monacoEditor.defineTheme("Dracula", DraculaTheme);
      this.monacoEditor.defineTheme("GitHub", GitHubTheme);
      this.applyAppTheme();

      try {
        this.resizeObserver = new ResizeObserver((_) => {
          editor.layout();
        });
        this.resizeObserver.observe(this.$refs.editor.$el);
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters("UI", ["getActiveTheme"]),
    editor() {
      return this.$refs.editor.monaco;
    },
    getLanguage() {
      // const languageExts = {
      //   js: "javascript",
      //   jsx: "javascript",
      //   ts: "typescript",
      //   py: "python",
      //   json: "json",
      //   geojson: "json",
      //   html: "html",
      //   css: "css",
      //   md: "markdown",
      //   csv: "csv",
      // };
      const languageExts = {
        ABAP: [".abap"],
        APL: [".apl"],
        AsteriskDialplan: [".extensions", ".conf"],
        C: [".c"],
        cpp: [".cpp", ".cc", ".cxx"],
        csharp: [".cs"],
        clojure: [".clj"],
        COBOL: [".cob", ".cpy"],
        CoffeeScript: [".coffee"],
        Crystal: [".cr"],
        CSS: [".css"],
        D: [".d"],
        Dart: [".dart"],
        Diff: [".diff"],
        Dockerfile: [".dockerfile"],
        Elixir: [".ex", ".exs"],
        Elm: [".elm"],
        Erlang: [".erl", ".hrl"],
        Fsharp: [".fsi", ".fsx", ".fs", ".ml", ".mli"],
        Fortran: [".f90", ".f95"],
        Go: [".go"],
        GraphQL: [".graphql"],
        Groovy: [".groovy"],
        Handlebars: [".handlebars", ".hbs"],
        Haskell: [".hs"],
        HTML: [".html", ".htm"],
        Java: [".java"],
        JavaScript: [".js"],
        JavaScriptReact: [".jsx"],
        Jinja: [".jinja"],
        JSON: [".json"],
        Julia: [".jl"],
        Kotlin: [".kt", ".kts"],
        Less: [".less"],
        Liquid: [".liquid"],
        Lua: [".lua"],
        Makefile: [".makefile", ".mk", ".mak"],
        Markdown: [".md"],
        MATLAB: [".mat"],
        "Objective-C": [".m"],
        "Objective-Cpp": [".mm"],
        OCaml: [".ml", ".mli"],
        Pascal: [".pas"],
        Perl: [".pl"],
        PHP: [".php"],
        PlainText: [".txt"],
        PowerShell: [".ps1"],
        Prolog: [".pl"],
        Python: [".py"],
        R: [".r"],
        Razor: [".cshtml", ".razor"],
        Ruby: [".rb"],
        Rust: [".rs"],
        SASS: [".sass", ".scss"],
        Scala: [".scala"],
        Scheme: [".scm", ".ss"],
        ShaderLab: [".shader"],
        Shell: [".sh"],
        Solidity: [".sol"],
        SQL: [".sql"],
        Swift: [".swift"],
        TOML: [".toml"],
        TypeScript: [".ts"],
        TypeScriptReact: [".tsx"],
        VB: [".vb"],
        Velocity: [".vm"],
        Verilog: [".v"],
        VHDL: [".vhdl"],
        Vue: [".vue"],
        XML: [".xml"],
        XSL: [".xsl", ".xslt"],
        YAML: [".yaml", ".yml"],
      };

      if (this.file && this.file.name) {
        const extension = this.file.name.split(".").pop(); // get the file extension
        for (const language in languageExts) {
          if (languageExts[language].includes(`.${extension}`)) {
            return language.toLowerCase();
          }
        }
      }
      return "markdown"; // if the extension is not found in the JSON object, fallback to default syntax highlightning to be markdown
    },
  },
  watch: {
    file(newFile) {
      this.code = newFile.contents || "";
    },
    getActiveTheme() {
      this.applyAppTheme();
    },
  },
  created() {
    this.code = this.file ? this.file.contents : "";
    this.monacoEditor = null;
    this.resizeObserver = null;
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$refs.editor.$el);
    }
  },
};
</script>

<style lang="scss">
.monaco-editor {
  flex: 1;
  width: 100%;
  * {
    font-family: "Fira Code", monospace;
  }
}
</style>
