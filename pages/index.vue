<template>
    <div class="container">
        <div class="block">
            <p>
                Plain select (not required, default placeholder)
            </p>
            <p>
                Selected value:
                <code>{{names.selected}}</code>
            </p>
            <p>
                Options:
                <code>{{names.list}}</code>
            </p>
            <AppSelect v-model="names.selected"
                       :options="names.list" />
        </div>
        <div class="block">
            <p>
                Select with options as objects (required)
            </p>
            <p>
                Selected value:
                <code>{{options.selected}}</code>
            </p>
            <p>
                Options:
                <code>{{options.list}}</code>
            </p>
            <AppSelect v-model="options.selected"
                       :required="true"
                       :options="options.list"
                       option-label="name"
                       option-unique-value="id"
                       placeholder="Select any option" />
        </div>
        <div class="block">
            <p>
                Select with custom slots
            </p>
            <p>
                Selected value:
                <code>{{users.selected}}</code>
            </p>
            <p>
                Options:
                <code>{{users.list}}</code>
            </p>
            <AppSelect v-model="users.selected"
                       :options="users.list"
                       option-unique-value="id"
                       placeholder="Select any user"
                       class="users-select">
                <template #selection="{option}">
                    <div class="users-select__option">
                        <AppAvatarCircle :image="option.avatar" class="users-select__option-avatar" />
                        <div class="users-select__option-name">{{option.name}}</div>
                    </div>
                </template>
                <template #option="{option}">
                    <div class="users-select__option">
                        <AppAvatarCircle :image="option.avatar" class="users-select__option-avatar" />
                        <div class="users-select__option-name">{{option.name}}</div>
                    </div>
                </template>
            </AppSelect>
        </div>
    </div>
</template>

<script>
    import AppSelect from "~/components/ui/select/base";
    import AppAvatarCircle from "~/components/ui/avatar/circle";
    
    export default {
        name: "main-page",
        components: {
            AppSelect,
            AppAvatarCircle
        },
        data() {
            return {
                names: {
                    selected: "Ivan",
                    list: ["John", "Peter", "Nick", "Max", "Ivan", "Tyson", "Mike", "Andrew", "Alex", "Bob", "Sandy", "Aron"]
                },
                options: {
                    selected: null,
                    list: [
                        {
                            id: 0,
                            name: "Option 0",
                        },
                        {
                            id: 1,
                            name: "Option 1",
                        },
                        {
                            id: 2,
                            name: "Option 2",
                        },
                        {
                            id: 3,
                            name: "Option 3",
                        },
                        {
                            id: 4,
                            name: "Option 4",
                        },
                        {
                            id: 5,
                            name: "Option 5",
                        },
                        {
                            id: 6,
                            name: "Option 6",
                        },
                        {
                            id: 7,
                            name: "Option 7",
                        },
                        {
                            id: 8,
                            name: "Option 8",
                        },
                        {
                            id: 9,
                            name: "Option 9",
                        }
                    ]
                },
                users: {
                    selected: null,
                    list: [
                        {
                            id: 0,
                            name: "User 0",
                            avatar: "https://i.pravatar.cc/50?img=0"
                        },
                        {
                            id: 1,
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/50?img=1"
                        },
                        {
                            id: 2,
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/50?img=2"
                        },
                        {
                            id: 3,
                            name: "User 3",
                            avatar: "https://i.pravatar.cc/50?img=3"
                        },
                        {
                            id: 4,
                            name: "User 4",
                            avatar: "https://i.pravatar.cc/50?img=4"
                        },
                    ]
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .block {
        max-width: 720px;
        margin: 50px auto;
    }
    .users-select {
        &__option {
            display: flex;
            align-items: center;
            &-avatar {
                flex: 0 0 auto;
                margin-right: 10px;
            }
            &-name {
                flex: 1 1 100%;
            }
        }
    }
</style>