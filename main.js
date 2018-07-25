var map = L.map('map').setView([0, 0], 2);

function updateMap(value) {
    $('#textInput').html(value);
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.light'
    }).addTo(map);

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

// var layer = L.geoJson(countriesGEOJSON, { style: style }).addTo(map);

updateMap(1930);

function getColor(name, cup, year) {

    let fst = cup.Winner == name;
    let snd = cup["Runners-Up"] == name;
    let trd = cup.Third == name;
    let fth = cup.Fourth == name;

    return fst ? '#FFFF00' : snd ? '#808080' : trd ? '#CC6600' : fth ? '#6666ff' : presence[year].includes(name) ? '#00CC00' : '#fff';
}

function style(feature) {
    let cup;
    let year = $('#slider').val();

    for (let c of world_cups) {
        if (c.Year == year) {
            cup = c;
            break;
        }
    }

    return {
        fillColor: getColor(feature.properties.name, cup, year),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        colors = ['#FFFF00', '#808080', '#CC6600', '#6666ff', '#00CC00', '#fff'],
        labels = ["Winner", "Runners-Up", "Third", "Fourth", "Present", "Not in this cup"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

legend.addTo(map);