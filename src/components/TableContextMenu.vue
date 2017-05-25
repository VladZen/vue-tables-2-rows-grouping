<!-- NOTICE: table context is absolute element. For proper displaying make sure
that parent node is relative positioning -->
<template>
  <div id="table-context-menu"
        class="table-context-menu"
        :class="[shown, {'table-context-menu__invert': isInvert}]"
        :style="{ top: `${coordinates.top}px`, left: `${coordinates.left}px` }">
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
// utils
import closest from '../helpers/closest-fn.js';

// vue
import { Event } from 'vue-tables-2';

let defaultData = function () {
  return {
    row: {},
    isShown: false,
    isInvert: false,
    coordinates: {
      top: 0,
      left: 0
    }
  }
};

let countCoordinates = function (mouseEvent) {
  let x, y;
  if (mouseEvent.pageX || mouseEvent.pageY) {
    x = mouseEvent.pageX;
    y = mouseEvent.pageY;
  } else {
    x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  let el = this.$el;
  let parent = this.$parent.$el;
  let elWidth = el.offsetWidth;
  let parentBounds = parent.getBoundingClientRect();

  // the block bellow is called to watch for the right border
  // this supposed to prevent initializing
  // of the context menu out of wrapper borders

  // count the distance between x coordinate of click
  // and right wrapper border
  let rightBoundDistance = parentBounds.right - x;

  if (rightBoundDistance < elWidth) {
    x -= elWidth;
    this.$data.isInvert = true;
  } else {
    this.$data.isInvert = false;
  }

  return {
    top: y,
    left: x
  };
};

let closeContextMenu = function () {
  let defaults = defaultData();
  this.$data.isShown = defaults.isShown;
  this.$data.row = defaults.row;
};

let resetDataAttacher = function () {
  let obj = {};
  obj.trigger = false;
  obj.fn = () => {
    if (!obj.trigger) {
      obj.trigger = true;
      document.documentElement.addEventListener('click', (e) => {
        // check if click target is context menu or placed inside context menu
        let menuIsClicked = closest(e.target, '#table-context-menu') || e.target.id == 'table-context-menu';
        // do nothing if click target is placed in context menu
        if (!menuIsClicked) {
          e.target.removeEventListener(e.type, obj.fn);
          closeContextMenu.call(this);
          obj.trigger = false;
        }
      });
    }
  }

  return obj;
};

export default {
  props: ['buttons'],
  created () {
    // initializing attacher obj
    let attacher = resetDataAttacher.call(this);

    // listen for row click
    Event.$on('vue-tables.row-click', (data) => {
      data.event.stopPropagation();
      let e   = data.event;
      let row = data.row;
      // show context menu
      this.$data.isShown = true;
      this.$data.row = row;
      this.$data.coordinates = countCoordinates.call(this, e);
      attacher.fn();
    });

    // listen for context menu destroy event
    Event.$on('table-context-menu:reset', () => {
      attacher.trigger = false;
      document.documentElement.removeEventListener('click', attacher.fn);
      closeContextMenu.call(this);
    });
  },
  data: defaultData,
  computed: {
    shown () {
      return this.isShown ? 'table-context-menu__shown' : 'table-context-menu__hidden';
    }
  }
}
</script>

<style lang="scss">
.table-context-menu {
  border: 1px solid #ddd;
  padding: 10px 5px;
  display: inline-block;
  position: absolute;
  background-color: #fff;

  &__shown {
    opacity: 1;
  }

  &__hidden {
    opacity: 0;
    pointer-events: none;
  }

  &__invert {
    // clear: both;

    .table-context-menu_button-wrap {
      float: right;
    }
  }

  &_button-wrap {
    padding: 0 5px;
  }

  &_button, &_link {
    text-transform: capitalize;
  }

  &_icon {
    color: #fff;
  }
}
</style>
