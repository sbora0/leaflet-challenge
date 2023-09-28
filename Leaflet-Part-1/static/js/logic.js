let myMap = L.map("map", {
    center: [4.100263, 93.075564],
    zoom: 3,
});

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors <a href="https://data.gov.au/dataset/ds-dga-bdf92691-c6fe-42b9-a0e2-a4cd716fa811/details">VIC Local Government Areas - Geoscape Administrative Boundaries</a>'
}).addTo(myMap);

// Load the GeoJSON data for the LGA mapping area.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let depth = [-10, 10, 30, 50, 70, 90];
let colors = ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'];

function chooseColor(depth){
    if(depth >= -10 && depth <= 10){
        return colors[0];
    }else if(depth >= 10 && depth <= 30){
        return colors[1];
    }else if(depth >= 30 && depth <= 50){
        return colors[2];
    }else if(depth >= 50 && depth <= 70){
        return colors[3];
    }else if(depth >= 70 && depth <= 90){
        return colors[4];
    }else{
        return colors[5];
    }
};

// Get the data with d3.
d3.json(link).then(function(data) {
    // Add GeoJSON data to the map
    L.geoJson(data, {
        style: function (feature) {
            let radius = (feature.properties.mag) * 4;
            return {
                radius: radius,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 0.5,
                fillOpacity: 1
            };
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    }).addTo(myMap);

    // Add a legend control
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<h4>Depth</h4>';
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap)
});