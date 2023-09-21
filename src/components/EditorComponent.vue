<template>
  <mavon-editor :codeStyle=codeStyle :externalLink="externalLink" :ishljs="true" :autofocus="false" placeholder=" "
                :toolbars="toolbars" />
</template>

<script setup>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { ref, reactive, onMounted } from 'vue'
let codeStyle = ref('')
onMounted(() => { codeStyle.value = 'github-dark' })
const externalLink = reactive({
  markdown_css: function () {
    // 这是你的markdown css文件路径
    return "https://github.elemecdn.com/mavon-editor/dist/markdown/github-markdown.min.css";
  },
  hljs_js: function () {
    // 这是你的hljs文件路径
    return "https://github.elemecdn.com/mavon-editor/dist/highlightjs/highlight.min.js";
  },
  hljs_css: function (css) {
    // 这是你的代码高亮配色文件路径
    return "https://github.elemecdn.com/highlight.js/styles/" + css + ".css";
  },
  hljs_lang: function (lang) {
    // 这是你的代码高亮语言解析路径
    return "https://github.elemecdn.com/highlight.js/lib/languages/" + lang + ".min.js";
  },
  katex_css: function () {
    // 这是你的katex配色方案路径路径
    return "https://github.elemecdn.com/mavon-editor/dist/katex/katex.min.css";
  },
  katex_js: function () {
    // 这是你的katex.js路径
    return "https://github.elemecdn.com/mavon-editor/dist/katex/katex.min.js";
  }
})
const toolbars = reactive({
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  superscript: false, // 上角标
  subscript: false, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  fullscreen: true, // 全屏编辑
  readmodel: false, // 沉浸式阅读
  htmlcode: false, // 展示html源码
  help: true, // 帮助
  /* 1.3.5 */
  undo: true, // 上一步
  redo: true, // 下一步
  trash: false, // 清空
  save: false, // 保存（触发events中的save事件）
  /* 1.4.2 */
  navigation: false, // 导航目录
  /* 2.1.8 */
  alignleft: false, // 左对齐
  aligncenter: false, // 居中
  alignright: false, // 右对齐
  /* 2.2.1 */
  subfield: true, // 单双栏模式
  preview: true, // 预览
})
</script>

<style scoped></style>
