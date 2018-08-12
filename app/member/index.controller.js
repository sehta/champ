(function () {
    'use strict';

    angular
        .module('app')
        .controller('Member.IndexController', Controller);

    function Controller($scope, $rootScope, $window, UserService, MemberService, FlashService, $http, $location, $stateParams) {
        var vm = this;
        vm.saveMember = saveMember;
        vm.clearflash = clearflash;
        vm.clearMember = clearMember;
        vm.regupdate = regupdate;
        vm.goBack = goBack;
        vm.myFile = null;
        vm.user = null;
        var sdate = new Date();
        var startdate = (sdate.getMonth() + 1) + "/" + sdate.getDate() + "/" + sdate.getFullYear();

        var edate = new Date();
        edate.setMonth(sdate.getMonth() + 1);
        var enddate = (edate.getMonth() + 1) + "/" + edate.getDate() + "/" + edate.getFullYear();
        vm.member = { 'regno': '', 'firstname': '', 'lastname': '', 'gender': 'male', 'joining':'', 'email': '', 'dob': '', 'occupation': '', 'phone': '', 'address': '', 'dob': '', 'subscription': 'Monthly', 'startdate': startdate, 'enddate': enddate, 'amount': '', 'amountstatus': 'paid', 'pendingamount': '', 'trainer': '', 'facility': 'Basic Plan', 'logo': '/images/default_avatar_male.jpg' };
        vm.uploadFile = uploadFile;
        vm.itemsPerPage = "10";
        vm.users = []; //declare an empty array
        //$http.get("/mockJson/mock.json").success(function (response) {
        //    console.log(response);
        //    vm.users = response;  //ajax request to fetch data into $scope.data
        //    console.log(vm.users);
        //});
		vm.filename=(sdate.getMonth() + 1) + "-" + sdate.getDate() + "-" + sdate.getFullYear();
		vm.allusers=[];
        vm.ttl = 0;
		vm.filterby="start";
		
		
		vm.getHeader = function () {return ["ID", "Registraion Number", "First Name","Last Name", "Gender", "Joining Date", "Email","DOB","Designation","Contact","Address","Package","StartDate","EndDate","Deposit","Payment Status","Pending Amount","Trainer","Image Path"]};
		
		vm.allMember=function(){
		var mem=vm.allusers;
		vm.users = mem;
		vm.start='';
		vm.end='';
		}
		
		vm.getMember=function(){
		var mem=vm.allusers;
		vm.users = mem;
		if(vm.filterby=='start'){
		 vm.users = mem.filter(function (a) {
			return (new Date(a.startdate) >= new Date(vm.start) && new Date(a.startdate) <= new Date(vm.end));
         });
		
		}
		else
		{
		 vm.users = mem.filter(function (a) {
		        return (new Date(a.enddate) >= new Date(vm.start) && new Date(a.enddate) <= new Date(vm.end));
                });
		}
		}

        vm.sort = function (keyname) {
            vm.sortKey = keyname;   //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }

		vm.updateUserPicture=function(flogo){
		 vm.member.logo = flogo;
		}
		
        vm.changeDate = function ()
        {
            debugger;
            var addmonth = 1;
            if (vm.member.subscription == "Quartly") addmonth = 3;
            if (vm.member.subscription == "HalfYearly") addmonth = 6;
            if (vm.member.subscription == "Yearly") addmonth = 12;
            if (vm.member.startdate.trim() != "") {
                var getdate = vm.member.startdate.split('/');
                var edate = new Date(getdate[2], getdate[0] - 1, getdate[1]);
                edate.setMonth(edate.getMonth() + addmonth);
                var enddate = (edate.getMonth() + 1) + "/" + edate.getDate() + "/" + edate.getFullYear();
                vm.member.enddate = enddate;
            }
            regupdate();
        }

        initController();

        $scope.$watch('vm.myFile', function (newval,oldval) {
            if (newval != null)
            {
                uploadFile();
            }
        });

        function goBack() {
            $location.path("/allmember");
        }

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.user = user;
                
            });
            
            if (typeof $stateParams.regno == 'undefined') {
                MemberService.getCount().then(function (mem) {
                   
                    vm.allusers=mem;
                    vm.users = mem;  
					console.log(vm.users);
					//ajax request to fetch data into $scope.data
                   // vm.member.regno = vm.member.facility.charAt(0) + "-" + vm.member.subscription + "-Gym-" + parseInt(vm.users.length + 1);
                });
            }
            else {
                vm.member.regno = $stateParams.regno;
                MemberService.GetByRegNo(vm.member.regno)
                .then(function (mem) {
                    if (mem)
                        vm.member = mem;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

            }

        }

        function saveMember() {
           
                MemberService.Create(vm.member)
                    .then(function () {
                        FlashService.Success('Member Saved');
                        clearMember();
                        goBack();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            
        }

        function regupdate()
        {
           // vm.member.regno = vm.member.facility.charAt(0) + "-" + vm.member.subscription + "-Gym-" + parseInt(vm.users.length + 1);

        }

        function clearMember()
        {
            vm.member = { 'regno': '', 'firstname': '', 'lastname': '', 'gender': 'male', 'joining':'', 'email': '', 'dob': '', 'occupation': '', 'phone': '', 'address': '', 'dob': '', 'subscription': 'Monthly', 'startdate': '', 'enddate': '', 'amount': '', 'amountstatus': 'paid', 'pendingamount': '', 'trainer': '', 'facility': 'Basic Plan', 'logo': '/images/default_avatar_male.jpg' };
            
          //  vm.member.regno = vm.member.facility.charAt(0) + "-" + vm.member.subscription + "-Gym-" + parseInt(vm.users.length + 1);

            
        }

        function clearflash() {
            FlashService.Clear();
        }

        function uploadFile () {

            var file = vm.myFile;
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);


            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (msg) {
                vm.member.logo = "/uploads/" + msg;
                console.log(msg);
                console.log("success!!");
            })
            .error(function () {
                console.log("error!!");
            });
        };
    }

})();