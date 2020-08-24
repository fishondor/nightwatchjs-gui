<template>
  <v-container fluid class="about markdown-body">
    <VueShowdown 
      :markdown="fileContent" 
      :flavor="'github'" 
      :options="{
        tables: true,
        ghCodeBlocks: true,
        ghMentionsLink: 'https://github.com/{u}',
        encodeEmails: true
      }"></VueShowdown>
  </v-container>
</template>

<script>
import VueShowdown from "vue-showdown";
import 'github-markdown-css'

import MarkDownData from '../../../README.md';

export default {
  components: VueShowdown,
  data: function() {
    return {
      fileContent: null,
      rawContent: null
    };
  },
  created: function() {
    this.getContent();
  },
  methods: {
    getContent() {
      this.fileContent = MarkDownData;
    }
  }
}
</script>

<style lang="scss" scoped>
.about{
  padding-bottom: 50px;
}
</style>