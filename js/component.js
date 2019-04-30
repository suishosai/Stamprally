
const myconfig = {
    LINE_LOGIN_URL: "https://suishosai-server.herokuapp.com/gotoauthpage",
}
/**
 * This event is called when component which has loginBtn class is clicked.
 * Then call login function.
 */
document.addEventListener("click", function(e){
    var target = e.target;
    if (target.classList.contains("loginBtn")){
        target.src = "./img/btn_login_press.png";
        if(getUserID()){
            alert("既にログインしています");

        }else{
            login();
        }
    }
})

function login(){
    location.href = myconfig.LINE_LOGIN_URL;
}

/**
 * This event is called when mouse pointer moves on login button
 */
document.addEventListener("mouseover", function(e){
    var target = e.target;
    if (target.classList.contains("loginBtn")) {
        target.src = "./img/btn_login_hover.png";
    }
})

/**
 * This event is called when mouse pointer leaves login button
 */
document.addEventListener("mouseout", function (e) {
    var target = e.target;
    if (target.classList.contains("loginBtn")) {
        target.src = "./img/btn_login_base.png";
    }
})

function postData(url, data, callback){

    var xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

    xhr.onreadystatechange = callback;

    xhr.send(data);
}

function createVoteRequestUrl(data1, data2, data3, data4){
    var str = 
    createRequest("data1", data1) + "&" + 
    createRequest("data2", data2) + "&" + 
    createRequest("data3", data3) + "&" + 
    createRequest("data4", data4) + "&" + 
    createRequest("accessToken", getUserID());

    return str;
}

function createStampRallyRequestUrl(content){
    var str =
    createRequest("text", content) + "&" +
    createRequest("accessToken", getUserID());

    return str;
}

function createRequest(name, value){
    return name + "=" + value;
}

function getUserID(){
    return window.localStorage.getItem("userid");
}

function getQueryString() {
    var result = {};
    if (1 < window.location.search.length) {
        var query = window.location.search.substring(1);

        var parameters = query.split('&');

        for (var i = 0; i < parameters.length; i++) {
            var element = parameters[i].split('=');

            var paramName = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);

            result[paramName] = paramValue;
        }
    }
    return result;
}