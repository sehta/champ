(function () {
    'use strict';

    angular
        .module('app')
        .controller('Enquery.IndexController', Controller);

    function Controller($scope, $rootScope, $window, UserService, FlashService, $http, $location, $stateParams) {
        var vm = this;
        vm.saveEnquery = saveEnquery;
        vm.clearflash = clearflash;
        vm.clearMember = clearMember;
        vm.goBack = goBack;
        vm.user = null;
        vm.member = {'fullname': '','gender': 'male', 'email': '', 'occupation': '', 'phone': '', 'address': '', 'edate': '' };
        vm.itemsPerPage = "10";

        initController();

        vm.sort = function (keyname) {
            vm.sortKey = keyname;   //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }

        function goBack() {
            $location.path("/allenquery");
        }

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.user = user;
                
            });
            UserService.getEnquery().then(function (mem) {
                
                vm.users = mem;  //ajax request to fetch data into $scope.data
                console.log(vm.users);
            });

        }

        function saveEnquery() {
           
            UserService.Save(vm.member)
                    .then(function () {
                        FlashService.Success('Enquery Saved');
                        clearMember();
                        goBack();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            
        }

        function clearMember()
        {
            vm.member = { 'fullname': '', 'gender': 'male', 'email': '', 'occupation': '', 'phone': '', 'address': '', 'edate': '' };

        }

        function clearflash() {
            FlashService.Clear();
        }

       
    }

})();