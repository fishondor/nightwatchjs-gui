import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueResource from "vue-resource";

import { serverService } from './providers/Server';
import { loggerService } from './providers/Logger';
import { notificationsService } from './providers/Notifications';
import { loaderService } from './providers/Loader';

Vue.config.productionTip = false
Vue.use(VueResource);

new Vue({
  router,
  store,
  serverService,
  loggerService,
  notificationsService,
  loaderService,

  created: function(){
    serverService.init(loggerService);
    notificationsService.init(store);
    loaderService.init(store)
  },

  vuetify,
  render: h => h(App)
}).$mount('#app')
