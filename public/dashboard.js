const googleSatUrl = "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}";
const raodMapUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z} ";
const hybridMapUrl = "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}";
// const cartoPositronUrl = "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";
const cartoPositronUrl = "http://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png";

const satelliteMap = L.tileLayer(googleSatUrl);
const roadMap = L.tileLayer(raodMapUrl);
const hybridMap = L.tileLayer(hybridMapUrl);
const cartoMap = L.tileLayer(cartoPositronUrl);

const dechencholing = 'https://raw.githubusercontent.com/nimaytenzin/realTimeWaterMonitoring/master/dechengeojson.geojson';


const mymap = L.map('map', {
    center: [27.529978, 89.638986],
    zoom: 16,
    layers: [cartoMap]
})


var baseMaps = {
  
  "Satellite": satelliteMap,
  "Carto Map" : cartoMap
  
};



function precinctStyle(feature) {
    return {
    fillColor: getColor(feature.properties.precinct),
    weight: 1,
    opacity: 1,
    color: "gray",
    // fill: 'white',
    fillOpacity: 1
   };
}	

function normal(feature) {
  return {
  fillColor: "white" ,
  weight: 1,
  opacity: 1,
  color: "black",
  // fill: 'white',
  fillOpacity: .5
 };
}	

  var highlight = {
    // 'fillColor': 'yellow',
    'color': 'red',
		'weight': 2,
		'opacity': 1
  };


  //precinct colors pallete - include hash color code in the geojson attributes 
  function getColor(d) {
    switch(d){
      case "UV2-MD":
        return '#800026';
        break;
      case "UV1":
        return '#ffffb3';
        break;
      case "SP":
        return '#bebada';
        break;
      case "RH":
        return '#fb8072';
        break;
      case "NN":
        return '#F3B391';
        break;
      case "I":
        return '#fdb462';
        break;
      case "G2":
        return '#b3de69';
        break;
      case "EN":
        return '#fccde5';
        break;
      case "E2":
        return '#415B34';
        break;
      case "E1":
        return "#A4CC8F";
        break;
    }
}
 
  var plotdata = L.geoJSON(null,{
    onEachFeature: function (feature, layer) {
      

      let plotid= document.getElementById('plotid');
      let precinct= document.getElementById('precinct');
      let coverage= document.getElementById('coverage');
      let setback= document.getElementById('setback');
      let height = document.getElementById('height');
      let area = document.getElementById('area');

      //binding feature attirbutes as popup
      // layer.bindPopup(`Plot_id: ${feature.properties.plot_id} <br> precinct: ${feature.properties.precinct} <br> coverage: ${feature.properties.coverage} <br> setback: ${feature.properties.setback} <br> height: ${feature.properties.height} <br><br>  `);
      layer.on('click',function(e){
        sidebar.show();

        //side bar details
        plotid.innerText = feature.properties.plot_id;
        precinct.innerText = feature.properties.precinct;
        area.innerText = parseFloat(feature.properties.Area_Acres.toFixed(3)) + " Acres";

        if(feature.properties.coverage == null){
          coverage.innerText = "---";
        }else{
          coverage.innerText = feature.properties.coverage + " %";
        }

        if(feature.properties.setback == null){
          setback.innerText = "---";
        }else{
          setback.innerText = feature.properties.setback;
        }

        if(feature.properties.height == null){
          height.innerText = "---";
        }else{
          height.innerText = feature.properties.height + " floors";
        }
       
        plotdata.setStyle(normal);
        layer.setStyle(highlight);
      });},
      style: normal
  });


  

  var precinctMap = L.geoJSON(null,{
    onEachFeature: function (feature, layer) {
     
      let plotid= document.getElementById('plotid');
      let precinct= document.getElementById('precinct');
      let coverage= document.getElementById('coverage');
      let setback= document.getElementById('setback');
      let height = document.getElementById('height');
      let area = document.getElementById('area');

      

    
      layer.on('click',function(e){
        sidebar.show();

        //side bar details
        plotid.innerText = feature.properties.plot_id;
        precinct.innerText = feature.properties.precinct;
        area.innerText = parseFloat(feature.properties.Area_Acres.toFixed(3)) + " Acres";

        if(feature.properties.coverage == null){
          coverage.innerText = "---";
        }else{
          coverage.innerText = feature.properties.coverage + " %";
        }

        if(feature.properties.setback == null){
          setback.innerText = "---";
        }else{
          setback.innerText = feature.properties.setback;
        }

        if(feature.properties.height == null){
          height.innerText = "---";
        }else{
          height.innerText = feature.properties.height + " floors";
        }
       
        precinctMap.setStyle(precinctStyle);
        layer.setStyle(highlight);
      });},
      style: precinctStyle
  })

   fetch(
      dechencholing
    ).then(
      res => res.json()
    ).then(
      (data)=>{
        plotdata.addData(data); 
        precinctMap.addData(data);    
         
    });

    

    //legend
   var legend = L.control({
      position: 'bottomleft'
  });
  legend.onAdd = function (mymap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          labels = ['<strong>Legend</strong>'],
          lower = ["UV2-MD","UV1","SP","RH","NN","I","G2","EN","E2","E1"];
  
      for (var i = 0; i < lower.length; i++) {
          div.innerHTML += labels.push(
              '<i style="background:' + getColor(lower[i]) + '"></i> ' + lower[i]);
      }
      div.innerHTML = labels.join('<br>');
      return div;
  }; 
  

  // Legend on and off for different layers -- map on overlay add is fired when certain layer is selected via the control and then add the legend to the map when name matches the name
  mymap.on('overlayadd',(e)=>{
    if(e.name === "Precinct Map"){
      this.legend.addTo(mymap);
      sidebar.show();
    }
  });
  mymap.on('overlayremove',(e)=>{
    if(e.name === "Precinct Map"){
      mymap.removeControl(this.legend);
    }
  });


  this.plotdata.addTo(mymap);
  // this.precinctMap.addTo(mymap);  ----> Donot add the layers you want to turn off to the map.let the control add it map when selected

  var overlayMaps = {
  "Precinct Map": precinctMap
};

L.control.layers(baseMaps, overlayMaps).addTo(mymap);
  

  // L.control.layers(baseMaps).addTo(mymap);

  // function getCurrentLocation(){
  //   var options = {
  //     enableHighAccuracy: true,
  //     timeout: 5000,
  //     maximumAge: 0
  //   };
    
  //   function success(pos) {
  //     var crd = pos.coords;
  //     var lat = crd.latitude;
  //     var lng = crd.longitude;

  //     var userPosition =  [lat,lng]
  //     alert(userPosition)

  //   }
    
  //   function error(err) {
  //     console.warn(`ERROR(${err.code}): ${err.message}`);
  //   }
    
  //   navigator.geolocation.getCurrentPosition(success, error, options);
  // }


var sidebar = L.control.sidebar('sidebar', {
  closeButton: true,
  position: 'left'
});
mymap.addControl(sidebar);

// setTimeout(function () {
//   sidebar.show();
// }, 500);


function closeSidebar(){
  sidebar.hide();
}