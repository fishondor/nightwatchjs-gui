<template>
    <v-dialog
        v-model="dialog"
        >
        <template v-slot:activator="{ }">
            <v-icon
                small
                class="ml-2"
                @click="dialog = true"
            >
                mdi-code-tags
            </v-icon>
        </template>

        <v-card>
            <v-card-text class="pa-0 overflow-x-auto">
                <CommandlineOutput :output="command" />
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="primary"
                    text
                    @click="dialog = false">
                    close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import CommandlineOutput from './CommandlineOutput';

export default {
    components: {
        CommandlineOutput
    },
    props: {
        test: null,
    },
    data () {
        return {
            dialog: false,
            command: ""
        }
    },
    watch: {
        async dialog(visible) {
            if (visible) {
                let command = await this.$serverService.getTestCommand(this.test);
                this.command = command;
            }
        }
    },
}
</script>