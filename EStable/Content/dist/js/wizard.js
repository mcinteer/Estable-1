(function() {
    var wizard = angular.module("wizard", ["ngRoute"]);

    wizard.config(function($routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "src/views/email.html",
                controller: "wizardEmailController"
            })
            .when("/stable", {
              templateUrl: "src/views/stable.html",
              controller: "wizardStableController"
            })
            .when("/financial", {
              templateUrl: "src/views/financial.html",
              controller: "wizardFinancialController"
            })
            .when("/charge", {
              templateUrl: "src/views/charge.html",
              controller: "wizardChargeController"
            })
            .otherwise({ redirectTo: "/" });
    });
}());

(function() {
    "use strict";
    var wizard = angular.module("wizard"),
    wizardApi = function($http) {
        var postStable = function (stable) {
            return $http({
                url: "http://establewizardapi.azurewebsites.net/stable",
                method: "POST",
                data: stable
            });
        },
        getData = function(dataType, email){
          return $http({
              url: "http://establewizardapi.azurewebsites.net/" + dataType + "/" + email,
              method: "GET",
          });
        },
        postFinancial = function(financial){
            return $http({
                url: "http://establewizardapi.azurewebsites.net/financial",
                method: "POST",
                data: financial
            });
        };

        return {
            getData: getData,
            postStable: postStable,
            postFinancial: postFinancial
        };
    };

    wizard.factory("wizardApi", wizardApi);
    wizard.config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;
  });
}());

(function(){
	"use string";
	var wizard = angular.module("wizard");

	var error = function(){
		var handle = function(data){
			console.log(data);
		};
	};

	wizard.service("error", error);
}());

(function(){
  "use strict";

  var wizard = angular.module("wizard"),
  validation = function(){
   var maxLength = 150,
   minLength = 2,
   emailPattern= /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+/g,
   getMaxLengthMessage = function(){
      var message = "please enter less than " + maxLength + " characters";
      return message;
    },
    getMinLengthMessage = function(){
      var message = "please enter more than " + minLength  + " characters";
      return message;
    },
    getRequiredMessage = function(){
      return "required";
    },
    messages = {
       maxlength: getMaxLengthMessage(),
       minlength: getMinLengthMessage(),
       required: getRequiredMessage()
     };

    return{
      maxLength: maxLength,
      minLength: minLength,
      emailPattern: emailPattern,
      messages: messages
    };
  };
  wizard.service("validation", validation);
}());

(function () {
    "use strict";
    var wizard = angular.module("wizard"),
    BaseController = function ($scope, $rootScope, validation) {
        var user = {
            email : "",
            stableName: ""
        };

        $rootScope.user = user;
        $scope.validation = validation;
        $scope.title = "eStable Creation";
    };

    wizard.controller("BaseController", ["$scope", "$rootScope", "validation", BaseController]);
}());

(function(){
  "use strict";
  var wizard = angular.module("wizard"),
  wizardStableController = function($scope, $rootScope, wizardApi){
    var onGetStableComplete = function(data){
      $scope.stable = JSON.parse(data.data);
    };

    var onError = function(data){
      console.log(data);
    };

    $scope.postStable = function(stable) {
      var onPostStableComplete = function(data) {
        $rootScope.user.stableName = data.config.data.stableName;
      };

      stable.stableEmail = $rootScope.user.email;

      wizardApi.postStable(stable)
      .then(onPostStableComplete, onError);
      //.then(onPostStableComplete, error.handle());
    };

    wizardApi.getData("stable", $rootScope.user.email)
    .then(onGetStableComplete, onError);
    //.then(onGetStableComplete, error.handle());
  };

  wizard.controller("wizardStableController", ["$scope", "$rootScope", "wizardApi", wizardStableController]);
}());

(function () {
  "use strict";
    var wizard = angular.module("wizard"),
    wizardEmailController = function($scope, $rootScope, $location) {

        $scope.storeEmail = function(email) {
          $location.path('/stable');
          $rootScope.user.email = email;
        };
    };
    wizard.controller("wizardEmailController", ["$scope", "$rootScope", "$location", wizardEmailController]);
}());

(function () {
  "use strict";
    var wizard = angular.module("wizard"),
    wizardNavigationController = function($scope, $location) {

        /**
        *Takes the user to the section selected.
        */
        $scope.navigate = function(path) {
          $location.path(path);
        };

        /**
        * controlls the active clas sto be set on the current view of the wizard.
        */
        $scope.menuClass = function(page) {
         var current = $location.path().substring(1);
         return page === current ? "active" : "";
       };
    };
    wizard.controller("wizardNavigationController", ["$scope", "$location", wizardNavigationController]);
}());

(function () {
  "use strict";
    var wizard = angular.module("wizard"),
    wizardChargeController = function($scope, $rootScope, wizardApi) {

    	var onGetChargeComplete = function(data){
            $scope.charge = JSON.parse(data.data);
            $scope.charge.TaxDate = new Date($scope.charge.TaxDate);
    	};

    	var onError = function(data){
	      console.log(data);
	    };


        $scope.postcharge = function(charge) {
        	var onPostChargeComplete = function(data){
        		console.log(data);
        	};

        	charge.stableEmail = $rootScope.user.email;

        	wizardApi.postCharge(charge)
        	.then(onPostChargeComplete, onError);
        };

        wizardApi.getData("charge", $rootScope.user.email)
        .then(onGetChargeComplete, onError);
    };

    wizard.controller("wizardChargeController", ["$scope", "$rootScope", "wizardApi", wizardChargeController]);
}());

(function () {
  "use strict";
    var wizard = angular.module("wizard"),
    wizardFinancialController = function($scope, $rootScope, wizardApi) {

    	var onGetFinancialComplete = function(data){
            $scope.financial = JSON.parse(data.data);
            $scope.financial.TaxDate = new Date($scope.financial.TaxDate);
    	};

    	var onError = function(data){
	      console.log(data);
	    };


        $scope.postFinancial = function(financial) {
        	var onPostFinancialComplete = function(data){
        		console.log(data);
        	};

        	financial.stableEmail = $rootScope.user.email;

        	wizardApi.postFinancial(financial)
        	.then(onPostFinancialComplete, onError);
        };

        wizardApi.getData("financial", $rootScope.user.email)
        .then(onGetFinancialComplete, onError);
    };

    wizard.controller("wizardFinancialController", ["$scope", "$rootScope", "wizardApi", wizardFinancialController]);
}());
