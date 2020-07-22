<template>
    <div class="dashboard-main">
        <div class="controls">
            <slot></slot>
        </div>
        <div class="command">
            <CommandlineOutput :output="output" />
        </div>
    </div>
</template>

<script>
import CommandlineOutput from '../components/CommandlineOutput';

export default {
    components: {
        CommandlineOutput
    },
    props: {
        output: {type: String, default: "Nothing to show yet"},
    }
}
</script>

<style lang="scss" scoped>
.dashboard-main{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .controls{
        overflow-y: auto;
    }

    .command{
        max-height: 50%;
    }
}
</style>