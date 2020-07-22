<template>
  <VueShowdown :markdown="fileContent"></VueShowdown>
</template>

<script>
import VueShowdown from "vue-showdown";

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
