app.service('apiService', ['$http', '$resource', '$state', 'CONFIG', function($http, $resource, $state, CONFIG){
    const REQUEST_API = CONFIG.PATH_API;
    
    this.user = $resource( `${REQUEST_API}/User/:route/:id`, {}, {
        login: { method: 'POST', params: {route: 'Login'}, interceptor: {responseError: resourceErrorHandler}, isArray: false },
        updateToken: { method: 'POST', params: {route: 'updateTokenMessage'}, interceptor: {responseError: resourceErrorHandler}, isArray: false },
        sendMessage: { method: 'POST', params: {route: 'SendMessage'}, interceptor: {responseError: resourceErrorHandler}, isArray: false }
    });
}]);


const resourceErrorHandler = (response) =>{
    if(window.console){
        console.log(response);
    }
};