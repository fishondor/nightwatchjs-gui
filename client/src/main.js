import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import { serverService } from './providers/Server';
import { loggerService } from './providers/Logger';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  serverService,
  loggerService,

  created: function(){
    serverService.init(loggerService);
  },

  vuetify,
  render: h => h(App)
}).$mount('#app')
