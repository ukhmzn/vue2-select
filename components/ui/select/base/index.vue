<template>
    <div :class="['select', 
            {'select--active': active},
            {'select--top': active && !canBeOpenedDown},
            {'select--bottom': active && canBeOpenedDown}
         ]"
         @focus="handleOpen"
         @blur="handleClose"
         @keyup.esc="handleClose"
         @keydown.self.up.prevent="handleKeyNavigation(true)"
         @keydown.self.down.prevent="handleKeyNavigation(false)"
         @keypress.self.enter.stop="handleEnterKeyPress"
         tabindex="0"
         ref="select">
        <div class="select__field" @mousedown.prevent.stop="handleClick">
            <div class="select__placeholder" v-if="!selected">{{placeholder}}</div>
            <div class="select__field-toggle" @mousedown.prevent.stop="handleToggle"></div>
            <div class="select__value" v-if="selected">
                <slot name="selection" :option="selected">
                    {{selected | label(isOptionObject, optionLabel)}}
                </slot>
            </div>
        </div>
        <div class="select__content" tabindex="-1" ref="content">
            <ul class="select__options" v-if="options.length">
                <li v-for="(option, index) in options"
                    :key="option | key(isOptionObject, optionUniqueValue)"
                    :class="[
                        'select__option',
                        {'select__option--selected': filled && checkIfSelected(option)},
                        {'select__option--hover': keyNavigationDirty && keyNavigationIndex === index}
                    ]"
                    @mousedown.stop="handleSelect(option)" ref="option">
                    <slot name="option" :option="option">
                        {{option | label(isOptionObject, optionLabel)}}
                    </slot>
                </li>
            </ul>
            <div class="select__empty-list" v-else>
                <slot name="emptyList">
                    Empty select
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    const dropdownDefaultHeight = 250;
    
    export default {
        name: "app-select",
        model: {
            prop: "value",
            event: "change"
        },
        props: {
            value: {
                type: [String, Object],
                default: null
            },
            options: {
                type: Array,
                required: true
            },
            required: {
                type: Boolean,
                default: false
            },
            optionLabel: {
                type: String
            },
            optionUniqueValue: {
                type: String
            },
            placeholder: {
                type: String,
                default: "Select"
            }
        },
        data() {
            return {
                active: false,
                canBeOpenedDown: true,
                selected: this.value,
                keyNavigationIndex: 0,
                keyNavigationDirty: false
            }
        },
        computed: {
            select() {
                return this.$refs.select;
            },
            selectContent() {
                return this.$refs.content;
            },
            filled() {
                return this.selected !== null && this.selected !== undefined;
            },
            isOptionObject() {
                return typeof this.options[0] === "object";
            }
        },
        methods: {
            open() {
                this.active = true;
            },
            close() {
                this.active = false;
            },
            toggle() {
                this.active = !this.active;
                this.active ? this.select.blur() : this.select.focus();
            },
            handleOpen() {
                this.canBeOpenedDown = this.checkCanBeOpenedDown();
                this.open();
            },
            handleClose() {
                this.close();
                this.keyNavigationIndex = 0;
                this.keyNavigationDirty = false;
            },
            handleClick() {
                if(!this.active && document.activeElement === this.select) {
                    this.handleOpen();
                } else this.select.focus();
            },
            handleToggle() {
                if(!this.active) {
                    this.canBeOpenedDown = this.checkCanBeOpenedDown();
                    if(document.activeElement === this.select) {
                        this.handleOpen();
                        return;
                    }
                }
                this.toggle(); 
            },
            handleSelect(value) {
                if(!this.required && this.selected === value) {
                    this.selected = null;
                } else {
                    this.selected = value;
                }
                this.handleClose();
            },
            handleEnterKeyPress() {
                if(!this.active) {
                    this.handleOpen();
                } else if(this.keyNavigationDirty) {
                    this.handleSelect(this.options[this.keyNavigationIndex]);
                } else this.close();
            },
            handleKeyNavigation(up = false) {
                if(this.keyNavigationDirty) {
                    up ? this.handleKeyNavigationUp() : this.handleKeyNavigationDown();
                } else {
                    this.keyNavigationDirty = true;
                    this.selectContent.scrollTop = 0;
                }
            },
            handleKeyNavigationUp() {
                if(this.keyNavigationIndex > 0) this.keyNavigationIndex--;
                let option = this.$refs.option[this.keyNavigationIndex];
                if(this.selectContent.scrollTop > option.offsetTop) {
                    this.selectContent.scrollTop = this.selectContent.scrollTop - option.offsetHeight;
                }
            },
            handleKeyNavigationDown() {
                if(this.keyNavigationIndex < this.options.length - 1) this.keyNavigationIndex++;
                let option = this.$refs.option[this.keyNavigationIndex];
                if((option.offsetTop + option.offsetHeight) > this.selectContent.offsetHeight) {
                    this.selectContent.scrollTop = this.selectContent.scrollTop + option.offsetHeight;
                }
            },
            checkCanBeOpenedDown() {
                let { bottom } = this.$refs.select.getBoundingClientRect();
                return (window.innerHeight - bottom) >= dropdownDefaultHeight;
            },
            checkIfSelected(val) {
                let checkBy = this.optionUniqueValue;
                return this.isOptionObject ?
                    this.selected[checkBy] === val[checkBy] : this.selected === val;
            },
            validatePropsForObjectOptions() {
                let scopedSlots = this.$scopedSlots;
                
                if(!this.optionUniqueValue) throw new Error('"optionUniqueValue" property is required if value is an object');
                
                if(!this.optionLabel && (!scopedSlots.selection || !scopedSlots.option)) {
                    throw new Error('"optionLabel" property is required if value is an object');
                }
            }
        },
        filters: {
            key(option, isObject, uniqueValue) {
                return isObject ? option[uniqueValue] : option;
            },
            label(option, isObject, label) {
                return isObject ? option[label] : option;
            }
        },
        mounted() {
            if(!process.server) {
                if(this.isOptionObject) {
                    this.validatePropsForObjectOptions();
                }
            }
        },
        watch: {
            selected(val) {
                this.$emit("change", val);
            },
            isOptionObject(val) {
                if(val) {
                    this.validatePropsForObjectOptions();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .select {
        position: relative;
        &:focus {
            outline: 1px solid lighten(#5bb9b9, 20%);
        }
        &__field {
            position: relative;
            min-height: 42px;
            cursor: text;
            border-radius: 6px;
            border: 1px solid #e6e6e6;
            padding: 10px 52px 10px 12px;
            &-toggle {
                position: absolute;
                top: 1px;
                right: 1px;
                bottom: 1px;
                width: 40px;
                transition: transform 0.2s;
                cursor: pointer;
                &::after {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border-style: solid;
                    border-width: 5px 5px 0;
                    border-color: darken(#e6e6e6, 20%) transparent transparent;
                    content: "";
                }                
            }
        }
        &__placeholder {
            position: absolute;
            top: 50%;
            left: 1px;
            width: 100%;
            transform: translateY(-50%);
            color: darken(#e6e6e6, 30%);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            pointer-events: none;
            padding: 0 52px 0 12px;
        }
        &__content {
            display: none;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            max-height: 250px;
            transform: translateY(100%);
            overflow: auto;
            background: #ffffff;
            border-radius: 0 0 6px 6px;
            border-style: solid;
            border-color: #e6e6e6;
            border-width: 0 1px 1px 1px;
        }
        &__empty-list {
            padding: 8px 12px;
        }
        &__options {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        &__option {
            font-size: 16px;
            cursor: pointer;
            padding: 8px 12px;
            transition: color 0.2s, background-color 0.2s;
            &:hover {
                color: #ffffff;
                background-color: #5bb9b9;
            }
            &--hover {
                color: #ffffff;
                background-color: #5bb9b9;
            }
            &--selected {
                color: #ffffff;
                background-color: #5bb9b9;
                &:hover {
                    background-color: darken(#5bb9b9, 20%);
                }
            }
        }
        &--active {
            .select {
                &__field {
                    &-toggle {
                        transform: rotate(180deg);
                    }
                }
                &__content {
                    display: block;
                }
            }
        }
        &--top {
            .select {
                &__content {
                    top: 0;
                    bottom: auto;
                    transform: translateY(-100%);
                    border-radius: 6px 6px 0 0;
                    border-width: 1px 1px 0 1px;
                }
            }
        }
    }
</style>