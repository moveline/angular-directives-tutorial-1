var app = angular.module('app', []);

app.controller('ContactsCtrl', function($scope) {
  $scope.moveliners = [
    {name: 'Brittany', title: 'Move Captain', img_title: 'brittany-seaton'},
    {name: 'Russell', title: 'Move Navigator', img_title: 'russell-matney'},
    {name: 'Adam', title: 'Driver, Foreman', img_title: 'adam-gibbons'}
  ];
});

app.directive('mvlnContacts', function() {
  return {
    restrict: 'EA',
    templateUrl: './moveliner.html',
    scope: {
      contacts: '='
    },
    link: function(scope, element, attributes) {
      scope.contact = scope.contacts[0];

      element.bind('buton').bind('click', function() {
        if (scope.contact == scope.contacts[scope.contacts.length - 1]) {
          scope.$apply(function() { scope.contact = scope.contacts[0]; });
        } else {
          scope.$apply(function() {
            scope.contact = scope.contacts[scope.contacts.indexOf(scope.contact) + 1];
          });
        }
      });
    }
  }
});