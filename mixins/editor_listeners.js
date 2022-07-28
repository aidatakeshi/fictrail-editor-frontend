/**
 * Mixin for Project Editor Page
 */
export default {
    methods: {
        listenToScreenResize(){
            if (typeof window !== 'undefined'){
                window.addEventListener('resize', this.handleScreenResize);
            }
            this.handleScreenResize();
        },
        handleScreenResize(){
            if (typeof window !== 'undefined'){
                this.$store.commit('p_display/screen_size', {
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
        },
    },
    beforeDestroy(){
        if (typeof window !== 'undefined'){
            window.removeEventListener('resize', this.handleScreenResize);
        }
    },
}