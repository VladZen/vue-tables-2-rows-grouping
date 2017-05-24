<template>
  <div v-show="isShown"
        class="table-context-menu"
        :style='{ top: `${coordinates.top}px`, left: `${coordinates.left}px` }'>
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

let defaultData = function () {
  return {
    row: {},
    isShown: false,
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
  }
  else {
    x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  // TODO: uncomment it. gCanvasElement == table-wrapper
  // x -= gCanvasElement.offsetLeft;
  // y -= gCanvasElement.offsetTop;
  return {
    top: y,
    left: x
  };
};

let resetDataAttacher = (function () {
  // TODO: prevent multiple attaching of the listener due to stopPropagation in method
  // trigger
  let isAttached = false;

  return function () {
    if (!isAttached) {
      isAttached = true
      let clickHandler = (e) => {
        e.target.removeEventListener(e.type, clickHandler);
        let defaults = defaultData();
        console.log('one time clicked', e);
        this.$data.isShown = defaults.isShown;
        this.$data.row = defaults.row;
        isAttached = false
    	};

    	document.documentElement.addEventListener('click', clickHandler);
    }
  }
})();

export default {
  props: ['buttons'],
  created() {
    // watch for row click
    Event.$on('vue-tables.row-click', (data) => {
      data.event.stopPropagation();
      let e   = data.event;
      let row = data.row;
      // show context menu
      this.$data.isShown = true;
      this.$data.row = row;
      this.$data.coordinates = countCoordinates(e);
      resetDataAttacher.call(this);
    });
  },
  data: defaultData
}
</script>

<style lang="scss">
.table-context-menu {
  border: 1px solid #ddd;
  padding: 10px 5px;
  display: inline-block;
  position: absolute;
  background-color: #fff;

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
