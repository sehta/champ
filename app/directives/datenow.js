angular.module('app').directive('dateNow', ['$filter', function($filter) {
    return {
        link: function ($scope, $element, $attrs, $interval) {
            $interval($element.text($filter('date')(new Date(), $attrs.dateNow)), 1000);
            
        }
    };
}])