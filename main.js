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

    updateStats();
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
    let year = $('#slider').val();
    let cup = getCurrentCup();

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

    for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

legend.addTo(map);

var stats = L.control({ position: 'topright' });

stats.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend');

    let stats = getCupStats();

    div.innerHTML +=
        '<i class="fas fa-futbol"></i> <small>Goals</small> <span id="goals">' + stats.goals + '</span> <br>' +
        '<i class="fas fa-square" style="color: yellow"></i> <small>Yellow cards</small> <span id="yellows">' + stats.yellows + '</span> <br>' +
        '<i class="fas fa-square" style="color: red"></i> <small>Red cards</small> <span id="reds">' + stats.reds + '</span> <br>';

    return div;
};

stats.addTo(map);

function getCupStats() {
    let cup = getCurrentCup();

    let matches = world_cup_matches.filter(m => m.Year == cup.Year);

    let roundIDs = matches.map(m => m.RoundID);

    let goals = cup.GoalsScored,
        yellows = world_cup_players.filter(p => p.Event.includes('Y') && roundIDs.includes(p.RoundID)).length,
        reds = world_cup_players.filter(p => p.Event.includes('R') && roundIDs.includes(p.RoundID)).length;

    return { goals: goals, reds: reds, yellows: yellows };
}

function updateStats() {
    let stats = getCupStats();
    $('#goals').html(stats.goals);
    $('#reds').html(stats.reds);
    $('#yellows').html(stats.yellows);
}

function getCurrentCup() {
    let year = $('#slider').val();
    let cup;
    for (let c of world_cups) {
        if (c.Year == year) {
            cup = c;
            break;
        }
    }
    return cup;
}