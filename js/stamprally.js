let v = null;
var ctx = null;

function read(a) {
    post(a);
}

function captureToCanvas() {
    if (ctx) {
        try {
            ctx.drawImage(v, 0, 0);
            try {
                qrcode.decode();
            }
            catch (e) {
                setTimeout(captureToCanvas, 500);
            };
        }
        catch (e) {
            alert(e);
            setTimeout(captureToCanvas, 500);
        };
    }
}

function success(stream) {
    v.srcObject = stream;
    v.play();
    initCanvas();
    setTimeout(captureToCanvas, 500);
}

function error(error) {
    alert(error.name);
    alert(error);
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function initStampRally(videoId, imageId) {

    if (!isCanvasSupported()) {
        alert("お使いの端末ではご使用になれません");
    }

    if (!getUserID()) {
        var res = confirm("まずログインしてください");
        if (res) {
            login();
        } else {
            location.href = "./";
        }
        return;
    }


    //img = document.getElementById(imageId);
    //img.src = "https://suishosai-server-php.herokuapp.com/createStampCard.php?accessToken=" + getUserID();

    v = document.getElementById(videoId);

    qrcode.callback = read;
    

    setwebcam();
}

function initCanvas(){
    var w = window.innerWidth * 0.9;
    var h = window.innerHeight * 0.9;

    v.style.width = w + "px";
    v.style.height = h + "px";
    v.style.position = "absolute";
    v.style.top = 20 + "px";
    v.style.left = (window.innerWidth - w) / 2;

    var canvas = document.createElement("canvas");
    canvas.id = "qr-canvas";
    canvas.style.visibility = "hidden";
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    document.body.appendChild(canvas);
}

function setwebcam() {

    var n = navigator;
    if (n.mediaDevices && n.mediaDevices.getUserMedia) {
        n.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        }).then(success);
    } else {
        MediaStreamTrack.getSources(function (sourceInfos) {
            var videoSource = null;
            for (var i = 0; i != sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === 'video'
                    && sourceInfo.facing === 'environment') {
                    videoSource = sourceInfo.id;
                }
            }
            sourceSelected(videoSource);
        });
        function sourceSelected(videoSource) {
            var constraints = {
                audio: false,
                video: {
                    optional: [{
                        sourceId: videoSource
                    }]
                }
            };
            if (n.getUserMedia) {
                n.getUserMedia(constraints, success, error);
            } else if (n.webkitGetUserMedia) {
                n.webkitGetUserMedia(constraints, success, error);
            } else if (n.mozGetUserMedia) {
                n.mozGetUserMedia(constraints, success, error);
            }
        }
    }

}

function post(content) {
    var url = "https://suishosai-server-php.herokuapp.com/redirect2.php";
    var data = createStampRallyRequestUrl(content);
    var callback = function (e) {
        var status = e.target.status;
        var readyState = e.target.readyState;
        var response = e.target.responseText;
        if (status === 200 && readyState === 4) {
            if (response === "No result") {
                alert("翠翔祭スタンプラリーのQRコード以外のQRを読み込みました");
                setTimeout(captureToCanvas, 500);
                return;
            }
            else if (response === "already got") {
                alert("もうそのスタンプは押されています");
                setTimeout(captureToCanvas, 500);
                return;
            }
            else if (response === "No user") {
                alert("先にログインしてください");
                setTimeout(captureToCanvas, 500);
                return;
            } else {
                alert("スタンプを押しました!");
                //img.src = "https://suishosai-server-php.herokuapp.com/createStampCard.php?accessToken=" + getUserID() + "&random=" + Date.now().toString();
                setTimeout(captureToCanvas, 500);
            }
        }
    }

    postData(url, data, callback);
}