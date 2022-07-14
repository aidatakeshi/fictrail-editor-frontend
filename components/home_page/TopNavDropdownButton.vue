<script>
//import common from '../../mixins/common.js';

export default {
    name: 'HomePageTopNavDropdownButton',
    //mixins: [common],
    components: {},

    props: {
        selected: Boolean,
    },

    computed: {
        buttonClass(){
            let classes = [];
            if (this.selected){
                classes.push('bg-neutral', 'text-white');
            }else{
                classes.push('btn-ghost');
            }
            return classes;
        },
    },

    data: () => ({
    }),
}
</script>

<template>
    <button class="btn normal-case whitespace-nowrap p-0" @click="$emit('click')"
    :class="buttonClass">
        <slot />
    </button>
</template>