myApp.controller('dashCtrl', ['$filter', '$http', '$location', '$routeParams', 'queryService', 'authService', function ($filter, $http, $location, $routeParams, queryService, authService) {

    //check if logged
    this.logged = function () {
        if (queryService.log == 1) {
            return 1;
        } else {
            $location.path('/');
        }
    }

    //Get the name of the user
    this.getName = function () {
        //get user if logged in
        queryService.getUser()
            .then(function successCallBack(response) {
                main.user = response.data.name;
                queryService.log = 1;
            });
    }

    var main = this;
    this.userId = $routeParams.userId;

    //to hide and show parts of query cards
    this.show = false;

    //get current user(checking if admin)
    this.getUser = function () {
        queryService.getUser()
            .then(function successCallBack(response) {
                main.user = response.data.name;
                if (main.user) {

                    //get all queries for admin dashboard
                    queryService.allQueries()
                        .then(function successCallBack(response) {
                            if (response.data.error === true) {
                                main.noQueriesMsg = response.data.message;
                                main.noQueriesDiv = 1;
                            } else {
                                main.adminQueries = response.data;
                                main.getQueries();
                            }
                        });


                }
            });
    }

    this.getUser();

    //get all queries of logged in user
    this.getQueries = function () {
        if (main.user === "Admin") {
            main.heading = "All The Queries Are Listed Below";
            main.allQueries = main.adminQueries;
            main.queries = main.adminQueries;
        } else {
            main.heading = "All Your Queries Are Listed Below";
            queryService.allQueriesOfAUser(main.userId)
                .then(function successCallBack(response) {
                    var data = response.data.data;
                    if (response.data.error) {
                        main.allQueries = [];
                        main.queries = [];
                    } else {
                        main.allQueries = response.data.data;
                        main.queries = response.data.data;
                    }
                }, function errorCallBack(response) {
                    alert("Error!! Check console");
                });
        }
    } 

    //filter open tickets
    this.open = function () {
        main.queries = $filter('filter')(main.allQueries, {
            ticketStatus: "Open"
        });
    }

    //filter closed tickets
    this.close = function () {
        main.queries = $filter('filter')(main.allQueries, {
            ticketStatus: "Close"
        });
    } 

    //filter closed tickets
    this.all = function () {
        main.queries = main.allQueries;
    }

    //filter closed tickets
    this.allUserQueries = function () {
        queryService.allQueries()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    main.noQueriesMsg = response.data.message;
                    main.noQueriesDiv = 1;
                } else {
                    main.queries = $filter('filter')(response.data, {
                        ticketStatus: "Open"
                    });
                }
            });
    } 

    //filter closed tickets
    this.allUserQueriesC = function () {
        queryService.allQueries()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    main.noQueriesMsg = response.data.message;
                    main.noQueriesDiv = 1;
                } else {
                    main.queries = $filter('filter')(response.data, {
                        ticketStatus: "Close"
                    });
                }
            });
    } 

    //delete query
    this.deleteQuery = function (tno, index) {
        queryService.deleteAQuery(tno)
            .then(function successCallBack(response) {
                main.queries.splice(index, 1);
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });

    } 

    //open/close a query
    this.openclose = function (tno) {
        queryService.openClose(tno)
            .then(function successCallBack(response) {
                main.getQueries();
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });
    } 

    //get status of query(open/close)
    this.getStatus = function (index) {

        var query = main.queries[index];
        // console.log(query)
        var status = query.ticketStatus;
        if (status === "Open") {
            return "Close Ticket";
        } else {
            return "Reopen Ticket"
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
