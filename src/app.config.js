import testAppModule from './app.module';

testAppModule.config(['$routeProvider', '$locationProvider',
  function config($routeProvider, $locationProvider) {

    $routeProvider.when('/stats', {
      template: '<statistic-list-cmp></statistic-list-cmp>'
    }).when('/explore', {
      template: '<h3>Explore page</h3>'
    }).otherwise('/stats');

    $locationProvider.html5Mode(true);
  }]);