<template>
  <button class='btn btn-default btn-sm' type='button' @click='toggle'>
    <i class='glyphicon'
      v-bind:class="iconClass">
    </i>
  </button>
</template>

<script>
import { Event } from 'vue-tables-2';

export default {
  props: ['data'],
  methods: {
    toggle() {
      this.data.is_favorite = !this.data.is_favorite;
      Event.$emit('table-row:favorite-clicked', this.data);
    }
  },
  computed: {
    iconClass() {
      return {
        'glyphicon-star-empty': !this.data.is_favorite,
        'glyphicon-star': this.data.is_favorite
      };
    }
  }
}
</script>
