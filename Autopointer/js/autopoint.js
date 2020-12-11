//FACE API ここから 



function processImage() {
    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = "<Subscription Key>";

    var uriBase =
        "https://gskadai.cognitiveservices.azure.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "detectionModel": "detection_01",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
        "returnFaceId": "true"
    };

    console.log(params)


    var type = 'image/jpeg';
    // 撮影したtypeをimgに格納
    var img = capture_image.toDataURL(type);

    var henkan = atob(img.split(',')[1]);

    var uint8array = new Uint8Array(henkan.length);

    for (var i = 0; i < henkan.length; i++) {
        uint8array[i] = henkan.charCodeAt(i);
    }
    var gazou = new Blob([uint8array.buffer], { type: type });


    $.ajax({
        url: uriBase + "?" + $.param(params),

        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        processData: false,
        type: "POST",

        data: gazou
    })

        .done(function (data) {
            var json = $("#responseTextArea").val(JSON.stringify(data, null, 2));
            var features = JSON.parse(JSON.stringify(data))

            const object = JSON.stringify(data, null, 2)

            // console.log(features)
            // console.log(JSON.stringify(data, null, 2))

            // console.log(features.faceAttributes)

// JSON.stringify(data, null, 2)の中のfaceAttributesの中のhappinessの値を取り出したい

            // 方法1
            // for(var i in object) {
            //     console.log(i);  
            //   }

            // 方法2
            // console.log(Object.keys(features)[0]);

            // 方法3
            // console.log(Object.getOwnPropertyNames(object)[0]);

            // 方法4
            // for (var i = 0; i < object.length; i++) {
            //     for (var j = 0; j < object[i]["faceAttributes"].length; j++) {
            //         console.log(object[i]["faceAttributes"][j]);
            //     };
            // };

            // 方法5
            // for (var i = 0; i < object.length; i++) {
            //     for(key in object[i]["faceAttributes"]){
            //         console.log(object[i]["faceAttributes"][key]);
            //     }
            // }


    

            // 方法6conslole.logで確かめたのち、検証ツールのconsoleで「0」がある場合は[0]で表現する
            // console.log(features[0].faceAttributes.emotion.anger)
            // console.log(features[0].faceAttributes.emotion.contempt)
            // console.log(features[0].faceAttributes.emotion.disgust)
            // console.log(features[0].faceAttributes.emotion.fear)
            // console.log(features[0].faceAttributes.emotion.neutral)
            // console.log(features[0].faceAttributes.emotion.sadness)
            // console.log(features[0].faceAttributes.emotion.surprise)
            // console.log(features[0].faceAttributes.emotion.happiness)

            const ikari = Math.round(features[0].faceAttributes.emotion.anger*100);
            const keibetu = Math.round(features[0].faceAttributes.emotion.contempt*100);
            const huyukai = Math.round(features[0].faceAttributes.emotion.disgust*100);
            const kyouhu = Math.round(features[0].faceAttributes.emotion.fear*100);
            const mukansin = Math.round(features[0].faceAttributes.emotion.neutral*100);
            const kanasimi = Math.round(features[0].faceAttributes.emotion.sadness*100);
            const odoroki = Math.round(features[0].faceAttributes.emotion.surprise*100);
            const kouhuku = Math.round(features[0].faceAttributes.emotion.happiness*100);

            var count = 0;
            var second = setInterval(function(){
            console.log(count++); //コンソールに1秒ごと0から順番にカウントアップする数字を表示
            }, 1000);

            var time = (second-2)*3

            let kanjo = `${time}秒後<p>恐怖: ${ikari}点 <br> 軽蔑: ${keibetu}点 <br> 不愉快: ${huyukai}点 <br>
            恐怖: ${kyouhu}点 <br> 無関心: ${mukansin}点 <br> 悲しみ: ${kanasimi}点 <br> 
            驚き: ${odoroki}点 <br> 幸福: ${kouhuku}点</p>`;


            $("#result").append(kanjo);
   
       

        })

        


};


const $video = document.getElementById('video');

window.onload = function(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => $video.srcObject = stream)
        .catch(err => alert(`${err.name} ${err.message}`));
}

var count = 0;
var end = 20;  
var interval = 3000; 
var id = setInterval(
    
   function copyFrame() {



    var canvas_capture_image = document.getElementById('capture_image');
    var canvas_image = canvas_capture_image.getContext('2d');
    var video = document.getElementById('video');



    canvas_capture_image.width = video.videoWidth;
    canvas_capture_image.height = video.videoHeight;
    canvas_image.drawImage(video, 0, 0);

    processImage();
    count += 1;
    
    if (count == end) {
      // 終了させる
      clearInterval(id);
    }
  }
  ,interval
)





// FACE API ここまで