import Vue from 'vue';

const COMMIT_NAME = 'setNotification';

class NotificationsService{

    init(store){
        this.store = store;
    }

    info(message){
        this.store.commit(COMMIT_NAME, {show: true, text: message, color: 'info'});
    }

    warn(message){
        this.store.commit(COMMIT_NAME, {show: true, text: message, color: 'cyan darken-2'});
    }

    error(message){
        this.store.commit(COMMIT_NAME, {show: true, text: message, color: 'error'});
    }

    success(message){
        this.store.commit(COMMIT_NAME, {show: true, text: message, color: 'success'});
    }

}

const notificationsService = new NotificationsService();

Vue.mixin( {
  beforeCreate() {
    const options = this.$options;
    if ( options.notificationsService )
      this.$notificationsService = options.notificationsService;
    else if ( options.parent && options.parent.$notificationsService )
      this.$notificationsService = options.parent.$notificationsService;
  }
} );

export {
    notificationsService,
    NotificationsService
};