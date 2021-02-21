<template>
    <div class="avatar" :style="styles"></div>
</template>

<script>
    export default {
        name: "app-avatar-circle",
        props: {
            size: {
                type: [String, Number],
                default: 25
            },
            image: {
                type: String,
                required: true
            }
        },
        computed: {
            styles(){
                let css = {
                    width: this.size + "px",
                    height: this.size + "px"
                };

                if(this.image){
                    css["background-image"] = "url(" + this.image + ")";
                }

                return css;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar{
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        border-radius: 50%;
        background-color: $font-color;
    }
</style>
