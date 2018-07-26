(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($rootScope, MemberService, UserService) {
        var vm = this;

        vm.user = null;
        vm.expired = [];
        vm.expire = [];
        vm.expiring = [];
        initController();
		
		vm.backupdata=function(req,res){
		 MemberService.getBackup().then(function (mem) {
		 console.log(mem);
		 });
		
		}

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.user = user;
            });

            MemberService.getCount().then(function (mem) {
                var d = new Date();
                var m = new Date();
                m.setDate(d.getDate() + 1);
                var todayop = ('0' + (d.getMonth() + 1)).slice(-2) + '/'+  ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear();
                
                var tomorrowop = ('0' + (m.getMonth() + 1)).slice(-2) + '/' + ('0' + m.getDate()).slice(-2) + '/' + m.getFullYear();

               

                console.log('todayop');

                console.log(mem);

                vm.expire = mem.filter(function (a) {
                    var ee = new Date(a.enddate);
                    var tp = new Date(todayop);
                    return (
    ee.getFullYear() === tp.getFullYear() &&
    ee.getMonth() === tp.getMonth() &&
    ee.getDate() === tp.getDate()
  );
                    
                });



                vm.expired = mem.filter(function (a) {
                    return new Date(a.enddate) < new Date(todayop);
                });

                vm.expiring = mem.filter(function (a) {
                    return (new Date(a.enddate) > new Date(todayop) && new Date(a.enddate) <= new Date(tomorrowop));
                });
               
            });
        }
    }

})();