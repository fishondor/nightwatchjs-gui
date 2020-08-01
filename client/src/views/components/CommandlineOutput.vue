<template>
    <pre :class="{'test-results-output': true, 'wrap-text': wrapText}" v-html="output"></pre>
</template>

<script>
export default {
    props: {
        output: {type: String, default: ""},
        wrapText: {type: Boolean, default: false}
    }
}
</script>

<style lang="scss" scoped>
.test-results-output{
  background-color: black;
  color: white;
  overflow: auto;
  padding: 20px;
  max-height: 100%;

  &.wrap-text{
      white-space: break-spaces;
  }
}
</style>