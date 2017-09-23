myApp.controller('singleCtrl', ['$routeParams', '$http', '$location', '$route', 'queryService', 'authService', function ($routeParams, $http, $location, $route, queryService, authService) {

    //check if logged
    this.logged = function () {
        
        if (queryService.log == 1) {
            return 1;
        } else {
            if (queryService.log == 0) {
                $location.path('/');
            }
        }
    }

    //Get the name of the user
    this.getName = function () {
        //get user if logged in
        queryService.getUser()
            .then(function successCallBack(response) {
                main.user = response.data.name;
                main.userID = response.data.id;
                queryService.log = 1;
            });
    }

    var main = this;
    this.tno = $routeParams.tno;
    this.userId = $routeParams.userId;

    //get single query conversations
    this.viewQuery = function (tno) {

        queryService.singleQuery(tno)
            .then(function successCallBack(response) {
                var data = response.data.data;
                main.title = data.queryTitle;
                main.Deatils = data.queryDetails;
                main.messages = data.message;
                main.ticketStatus = data.ticketStatus;
                main.sender = data.name;
                main.date = data.createdAt;
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });
    } 

    this.viewQuery(this.tno);

    //create new message
    this.createMessage = function () {
        var data = {
            queryText: main.queryText
        }
        var tno = main.tno;
        if (main.user === "Admin") {
            queryService.newAnswer(tno, data)
                .then(function successCallBack(response) {
                    var data = response.data.data;
                    main.messages = data.message;
                    main.createdAt = data.createdAt;
                    $('#messageText').val('');

                }, function errorCallBack(response) {
                    alert("Error Check console");
                });

        } else {
            queryService.newChatMsg(tno, data)
                .then(function successCallBack(response) {
                    var data = response.data.data;
                    main.messages = data.message;
                    main.createdAt = data.createdAt;
                    $('#messageText').val('');

                }, function errorCallBack(response) {
                    alert("Error Check console");
                });
        }
    } 


    //check if sender is admin
    this.isAdmin = function (sender) {
        return (sender !== main.user);
    }

    //open/close a query
    this.openclose = function () {

        queryService.openClose(main.tno)
            .then(function successCallBack(response) {
                main.viewQuery(main.tno);
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });
    } 

    //get status of ticket
    this.getStatus = function () {
        if (main.ticketStatus === "Open") {
            return "Close Ticket";
        } else {
            return "Reopen Ticket";
        }
    }

    //logout
    this.logout = function () {
        authService.setToken();
        main.user = '';
        queryService.logged = 0;
        $location.path('/');
    }
}]);
