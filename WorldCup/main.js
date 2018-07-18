var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

function updateTextInput(value) {
    $('#textInput').html(value);
    
    L.geoJson(countriesGEOJSON, { style: style }).addTo(map);
}

var presence = {};

for (let match of world_cup_matches) {
    if (!presence[match["Year"]]) presence[match["Year"]] = [];
    if (!presence[match["Year"]].includes(match["Home Team Name"])) presence[match["Year"]].push(match["Home Team Name"]);
    if (!presence[match["Year"]].includes(match["Away Team Name"])) presence[match["Year"]].push(match["Away Team Name"]);
}

for (let f of countriesGEOJSON.features) {
    // console.log(f.properties);
    for (let cup of world_cups) {
        if (!f.properties.cups) f.properties.cups = 0;
        if (cup.Winner.toLowerCase().startsWith(f.properties.name.toLowerCase())
            || f.properties.name.toLowerCase() === "united kingdom" && cup.Winner.toLowerCase() === "england")
            f.properties.cups++;
    }
}

for (let f of countriesGEOJSON.features) {
    // console.log(f.properties);
    for (let cup in presence) {
        if (presence.hasOwnProperty(cup)) {
            if (!f.properties.num_cups) f.properties.num_cups = 0;
            if (presence[cup].includes(f.properties.name)) f.properties.num_cups++;
        }
    }
}

var layer = L.geoJson(countriesGEOJSON, { style: style }).addTo(map);

function getColor(d) {
    return d > 4 ? '#800026' :
        d > 3 ? '#BD0026' :
            d > 2 ? '#E31A1C' :
                d > 1 ? '#FC4E2A' :
                    d > 0 ? '#FD8D3C' :
                        '#FFF';
}

function presenceColor(d) {
    return d > 15 ? '#4b0082' : d > 10 ? '#7c48a1' : d > 5 ? '#a883c0' : d > 0 ? '#d4bfe0' : '#fff';
}

function present(name) {
    return presence[$('#textInput').html()].includes(name) ? '#7c48a1' : '#fff';
}

function style(feature) {
    return {
        fillColor: present(feature.properties.name),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}