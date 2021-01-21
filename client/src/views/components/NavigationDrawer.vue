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
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title><router-link to="/test">Execute Test</router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title><router-link to="/cron-jobs">Cron Jobs</router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title><router-link to="/cron-jobs/new" append>New Cron Job</router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title><router-link to="/reports" append>Reports</router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title><router-link to="/about">About</router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.v-application a{
    color: white;
    text-decoration: none;
}
</style>