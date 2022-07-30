<script>
/*
    Editor - Info Panel
*/
import common from '../../mixins/common.js';

export default {
    name: 'EditorInfoPanel',
    mixins: [common],
    components: {

    },

    data: () => ({
    }),

    mounted(){
    },

    methods: {
    },

    computed: {
        info_panel_status(){
            return this.$store.getters['p_display/info_panel_status'];
        },
    },
}

</script>

<template>
    <div class="info-panel" :class="info_panel_status">
        <div class="info-panel-box">
            <div class="info-panel-header">
                <label class="info-panel-title">
                    {{$store.state.p_data.project.name}}
                </label>
                <button class="btn btn-sm">Test</button>
            </div>
            <div class="info-panel-body">
                Test
            </div>
        </div>
    </div>
</template>