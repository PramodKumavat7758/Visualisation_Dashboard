function renderBarChart(data) {
    const container = document.querySelector("#chart1");
    const width = container.offsetWidth;
    const height = 400; // Default height

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
    const height = 400; // Default height
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

    svg.selectAll("path").data(pie(chartData)).enter().append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.topic))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    svg.selectAll("text").data(pie(chartData)).enter().append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .text(d => d.data.topic);
}
