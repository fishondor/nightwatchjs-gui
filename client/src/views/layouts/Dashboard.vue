<template>
    <splitPane class="dashboard-main" :split="'horizontal'">
        <template slot="paneL">
            <div class="controls">
                <slot></slot>
            </div>
        </template>
        <template slot="paneR">
            <div class="command">
                <CommandlineOutput :output="output" />
            </div>
        </template>
    </splitPane>
</template>

<script>
import splitPane from 'vue-splitpane'
import CommandlineOutput from '../components/CommandlineOutput';

export default {
    components: {
        CommandlineOutput,
        splitPane
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

    .controls{
        overflow-y: auto;
        max-height: 100%;
    }

    .splitter-pane-resizer {
        margin: 0; left: 0;
        position: relative;
        height: 40px;
        &:before {
            display: block;
            content: "";
            width: 40px;
            height: 3px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -1.5px;
            margin-left: -20px;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }
        &:hover {
            &:before {
            border-color: #999;
            }
        }
    }

    .command{
        overflow: auto;
        max-height: 100%;
    }
}
</style>