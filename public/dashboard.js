const googleSatUrl = "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}";
const dechencholing = 'https://raw.githubusercontent.com/nimaytenzin/realTimeWaterMonitoring/master/dechengeojson.geojson';

const mymap = L.map('map').setView([27.529978, 89.638986], 16);
const satelliteTileLayer = L.tileLayer(googleSatUrl);
satelliteTileLayer.addTo(mymap);


function style(feature) {
    return {
    weight: 1,
    opacity: 1,
    color: "black",
    fill: 'white',
    fillOpacity: 0.1
   };
  }

   fetch(
        dechencholing
      ).then(
        res => res.json()
      ).then(
        data => L.geoJSON(data,{
          onEachFeature: function (feature, layer) {
            // layer.on('click', function (e) {
            //   console.log(feature.properties.plot_id);
            //   console.log(this.router)
            //   this.router.navigate([])
            // })
            layer.bindPopup(`Plot_id: ${feature.properties.plot_id} <br> precinct: ${feature.properties.precinct} <br> coverage: ${feature.properties.coverage} <br> setback: ${feature.properties.setback} <br> height: ${feature.properties.height} <br><br> <a href= "/users/registerplot/${feature.properties.plot_id}"><button class="btn btn-dark"> Update plot Details </button></a> `);
            
        }}).setStyle(this.style).addTo(mymap)
      )


  function getCurrentLocation(){
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    function success(pos) {
      var crd = pos.coords;
      var lat = crd.latitude;
      var lng = crd.longitude;

      var userPosition =  [lat,lng]
      alert(userPosition)

    }
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  console.log(dechencholing)