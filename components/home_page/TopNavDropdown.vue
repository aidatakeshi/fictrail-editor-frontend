<script>
//import common from '../../mixins/common.js';

export default {
    name: 'HomePageTopNavDropdown',
    //mixins: [common],
    components: {},

    props: {
    },

    data: () => ({
    }),
}
</script>

<template>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost normal-case px-2">
            <slot name="label" />
        </label>
        <ul tabindex="0" class="
            dropdown-content menu p-2 shadow rounded-box
            bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-slate-100
        ">
            <slot />
        </ul>
    </div>
</template>