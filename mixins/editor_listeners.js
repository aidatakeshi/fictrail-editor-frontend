/**
 * Mixin for Project Editor Page
 */
export default {
    mounted(){
        //Listen to Screen Resizing
        if (typeof window !== 'undefined'){
            window.addEventListener('resize', this.handleScreenResize);
        }
        this.handleScreenResize();
    },
    methods: {
        //Handle Screen Resizing
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
        //Stop Listening to Screen Resizing
        if (typeof window !== 'undefined'){
            window.removeEventListener('resize', this.handleScreenResize);
        }
    },
}