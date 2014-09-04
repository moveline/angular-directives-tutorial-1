# How to build directives in Angular.js, Part 1

This repo accompanies a tutorial on building Angular.js directives. You can read that tutorial at http://product.moveline.com/angular-directive-part-1.html.

## Objectives &amp; outcomes
By the end of this lesson, you will 1) know how to buid a basic Angular.js directive, and 2) have a conceptual understanding of what a directive is and how it relates to DOM model.

- Demo:
- Code: 

## The problem
Our typical customer has more than one point of contact within our company, Moveline. So, once a customer logs into our web app, we’d like to display those contacts in a friendly little sidebar widget. We’ll be using this widget across multiple views, so we need to build something that’s modular and encapsulated - something that reduces to a line or two of code that you can drop anywhere and trust that it’ll work. Sounds like the perfect use-case for a directive!

## What’s a directive?
A directive is basically a way to extend the capabilities of HTML. To create a directive, we plant a flag on a DOM element. After the browser loads and Angular begins compiling, it finds this flag and builds a new behavior into the loaded page. Once completed, our directive has unpacked itself into a new web component with whatever structure and interactions we directed it to build. Pretty neat, right?

In the next ten minutes we’re going to teach the browser how to build a custom DOM element that displays the Moveliners associated with one customer’s move.

## File structure
We’re keeping this super simple so we can just focus on, you know, directives. This probably isn’t the file structure you’d want when building your massive, speedy, bug-free application.

    # File structure

    /
    --app.js
    --index.html
    --moveliner.html
    --styles.css

## Building the directive

First, let's create our HTML template.

    <!-- index.html -->

    <html>
      <head>
        <title>Build a directive in Angular.js | Part 1</title>
        <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js"></script>
      </head>
      <body ng-app="app">
        <div ng-controller="ContactsCtrl">
        </div>
        <script src="./app.js"></script>
      </body>
    </html>

There are a couple of things to note here:

1. We've put `ng-app`, the root element of of our Angular app, in the `body` tag. Angular finds this element, takes a deep breath, and then auto-bootstraps. I actually managed to [capture this on video](https://www.youtube.com/watch?v=0CaYDequz0E) a while back.

1. Within our app, we've created one controller, `ContactsCtrl`. We're going to use this controller to pass data - specifically, an array of objects representing our Moveline contacts - into our directive.

Let's build that controller.

    <!-- app.js -->
    var app = angular.module('app', []);

    app.controller('ContactsCtrl', function($scope) {
      $scope.moveliners = [
        {name: 'Brittany', title: 'Move Captain', img_title: 'brittany-seaton'},
        {name: 'Russell', title: 'Move Navigator', img_title: 'russell-matney'},
        {name: 'Adam', title: 'Driver, Foreman', img_title: 'adam-gibbons'}
      ];
    });

This is pretty straightforward stuff - we're taking an array of Moveliners and putting them on the scope of the controller. What's crucial to understand is *why* we're doing this. Now that this controller has reference to scope, all we need to do is build our directive and give it reference to that scope as well. Once we've done that, we'll have a directive and controller that both have access to the same data.

Let's nest the directive within the controller so that we can easily give them reference to the same scope:

    <!-- index.html -->
    <div ng-controller="ContactsCtrl">
      <mvln-contacts></mvln-contacts>
    </div>

See that strange, totally W3C non-compliant HTML element? That's our shiny, new, custom controller! It's not much yet - just that "flag" we mentioned earlier, a marker of sorts that we leave for Angular to find. We "namespace" our tags with `mvln` so that they don't collide with directives from other libraries; it's entirely possible that somebody else out there has created a `<contacts>` directive buried in a library we might integrate tomorrow, and that would be annoying.

Now for the exciting part! We need to give Angular directions for what to do when it finds our new element, `<mvln-contacts>`. This is where the magic happens.

Let's place this directive directly below the controller in `app.js` for simplicity's sake. We'll start slowly so you can get a feel for what this looks like, and then we'll add our custom behavior.

    <!-- app.js -->
    app.directive('mvlnContacts', function() {
      return {
        restrict: 'E',
        template: '<p>hello world!</p>'
      }
    });

Here's our directive! It's still a baby and it doesn't do much yet, but it's a functional directive. We're giving it a name to associate it with our DOM element, and we're returning an object with two properties. Let's walk through this before moving on.

1. See how the directive name, `mvlnContacts`, is camelCase-normalized, whereas the tag name, `mvln-contacts`, is dash-delimited? Since HTML is case-insensitive, Angular takes the tag name, strips the dashes, and camelCases the result before matching it to a directive. So remember, `<mvln-contacts>` in HTML land -> `mvlnContacts` in Javascript land.

1. `restrict` specifies how a directive should be represented in HTML. We're using what I think is the most fun approach, `E`, which creates a new HTML element. There are a couple other ways. `A` allows you to create a directive from an attribute, e.g. `<div crazy-directive-thing></div>`, and `C` lets you use the `class` attribute. You can also use these in conjuction, e.g. `AEC`. I always try to use `E` and `A`, since it's very obvious to my colleages that I'm building a directive when they see stuff other than HTML in an HTML tag. I usually avoid building directives using classes to avoid overloading the `class` attribute's responsibilities. Stylesheets and classes have enough to worry about already, hide additional functionality in them that other developers have to piece together?

1. `template` &ndash; The value of this property will be inserted into `<mvln-contacts></mvln-contacts>` after angular compiles. In the next step we'll load a template instead of in-lining a silly `<p></p>` tag, but the point here is that if you run this code and refresh the browser, you'll see that `hello world!` does indeed compile. That's pretty sweet.

Now that we've covered the basics, let's build a little more complexity into our directive. We'll start by adding an attribute to our HTML tag that lets us pass in data (the array of Moveliners mentioned earlier).

    <!-- index.html -->

    <div ng-controller="ContactsCtrl">
      <mvln-contacts contacts="moveliners"></mvln-contacts>
    </div>

Remember that `$scope.moveliners` array in `ContactsCtrl`? Well, now we're making it available to our directive by passing it as the value of a `contacts` attribute. Let's get back to our directive and build it out to make use of this new data.

    app.directive('mvlnContacts', function() {
      return {
        restrict: 'EA',
        templateUrl: './moveliner.html',
        scope: {
          contacts: '='
        },
        link: function(scope, element, attributes) {
          scope.contact = scope.contacts[0];

          element.find('button').bind('click', function() {
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

Alright, let's walk through what we've added.

1. `restrict` &ndash; Now that we're using attributes as well as HTML elements, we need to update the `restrict` property's value to `EA`.

1. `templateUrl` &ndash; Think of this like an `ng-include`. We've built out a better-looking template which we'll look at soon. Since it's more than one line long, we've separated it out into a new file.

1. `scope` &ndash; This option creates an isolate scope, meaning that we're separating the scope inside our directive from the outside scope. We can then control exactly how we bind data from outside scope to our directive. `contacts: '='` means that we're mapping whatever data is passed as the value of the `contacts` attribute to an internal scope variable that's also called `contacts`. I know, that's a mouthful. We'll dive deeper into this scope stuff later in this series - for now, let's not get too bogged down here.

1. `link` &ndash; We use this function to interact with scope inside our directive, and to manipulate the DOM. It takes three arguments: `scope`, `element`, and `attrs`.

We're almost done. Last thing we need to do is create that that HTML template that we referenced from the `templateUrl` property in our directive. Again, think of this like an `ng-include` file. Let's display one point of contact. Since we're assigning one object from the `contacts` array to `scope.contact`, this template can access any property on that `contact`. And when a user clicks that button, `scope.contact` just moves to the next object in the array, displaying another contact. Not too bad!

    <!-- moveliner.html -->

    <h1>Your Moveline Team</h1>
    <div class="moveliner">
      <img class="headshot" src="//mvlncdn.com/images/headshots/{{contact.img_title}}.jpg" />
      <h1 class="name">{{contact.name}}</h1>
      <p class="title">{{contact.title}}</p>
      <button class="btn">Next</button>
    </div>


And that's it! In case you missed it up top, here's the code and a working demo of this tutorial. Look for Part 2 coming soon.

- Demo: 
- Code: 