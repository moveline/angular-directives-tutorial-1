var app = angular.module('app', []);

app.controller('ContactsCtrl', function($scope) {
  $scope.moveliners = [
    {name: 'Adam', title: 'Director, Thought Engineering'},
    {name: 'Brittany', title: 'Lead Whisperer, Cat Rescue League'},
    {name: 'Russell', title: 'Owner, Javascript n\' Drink of Brooklyn'}
  ];
});

app.directive('mvlnContacts', function() {
  return {
    restrict: 'EA',
    templateUrl: './moveliner.html',
    scope: {
      contacts: '=contacts'
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