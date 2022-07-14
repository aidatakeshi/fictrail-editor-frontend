<script>
//import common from '../../mixins/common.js';

export default {
    name: 'HomePageTopNavDropdown',
    //mixins: [common],
    components: {},

    props: {
        dropdownClass: null,
    },

    data: () => ({
    }),
}
</script>

<template>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="top-nav-dropdown">
            <slot name="label" />
        </label>
        <div tabindex="0" :class="dropdownClass"
        class="top-nav-dropdown-card">
            <slot />
        </div>
    </div>
</template>