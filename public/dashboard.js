const googleSatUrl = "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}";
const raodMapUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z} ";
const hybridMapUrl = "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}";
// const cartoPositronUrl = "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";
const cartoPositronUrl = "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png";
const osmBaseUrl = "https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png";

const satelliteMap = L.tileLayer(googleSatUrl);
const roadMap = L.tileLayer(raodMapUrl);
const hybridMap = L.tileLayer(hybridMapUrl);
const cartoMap = L.tileLayer(cartoPositronUrl);
const osmBaseMap = L.tileLayer(osmBaseUrl);

const dechencholing = 'https://raw.githubusercontent.com/nimaytenzin/realTimeWaterMonitoring/master/dechengeojson.geojson';


// Thromde and Zone selector using windows.location.href property --> use it to center and load the relevant geojson files
var url_string =window.location.href;
console.log(url_string);
var url = new URL(url_string);
var c = url.searchParams.get("thromde");
const thromde = url.searchParams.get("thromde");
const lap = url.searchParams.get("lap");
console.log(thromde,lap);

const mymap = L.map('map', {
    center: [27.529978, 89.638986],
    zoom: 16,
    layers: [cartoMap]
})

//Chart js
// let labels = [];
// let values = [];

var baseMaps = {
  
  "Satellite": satelliteMap,
  "Carto Map" : cartoMap,
  "OSM Base Map": osmBaseMap,
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

  var searchPlot = {
    'fillColor': 'red',
    'color': 'maroon',
		'weight': 3,
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
      let link = document.getElementById('link');

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
        link.setAttribute('href', "/users/registerplot/"+feature.properties.plot_id);
       
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


   

    let labels = new Set();
    // labels.add(plotdata.feature.precinct);
    console.log(labels);
    console.log(plotdata)
  
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

var controlSearch = new L.Control.Search({
  position:'topright',		
  layer: this.plotdata,
  propertyName: 'plot_id',
  initial: true,
  zoom: 18,
  marker: false
}).on("search:locationfound", (e) =>{
  e.layer.setStyle(searchPlot);
  });

  
  mymap.addControl( controlSearch );




// var ctx = document.getElementById('myChart');
// var chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'line',

//     // The data for our dataset
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45]
//         }]
//     },

//     // Configuration options go here
//     options: {}
// });
