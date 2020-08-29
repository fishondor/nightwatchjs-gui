<template>
    <div v-if="showLoader" class="loader-container">
        <v-progress-circular
            :size="50"
            dark
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: mapState({
        showLoader: state => state.showLoader
    })
}
</script>

<style lang="scss" scoped>
.loader-container{
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 1;
}
</style>