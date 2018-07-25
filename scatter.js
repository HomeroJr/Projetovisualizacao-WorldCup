        	var margin = { top: 20, right: 20, bottom: 25, left: 100 };
			var altura = 600 - margin.top - margin.bottom;
			var largura = 1000 - margin.right - margin.left;


var scatter = d3.select("#scatter");
     

var svg = scatter.append("svg")
  .attr("width", largura + margin.right + margin.left)
  .attr("height", altura + margin.top + margin.bottom);
  
  	
        xScale = d3.scaleLinear().domain([1930,2014]).range([0, largura]);
             
        
        yScale = d3.scaleOrdinal().domain(["Fase de grupos", "Oitavas de Final", "Quartas de Final", "Semi-Finais", "Final"]).range([altura, altura * 1/4, altura * 1/2, altura * 3/4, 0]);
				
		var ticks = [];
		for(let i = 1930; i <= 2014; i += 4){
			ticks.push(i);
		}
		
        xAxis = d3.axisBottom(this.xScale)
        		  .tickValues(ticks);
        yAxis = d3.axisLeft(this.yScale);

        xAxisG = svg.append("g")
            .attrs({
                class: "xAxis",
                transform: "translate(" + margin.left + ", " + (altura + 10) + ")"
            });
        yAxisG = svg.append("g")
            .attrs({
                class: "yAxis",
                transform: "translate(" + margin.left + ",10)"
            });

	
            

		this.xAxisG.call(this.xAxis);
        this.yAxisG.call(this.yAxis);

