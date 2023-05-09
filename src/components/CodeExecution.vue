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
      <pre v-else>{{ apiResponse }}</pre>
    </div>
    <button class="execution-button">Execute Code (F9)</button>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      activeTab: "input",
      userInput: "",
      apiResponse: "",
    };
  },
  methods: {
    async makeApiRequest() {
      // Make the API request and update the apiResponse data property
      const response = await fetch("https://example.com/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: this.userInput }),
      });
      const responseData = await response.json();
      this.apiResponse = responseData.output;
    },
  },
};
</script>

<style lang="scss" scoped>
.code-execution {
  width: 100%;
  height: 100%;
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
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
