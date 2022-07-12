<script>
//import common from '../../mixins/common.js';

export default {
    name: 'HomePageTopNavButton',
    //mixins: [common],
    components: {},

    props: {
    },

    data: () => ({
    }),
}
</script>

<template>
    <button class="btn btn-ghost normal-case px-2" @click="$emit('click')">
        <slot />
    </button>
</template>