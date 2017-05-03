app.controller('adminController', ['$scope', 'apiService', function($scope, apiService){
    
}]);

app.controller('mainAdminController', ['$scope', 'apiService', 'localStorageService', '$state', function($scope, apiService, localStorageService, $state){
    const info = localStorageService.get('_INFOUSER');

    if(!info) return $state.go('login');

    $scope.username = info.username;

    const init = () => {
        apiService.hotel.getListAll((res) => {
            if(res.isSuccess){
                console.log(res.results);
            }
        });
        
        apiService.user.getLists((res) => {
            let data = res.results;
            let getItems = data.filter((n) => n.roleId == 2);
            $scope.items = getItems;
        });
    };

    init();
}]);