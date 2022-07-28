<script>
/*
    Project Main Editor
*/
import common from '../../mixins/common.js';
import EditPersonalInfo from '../EditPersonalInfo';

export default {
    name: 'MainEditor',
    mixins: [common],
    components: {
        EditPersonalInfo,
    },

    data: () => ({
    }),

    mounted(){
    },

    methods: {
    },
}

</script>

<template>
    <div>
        {{$store.state.p_display}}
    </div>
</template>