import {PLATFORM} from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia with Redux';
    config.map([
      { route: ['', 'welcome'], name: 'welcome', moduleId: PLATFORM.moduleName('./views/welcome'), nav: true, title: 'Welcome' }
    ]);

    this.router = router;
  }
}
