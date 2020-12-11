function initMap() {
    var target = document.getElementById('gmap');  
    var infoWindow = new google.maps.InfoWindow; 
    
    if(!navigator.geolocation){ 
      infoWindow.setPosition(map.getCenter());
      infoWindow.setContent('Geolocation に対応していません。');
      infoWindow.open(map);
    }
    
    navigator.geolocation.getCurrentPosition(function(position) { 
      var pos = {  
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var map = new google.maps.Map(document.getElementById('gmap'), {
        // 最初の表示を決める
        // 最初は現在地を表示させる
      center: pos,
      zoom: 18
    });
      
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);  


                // 音声入力
                // ここから
                $(".onsei").on("click", function () {
                    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
                    const recognition = new SpeechRecognition();
                    
                    recognition.onresult = (event) => {
                    console.log(event.results[0][0].transcript);
                    const koe = event.results[0][0].transcript;

                    //   koeを#toutyakuのinputに入力する
                    $("#toutyaku").val(koe);
                    }
                    
                    recognition.start();
                    
                });

                // ここまで




      $(".kensaku").on("click", function () {

      // ルートを取得するリクエスト
      var request = {
           // 出発は現在地
        origin: pos,     
           // 到着はinputに入力された文字列
        destination: document.getElementById("toutyaku").value,
           //車を使用する
        travelMode: 'DRIVING', 
            // これでメートルを取得できるらしいが、実際は0しかconsole.logに出でこなかった
        unitSystem: google.maps.DirectionsUnitSystem.METRIC,    
      };


        console.log(request)
    

        // unitSystemが失敗したため、距離と時間を取得し、金額を弾き出す
        // ここから
    directionsService.route(request,
        function(response, status) { // anonymous function to capture directions
          if (status !== 'OK') {
            window.alert('Directions request failed due to ' + status);
            return;
          } else {
            directionsRenderer.setDirections(response); // Add route to the map
            var directionsData = response.routes[0].legs[0]; 
          // Get data about the mapped route
            if (!directionsData) {
              window.alert('Directions request failed');
              return;
            }
            else {
              document.getElementById('result').innerHTML += 
          " 目的地までの距離" + directionsData.distance.text + 
          " (およそ" + directionsData.duration.text + "かかります)";
            }
          }

          console.log(directionsData.distance)
          console.log(directionsData.distance.text)
          console.log(directionsData.duration)
          console.log(directionsData.duration.text)

          if(directionsData.distance.text>2+"km"){
              console.log("あいう")
          }else{
              console.log("えお")
          }
          
        //   km部分をなくし、数字だけにする
          const suuji = directionsData.distance.text.replace(/[^0-9]/g, '');
          console.log(suuji)

        //   km部分をなくすと例えば3.0kmだと30と表記されてしまうため、10で割る
          const km = suuji/10;
          console.log(km)

        //   初乗り410円で200mあたり80円上昇。小数点を切り上げるためにMath.ceilを使用
          const cost = Math.ceil( 410+km/0.2*80 ) ;
          
        //   kmが1未満なら410円。それ以降は200mあたり80円プラス
        if(km<1){
            console.log("410円");
            document.getElementById('pay').innerHTML += 
          "支払い料金は410円です。";
        }else if(km>=1){
            console.log(cost + "円")
            document.getElementById('pay').innerHTML += 
          "支払い料金は" + cost + "円です。";

        }

        });
        // ここまで

    });

    });


};

$(".save").on("click", function () {

  if (document.getElementById('toutyaku').value == "" )  {
    return;
  }

  newPostRef.push({
    text:$('#toutyaku').val(),
       
  })

  $("#toutyaku").val("");

});

newPostRef.on("child_added", function (data) {
  let v = data.val();
  console.log(v);

  let rireki = `<p class=para><div class=history><input type="radio" name="posit">${v.text}</div></p>`;
  


  // prependだと上に追加されるが、appendだと新規メッセージが下に追加される
  $(".output").append(rireki);

  $(".yobidasi").on("click", function () {
  var id = $("input[name='posit']:checked").parent().text();
  console.log(id)
  $("#toutyaku").val(id);
  });

});