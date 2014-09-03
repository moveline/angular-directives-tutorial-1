var app = angular.module('App', []);

app.controller('ContactsCtrl', function($scope) {
  $scope.contacts = [
    {name: 'Adam', title: 'Director, Thought Engineering'},
    {name: 'Brittany', title: 'Lead Whisperer, Cat Rescue League'},
    {name: 'Russell', title: 'Owner, Javascript n\' drink of Brooklyn'}
  ];
});

app.directive('mvlnContact', function() {
  return {
    restrict: 'EA',
    template: '<div><p>{{contact.name}}</p><button ng-click="next()">Next</button></div>',
    scope: {
      contacts: '='
    },
    link: function(scope, element, attributes) {
      scope.contact = scope.contacts[0];
      scope.next = function() {
        if (scope.contact == scope.contacts[scope.contacts.length - 1]) {
          scope.contact = scope.contacts[0];
        } else {
          scope.contact = scope.contacts[scope.contacts.indexOf(scope.contact) + 1]
        }
      };
    }
  }
});


// var app = angular.module("App", []);

// app.controller("ContactsCtrl", function($scope) {
//   $scope.moveliners = [
//     {name: 'Adam', title: 'Director, Thought Engineering'},
//     {name: 'Brittany', title: 'Lead Whisperer, Cat Rescue League'},
//     {name: 'Russell', title: 'Owner, Javascript n\' drink of Brooklyn'}];
// });

// app.directive("mvlnContacts", function() {
//   return {
//     restrict: 'EA',
//     scope: {
//       contacts: '='
//     },
//     link: function(scope, el, attrs) {
//       scope.contact = scope.contacts[0];
//       scope.next = function() {
//         if (scope.contact == scope.contacts[scope.contacts.length - 1]) {
//           scope.contact = scope.contacts[0];
//         } else {
//           scope.contact = scope.contacts[scope.contacts.indexOf(scope.contact) + 1]
//         }
//       };
//     },
//     template: '<div><p>{{contact.name}}</p><button ng-click="next()">Next</button></div>'
//   };
// });
