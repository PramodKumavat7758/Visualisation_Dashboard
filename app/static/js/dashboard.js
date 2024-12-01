document.getElementById('apply-filters').addEventListener('click', function() {
    const endYear = document.getElementById('end_year').value;
    const topics = document.getElementById('topics').value;
    const sector = document.getElementById('sector').value;

    fetch(`/api/filtered-data/?end_year=${endYear}&topic=${topics}&sector=${sector}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);  // Show an alert with the error message
                return;
            }
            if (data.data.length === 0) {
                alert("No data available for the selected filters.");
                return;
            }
            renderBarChart(data.data);
            renderPieChart(data.data);
        });
});

function renderBarChart(data) {
    const container = document.querySelector("#chart1");
    const width = container.offsetWidth;
    const height = 400;

    const svg = d3.select(container)
        .html("")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const groupedData = d3.rollup(data, v => d3.sum(v, d => d.intensity), d => d.year);
    const chartData = Array.from(groupedData, ([year, intensity]) => ({ year, intensity }));

    const x = d3.scaleBand().domain(chartData.map(d => d.year)).range([50, width - 30]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(chartData, d => d.intensity)]).nice().range([height - 50, 20]);

    svg.append("g").selectAll("rect").data(chartData).enter().append("rect")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.intensity))
        .attr("height", d => y(0) - y(d.intensity))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");

    svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
    svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));
}

function renderPieChart(data) {
    const container = document.querySelector("#chart2");
    const width = container.offsetWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(container)
        .html("")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const groupedData = d3.rollup(data, v => v.length, d => d.topics);
    const chartData = Array.from(groupedData, ([topic, count]) => ({ topic, count }));

    const color = d3.scaleOrdinal().domain(chartData.map(d => d.topic)).range(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const total = d3.sum(chartData, d => d.count);

    svg.selectAll("path")
        .data(pie(chartData))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.topic))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    svg.selectAll("text")
        .data(pie(chartData))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .text(d => {
            const percent = (d.data.count / total * 100).toFixed(2);
            return `${d.data.topic}: ${percent}%`;
        });

    // Add title to the pie chart
    const chartTitle = svg.append("text")
        .attr("x", 0)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Topic Distribution");
}
