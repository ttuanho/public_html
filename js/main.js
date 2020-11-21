// const backend_url = "https://robotic-column-277322.uc.r.appspot.com/"
const backend_url = "http://127.0.0.1:8080/"



// There's always a cookie key of '_s' to track 
// device activity. So this functions check if 
// it the requests have it. Otherwise, create one.
function checkInitIpInCookie() {
    getUserIP(ip => {
        console.log("ip = ", ip);
    });
    var init_cookie = getCookie('_ip');
    if (!isDefined(init_cookie)) {
        setCookie('_ip', getClientIp(), 36500);
    }
}

function getClientIp() {
    fetch("http://ipinfo.io", function (response) {
        console.log(response);
        return response.ip;
    });  
}
function getClientCity() {
    fetch("http://ipinfo.io", function (response) {
        return response.city;
    });  
}
function getClientRegion() {
    fetch("http://ipinfo.io", function (response) {
        return response.region;
    });  
}

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }, noop); 

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

function isDefined(arg) {
    if (arg === undefined || arg === null || typeof arg === "undefined") {
        return false;
    } else {
        return true;
    }
  }
  

function trimSpace(s){ 
    return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
}

function randomString(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

function setCookie(fieldName, fieldValue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = fieldName + "=" + fieldValue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// There's always a cookie key of '_s' to track 
// device activity. So this functions check if 
// it the requests have it. Otherwise, create one.
function checkInitCookie() {
    var init_cookie = getCookie('_s');
    if (init_cookie == "") {
        setCookie('_s', randomString(100), 36500);
    }
}

function checkCookie(field) {
        var username = getCookie(field);
        if (username != "") {
        alert("Welcome again " + username);
        } else {
            username = prompt("Please enter your name:", "");
            if (username != "" && username != null) {
                setCookie("username", username, 365);
            }
    }
}

function expiredCookie(fieldName) {
    document.cookie = fieldName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

function renewActionCookie() {
    const newTempToken = getNewTokenCookie4Action()['_tt'];
    setCookie('_tt', newTempToken, 1);
}
function getNewTokenCookie4Action() {
    let init_cookie = getCookie('_s');
    fetch(backend_url + '/newActionCookie', {
        method: "GET",
        body: JSON.stringify({
            '_s': init_cookie
        })
    })
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

function update_live() {
    fetch(backend_url+"live",)
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// async function getData(url = '', data = {}) {
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: 'get', // *GET, POST, PUT, DELETE, etc.
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: 'same-origin', // include, *same-origin, omit
//       headers: {
//         'Content-Type': 'application/json'
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       redirect: 'follow', // manual, *follow, error
//       referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//       body: JSON.stringify(data) // body data type must match "Content-Type" header
//     });
//     return response.json(); // parses JSON response into native JavaScript objects
// }

// Init function: set cookies, ip addr, etc
(function() {
    
    // Set cookies
    if (!checkInitCookie()) {
        setCookie("_s", randomString(100), 36500);
    }

    // set ip
    setCookie("_session", randomString(100), 0.02083333333);
    checkInitIpInCookie();
    setCookie("_ip", getUserIP(), 10);

    // Update that user is still in the page
    


    // Update changing url
    document.addEventListener("click", e => {
        postData(backend_url+"live",{"action":"click"})
            .then(data => {
                console.log(data);
            });
    });
});


