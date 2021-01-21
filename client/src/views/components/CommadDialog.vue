<template>
    <v-dialog
        v-model="dialog"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="ma-2"
                text
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>mdi-code-tags</v-icon>
            </v-btn>
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
                console.log("test", this.test);
                let command = await this.$serverService.getTestCommand(this.test);
                this.command = command;
            }
        }
    },
}
</script>