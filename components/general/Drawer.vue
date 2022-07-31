<script>
export default {
    name: 'Drawer',

    props: {
    },

    data: () => ({
        toggle: false,
    }),

    methods: {
        show(){
            this.toggle = true;
        },
        hide(){
            this.toggle = false;
        },
    },

    computed: {
    },

    watch: {
    }
}
</script>

<template>
    <Transition name="fade">
        <div class="absolute left-0 right-0 top-0 bottom-0 bg-neutral-focus bg-opacity-40"
        @click.self="hide" v-if="toggle">
            <div class="my-drawer">
                <div class="h-full overflow-y-auto">
                    <slot />
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>