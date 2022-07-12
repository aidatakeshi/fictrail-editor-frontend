<script>
//import common from '../../mixins/common.js';

export default {
    name: 'HomePageTopNavDropdownItem',
    //mixins: [common],
    components: {},

    props: {
        selected: Boolean,
    },

    data: () => ({
        selectedClasses: [
            'bg-slate-400', 'dark:bg-slate-700',
            'text-black', 'dark:text-white',
        ],
    }),
}
</script>

<template>
    <li>
        <a class="whitespace-nowrap" @click="$emit('click')"
        :class="selected ? selectedClasses : null">
            <slot />
        </a>
    </li>
</template>