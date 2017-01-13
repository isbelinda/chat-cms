app.service('apiService', ['$http', '$resource', '$state', 'CONFIG', function($http, $resource, $state, CONFIG){
    const REQUEST_API = CONFIG.PATH_API;


    this.login = $resource( `${REQUEST_API}/:route/:id`, {}, {
        login: { method: 'POST', params: {route: 'Login'}, interceptor: {responseError: resourceErrorHandler}, isArray: false }
    });

    this.chat = $resource( `${REQUEST_API}/chat/:route/:id`, {}, {
        updateToken: { method: 'POST', params: {route: 'updateTokenMessage'}, interceptor: {responseError: resourceErrorHandler}, isArray: false },
        sendMessage: { method: 'POST', params: {route: 'AdminSendMessage'}, interceptor: {responseError: resourceErrorHandler}, isArray: false }
    });
}]);


const resourceErrorHandler = (response) =>{
    if(window.console){
        console.log(response);
    }
};