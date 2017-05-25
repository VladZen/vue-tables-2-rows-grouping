<template>
  <span>
    <span> {{ data.symbol }} </span>

    <span class="user-widget">
      <img class="user-widget_image"
            v-for="user in data.users"
            :key="user.id" 
            :src='get_avatar_image(user.avatar_tag)'
            :title="user.email">
    </span>
  </span>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    get_avatar_image(name) {
      let images = require.context('../assets/images/', false, /\.svg$/);
      return images(`./${name}.svg`);
    }
  }
}
</script>

<style lang='scss' scoped>
.user-widget {
  display: inline-block;

  &_image {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
</style>
