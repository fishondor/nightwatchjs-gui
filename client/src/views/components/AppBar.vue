<template>
    <v-app-bar
        app
        dense
        dark
        clipped-left
    >
        <v-toolbar-title>Nightwatchjs GUI</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{currentRouteName}}</v-toolbar-title>
    </v-app-bar>
</template>

<script>
export default {
    computed: {
        currentRouteName() {
            return this.$route.meta.title;
        }
    }
}
</script>