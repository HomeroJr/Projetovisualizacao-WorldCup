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

updateMap(1930);

function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(250,250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(goalsScored, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

var category = "titles";
var categories = ["titles", "goalsScored", "top4"];

var titles = [
	{text:"Brazil", size: 100},
	{text:"Germany", size: 80},
	{text:"Italy", size: 80},
	{text:"Argentina", size: 40},
	{text:"France", size: 40},
	{text:"England", size: 20},
	{text:"Spain", size: 20},
	{text:"Uruguay", size: 40}
]

var goalsScored = [
	{text: "France", 
size: 54}, 
{text: "Mexico", 
size: 29}, 
{text: "United States of America", 
size: 19}, 
{text: "Belgium", 
size: 27}, 
{text: "Yugoslavia", 
size: 30}, 
{text: "Brazil", 
size: 112.5}, 
{text: "Romania", 
size: 15}, 
{text: "Peru", 
size: 9.5}, 
{text: "Argentina", 
size: 66.5}, 
{text: "Chile", 
size: 20.5}, 
{text: "Bolivia", 
size: 0.5}, 
{text: "Paraguay", 
size: 15}, 
{text: "Uruguay", 
size: 40}, 
{text: "Austria", 
size: 21.5}, 
{text: "Hungary", 
size: 43.5}, 
{text: "Egypt", 
size: 1.5}, 
{text: "Switzerland", 
size: 22.5}, 
{text: "Netherlands", 
size: 45.5}, 
{text: "Sweden", 
size: 37}, 
{text: "Germany", 
size: 117.5}, 
{text: "Spain", 
size: 46}, 
{text: "Italy", 
size: 64}, 
{text: "Czechoslovakia", 
size: 22}, 
{text: "Dutch East Indies", 
size: 0}, 
{text: "Cuba", 
size: 2.5}, 
{text: "Norway", 
size: 3.5}, 
{text: "Poland", 
size: 22}, 
{text: "England", 
size: 39.5}, 
{text: "Scotland", 
size: 12.5}, 
{text: "Turkey", 
size: 10}, 
{text: "Korea Republic", 
size: 15.5}, 
{text: "Soviet Union", 
size: 26.5}, 
{text: "Wales", 
size: 2}, 
{text: "Northern Ireland", 
size: 6.5}, 
{text: "Colombia", 
size: 14.5}, 
{text: "Bulgaria", 
size: 11}, 
{text: "Korea DPR", 
size: 3}, 
{text: "Portugal", 
size: 21.5}, 
{text: "Israel", 
size: 0.5}, 
{text: "Morocco", 
size: 6}, 
{text: "El Salvador", 
size: 0.5}, 
{text: "German DR", 
size: 2.5}, 
{text: "Australia", 
size: 5.5}, 
{text: "Zaire", 
size: 0}, 
{text: "Haiti", 
size: 1}, 
{text: "Tunisia", 
size: 4}, 
{text: "Iran", 
size: 3.5}, 
{text: "Cameroon", 
size: 9}, 
{text: "New Zealand", 
size: 2}, 
{text: "Algeria", 
size: 7}, 
{text: "Honduras", 
size: 1.5}, 
{text: "Kuwait", 
size: 1}, 
{text: "Canada", 
size: 0}, 
{text: "Iraq", 
size: 0.5}, 
{text: "Denmark", 
size: 13.5}, 
{text: "United Arab Emirates", 
size: 1}, 
{text: "Costa Rica", 
size: 9}, 
{text: "Republic of Ireland", 
size: 5}, 
{text: "Saudi Arabia", 
size: 4.5}, 
{text: "Russia", 
size: 6.5}, 
{text: "Greece", 
size: 3}, 
{text: "Nigeria", 
size: 10}, 
{text: "South Africa", 
size: 5.5}, 
{text: "Japan", 
size: 7}, 
{text: "Jamaica", 
size: 1.5}, 
{text: "Croatia", 
size: 10.5}, 
{text: "Senegal", 
size: 3.5}, 
{text: "Slovenia", 
size: 2.5}, 
{text: "Ecuador", 
size: 5}, 
{text: "China", 
size: 0}, 
{text: "Trinidad and Tobago", 
size: 0}, 
{text: "Côte d'Ivoire", 
size: 6.5}, 
{text: "Serbia and Montenegro", 
size: 1}, 
{text: "Angola", 
size: 0.5}, 
{text: "Czech Republic", 
size: 1.5}, 
{text: "Ghana", 
size: 6.5}, 
{text: "Togo", 
size: 0.5}, 
{text: "Ukraine", 
size: 2.5}, 
{text: "Serbia", 
size: 1}, 
{text: "Slovakia", 
size: 2.5}, 
{text: "Bosnia and Herzegovina", 
size: 2}, 

]

var goals = 0;
for(var i in countries_dataset){
	console.log("{text: \"" + countries_dataset[i].name + "\", ");
	for(j in countries_dataset[i].cups){
		goals += countries_dataset[i].cups[j].goals;
	}
	console.log("size: " + goals/2 + "},");
	goals = 0;
	
	
	
}


//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, category) {


    vis.update(goalsScored)
    //setTimeout(function() { showNewWords(vis)}, 2000)
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('#cloud');

//Start cycling through the demo data
showNewWords(myWordCloud, "titles");


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
