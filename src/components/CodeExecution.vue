<template>
  <div class="code-execution">
    <nav>
      <ul>
        <li
          :class="{ active: activeTab === 'input' }"
          @click="activeTab = 'input'"
        >
          Input
        </li>
        <li
          :class="{ active: activeTab === 'output' }"
          @click="activeTab = 'output'"
        >
          Output
        </li>
      </ul>
    </nav>
    <div class="execution-area">
      <textarea
        v-if="activeTab === 'input'"
        v-model="userInput"
        placeholder="Enter input..."
      />
      <div class="code-result" v-else>
        <pre class="error" v-if="codeResult?.status?.id === 6">
          {{ window.atob(codeResult?.compile_output) }}
        </pre>
        <pre class="success" v-else-if="codeResult?.status?.id === 3">
          {{
            window.atob(codeResult.stdout) !== null
              ? `${window.atob(codeResult.stdout)}`
              : null
          }}
        </pre>
        <pre className="error" v-else-if="codeResult?.status?.id === 5">
Time Limit Exceeded</pre
        >
        <pre className="error" v-else>{{
          window.atob(codeResult?.stderr)
        }}</pre>
      </div>
    </div>
    <button
      class="execution-button"
      @click="compileCode"
      :disabled="!!processing"
    >
      {{ processing ? "Processing" : "Execute Code (F9)" }}
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { compilerOptions } from "@/utils/editor/compilerOptions";
import { getLanguage, languageExts } from "@/utils/editor/languageExts";
export default {
  data() {
    return {
      activeTab: "input",
      userInput: "",
      codeResult: null,
      processing: "",
    };
  },
  mounted() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      // To enable window and document globally
      this.window = window;
      this.document = document;
    }
  },
  methods: {
    ...mapGetters("Files", ["getFiles"]),
    ...mapGetters("Editor", ["getActiveFiles", "getActiveFileList"]),
    getCompilerId(compilers, languageFormatting) {
      const compiler = compilers.find(
        (obj) => obj.value === languageFormatting
      );
      return compiler ? compiler.id : null;
    },

    compileCode() {
      this.processing = true;
      const sourceCode = this.getActiveFiles()["PRIMARY"].contents;
      const languageFormatting = getLanguage(
        this.getActiveFiles()["PRIMARY"].name,
        languageExts
      );
      const languageId = this.getCompilerId(
        compilerOptions,
        languageFormatting
      );
      const compilationData = {
        language_id: languageId,
        source_code: window.btoa(sourceCode),
        stdin: window.btoa(this.userInput),
      };

      const options = {
        method: "POST",
        url: process.env.VUE_APP_API_URL,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Host": process.env.VUE_APP_API_HOST,
          "X-RapidAPI-Key": process.env.VUE_APP_API_KEY,
        },
        data: compilationData,
      };
      axios
        .request(options)
        .then((response) => {
          console.log("res.data", response.data);
          const token = response.data.token;
          this.checkStatus(token);
        })
        .catch((err) => {
          let error = err.response ? err.response.data : err;
          // get error status
          console.error(error);
          // let status = err.response.status;
          // console.log("Error Status", status);
          // if (status === 429) {
          //   console.log("Too many requests", status);

          //   alert(`Quota of 100 code compilations exceeded for the Day!`);
          //   // showErrorToast(
          //   //   `Quota of 100 code compilations exceeded for the Day!`,
          //   //   10000
          //   // );
          // }
          this.processing = false;
          console.log("catch block...", error);
        });
    },
    async checkStatus(token) {
      const options = {
        method: "GET",
        url: process.env.VUE_APP_API_URL + "/" + token,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
          "X-RapidAPI-Host": process.env.VUE_APP_API_HOST,
          "X-RapidAPI-Key": process.env.VUE_APP_API_KEY,
        },
      };
      try {
        let response = await axios.request(options);
        let statusId = response.data.status?.id;

        // Processed - we have a result
        if (statusId === 1 || statusId === 2) {
          // still processing
          setTimeout(() => {
            this.checkStatus(token);
          }, 2000);
          return;
        } else {
          this.processing = false;
          const standardizedResult = response.data;
          this.codeResult = standardizedResult;
          console.log("response.data", standardizedResult);
          alert(`Compiled Successfully!`);
          this.activeTab = "output";
          return;
        }
      } catch (err) {
        console.log("err", err);
        this.processing = false;
        alert("Oops, something went wrong");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.code-execution {
  width: 100%;
  height: 100%;
  z-index: 20;
}
nav {
  & ul {
    display: flex;
    list-style: none;
    margin: 0;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
  }
  & li {
    cursor: pointer;
    padding: 10px;
    &.active {
      border-bottom: 2px solid var(--color-primary);
      font-weight: 600;
    }
  }
}
.execution-area,
.execution-area > textarea {
  resize: none;
  width: 100%;
  padding: 1rem;
  background: var(--color-secondary);
  color: var(--font-color);
  border: none;
  outline: none;
  height: 100%;
}
.execution-button {
  background-color: var(--color-secondary);
  position: absolute;
  bottom: 5%;
  right: 2%;
  padding: 1rem;
  background: var(--color-secondary-light);
  display: flex;
  align-content: center;
  justify-content: center;
  border-radius: 5px;
  border: none;
  color: var(--font-color);
  &:hover {
    cursor: pointer;
    color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.code-result {
  padding: 4px 8px;
  line-height: 1rem;

  .error {
    color: var(--color-error);
  }
  .success {
    color: #0ae7a5;
  }
}
</style>
