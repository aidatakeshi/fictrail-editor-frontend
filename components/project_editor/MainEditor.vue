<script>
/*
    Project Main Editor
*/
import common from '../../mixins/common.js';
import InfoPanel from './InfoPanel';
import MenuBars from './MenuBars';

export default {
    name: 'MainEditor',
    mixins: [common],
    components: {
        InfoPanel, MenuBars,
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
        <!-- Info Panel -->
        <InfoPanel />
        <!-- Menu Bars -->
        <MenuBars
            @login-button="$emit('login-button')"
            @logout-button="$emit('logout-button')"
            @personal-info-button="$emit('personal-info-button')"
        />
    </div>
</template>