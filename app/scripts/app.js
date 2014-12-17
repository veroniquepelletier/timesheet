'use strict';

/**
 * @ngdoc overview
 * @name timesheetApp
 * @description
 * # timesheetApp
 *
 * Main module of the application.
 */
angular
  .module('timesheetApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
