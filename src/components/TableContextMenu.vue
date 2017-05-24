<template>
  <div v-show="isShown" class="table-context-menu">
    <span v-for="button in buttons" :key="button.name" class="table-context-menu_button-wrap">
      <button v-if="button.type == 'button'"
              class="table-context-menu_button"
              :class="button.styleClass"
              @click="button.action(row)">
        <i class="table-context-menu_icon"
          :class="button.iconStyleClass"></i>
        {{ button.name }}
      </button>

      <a v-else
        class="table-context-menu_link"
        :href="button.href(row)"
        :target="button.target"
        :class="button.styleClass">
        <i class="table-context-menu_icon"
          :class="button.iconStyleClass"></i>
        {{ button.name }}
      </a>
    </span>
  </div>
</template>

<script>
// vue
import { Event } from 'vue-tables-2';

export default {
  props: ['buttons'],
  created() {
    // watch for row click
    Event.$on('vue-tables.row-click', (data) => {
      let e   = data.e;
      let row = data.row;
      console.log('Row is clicked!', data);
      // show context menu
      this.$data.isShown = true;
      this.$data.row = row;
    });
  },
  data () {
    return {
      row: {},
      isShown: false
    }
  }
}
</script>

<style lang="scss">
.table-context-menu {
  border: 1px solid #ddd;
  padding: 10px;
  display: inline-block;

  &_button-wrap {
    padding: 5px;
  }

  &_button, &_link {
    text-transform: capitalize;
  }

  &_icon {
    color: #fff;
  }
}
</style>
