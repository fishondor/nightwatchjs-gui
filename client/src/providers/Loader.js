import Vue from 'vue';

const COMMIT_NAME = 'setShowLoader';

class LoaderService{

    init(store){
        this.store = store;
    }

    show(show){
        this.store.commit(COMMIT_NAME, show);
    }

}

const loaderService = new LoaderService();

Vue.mixin( {
  beforeCreate() {
    const options = this.$options;
    if ( options.loaderService )
      this.$loaderService = options.loaderService;
    else if ( options.parent && options.parent.$loaderService )
      this.$loaderService = options.parent.$loaderService;
  }
} );

export {
    loaderService,
    LoaderService
};