<template>
  <div v-html="content"></div>
</template>

<script>
//import { marked } from 'marked';
//import hljs from 'highlight.js'

// import { defineAsyncComponent } from "vue";
// const hljs = defineAsyncComponent(() => import('highlight.js'))
import 'https://github.elemecdn.com/marked/marked.min.js';
import hljs from "https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/es/highlight.min.js"



export default {
  name: 'Markdown',
  props: {
    markdown: {
      type: String,
      default: ''
    }
  },
  computed: {
    content() {
      const renderer = new marked.marked.Renderer()
      renderer.code = (code, language) => {
        const validLang = hljs.getLanguage(language) ? language : 'plaintext'
        return `<pre class="hljs" ><code class="hljs ${validLang}">${hljs.highlight(validLang, code).value}</code></pre>`
      }
      marked.marked.setOptions({
        renderer,
        highlight: code => hljs.highlightAuto(code).value
      })
      return marked.marked(this.markdown)
    }
  }
}
</script>

<style lang="scss">
@import 'https://github.elemecdn.com/highlight.js/styles/github-dark.css'
</style>
