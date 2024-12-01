// script.js
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

async function fetchData() {
    const response = await fetch('/api/filtered_data'); // Adjust endpoint as necessary
    const data = await response.json();
    visualizeData(data);
}

function applyFilters() {
    const filters = {
        end_year: document.getElementById('end_year').value,
        start_year: document.getElementById('start_year').value,
        topic: document.getElementById('topic').value,
        sector: document.getElementById('sector').value,
        region: document.getElementById('region').value,
        pest: document.getElementById('pest').value,
        source: document.getElementById('source').value,
        swot: document.getElementById('swot').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value
    };

    // Convert filters to query parameters
    const queryParams = new URLSearchParams(filters).toString();

    // Fetch filtered data
    fetch(`/api/filtered_data?${queryParams}`)
        .then(response => response.json())
        .then(data => visualizeData(data));
}

function visualizeData(data) {
    const svg = d3.select('#visualization').append('svg')
        .attr('width', 800)
        .attr('height', 600);

    // Example visualization (e.g., scatter plot)
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(d3.extent(data, d => d.start_year)).nice();
    y.domain(d3.extent(data, d => d.intensity)).nice();

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append('g')
        .call(d3.axisLeft(y));

    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.start_year))
        .attr('cy', d => y(d.intensity))
        .attr('r', 3.5);
}
