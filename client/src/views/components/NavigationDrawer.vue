<template>
    <v-navigation-drawer
        app
        dark
        clipped
        expand-on-hover
        disable-resize-watcher
        permanent>
        <v-list
          dense
          nav
          class="py-0">
          <v-list-item v-for="(menuItem, index) in menuItems" :key="index" link :to=menuItem.route>
            <v-list-item-content>
              <v-list-item-title>{{menuItem.label}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script>
const menuItems = [
  {
    label: "Execute Test",
    route: "/test"
  },{
    label: "Cron Jobs",
    route: "/cron-jobs"
  },{
    label: "New Cron Job",
    route: "/cron-jobs/new"
  },{
    label: "Reports",
    route: "/reports"
  },{
    label: "About",
    route: "/about"
  }
]

export default {
  data: () => ({
        menuItems: menuItems
    }),
}
</script>

<style lang="scss" scoped>
.v-application a{
    color: white;
    text-decoration: none;
}
</style>