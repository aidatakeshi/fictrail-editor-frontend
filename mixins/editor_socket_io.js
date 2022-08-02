/**
 * Mixin for Project Editor Page
 */
import { io } from "socket.io-client";

export default {
    data: () => ({
        socket: null,
    }),

    mounted(){
        //Setup Socket.io Connection
        this.socket = io(process.env.API_BASE_URL, {
            auth: { token: this.$store.state.bearer_token },
            query: { project_id: this.project_id },
        });

        this.socket.emit('hello');

        //Event: hello
        this.socket.on("hello", async function(user_id){
            console.log(`[${this.project_id}] Hello from user "${user_id}"`);
        }.bind(this));

        //Event: bye
        this.socket.on("bye", async function(user_id){
            console.log(`[${this.project_id}] Bye from user "${user_id}"`);
        }.bind(this));

        //Event: project_changed
        this.socket.on("project_changed", async function(data, user_id){

        }.bind(this));

        //Event: project_removed
        this.socket.on("project_removed", async function(data, user_id){

        }.bind(this));

        //Event: file_created
        this.socket.on("file_created", async function(file_key, user_id){

        }.bind(this));

        //Event: file_changed
        this.socket.on("file_changed", async function(file_key, user_id){

        }.bind(this));

        //Event: file_removed
        this.socket.on("file_removed", async function(file_key, user_id){

        }.bind(this));

        //Event: item_created
        this.socket.on("item_created", async function(type, id, data, user_id){

        }.bind(this));

        //Event: item_changed
        this.socket.on("item_changed", async function(type, id, data, user_id){

        }.bind(this));

        //Event: item_removed
        this.socket.on("item_removed", async function(type, id, data, user_id){

        }.bind(this));

        //Event: item_reordered
        this.socket.on("item_reordered", async function(type, id, data, user_id){

        }.bind(this));

    },

    methods: {
        
    },

    computed: {
        project_id(){
            return this.$route.params.project_id;
        },
    },

    beforeDestroy(){
        //Disconnect socket
        if (this.socket) this.socket.disconnect(); 
    },
}