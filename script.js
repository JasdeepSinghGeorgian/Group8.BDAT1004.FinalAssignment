/*
    Function to call the Python API and then create charts using chart js to show on the Main HTML Page.
*/
function submitForm() {
    console.log('Inside submitForm() method');
    const carBrandSelect = document.getElementById('car-brands');
    if (carBrandSelect.value == "default") {
        alert("Please select a car brand!");
        return;
    }
    const selectedCarBrand = carBrandSelect.value;
    console.log('selected car is: ' + selectedCarBrand);
    const carBrandData = { make: selectedCarBrand };
    let dataFetched; // declare a variable outside of the fetch method
    fetch("http://localhost:5000/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(carBrandData),
    })
        .then((response) => response.json())
        .then((data) => {
            dataFetched = data;
            console.log(dataFetched);
            calculateAverageRechargeTime(dataFetched);
            calculateAverageRange(dataFetched);
        })
        .catch((error) => console.error(error));
    console.log('Exiting submitForm() method');
}

/*
    This method calculates the data required for creating a chart for the Average Recharge Time of each Vehicle Class for a specific Company(Make) of the car.
*/
function calculateAverageRechargeTime(data) {
    console.log('Inside calculateAverageRechargeTime() method');
    const rechargeTimesByClass = {};
    let vehicleClassArray = [];
    let rechargeTimeArray = [];
    for (let i = 0; i < data.length; i++) {
        const vehicleClass = data[i].vehicle_class;
        const rechargeTime = data[i].recharge_time;
        if (rechargeTimesByClass[vehicleClass]) {
            rechargeTimesByClass[vehicleClass].push(rechargeTime);
        } else {
            rechargeTimesByClass[vehicleClass] = [rechargeTime];
        }
    }

    for (const vehicleClass in rechargeTimesByClass) {
        const rechargeTimes = rechargeTimesByClass[vehicleClass];
        const averageRechargeTime = rechargeTimes.reduce((total, time) => total + time) / rechargeTimes.length;
        console.log(`Average recharge time for ${vehicleClass}: ${averageRechargeTime} hours`);
        vehicleClassArray.push(vehicleClass);
        rechargeTimeArray.push(averageRechargeTime);
    }
    displayChart(vehicleClassArray, rechargeTimeArray, "Recharge Time", "rechargeTimeChart", 'rgb(255,20,147)', '#FF1493', 'bar', 'Average Recharge Time for each Vehicle Class');
    console.log('Exiting calculateAverageRechargeTime() method');
}

/*
    This method calculates the data required for creating a chart for the Average Range of each Vehicle Class in KMs for a specific Company(Make) of the car.
*/
function calculateAverageRange(data) {
    console.log('Inside calculateAverageRange() method');
    const arrayClass = {};
    let vehicleClassArray = [];
    let rangeArray = [];
    for (let i = 0; i < data.length; i++) {
        const vehicleClass = data[i].vehicle_class;
        const range = data[i].range;
        if (arrayClass[vehicleClass]) {
            arrayClass[vehicleClass].push(range);
        } else {
            arrayClass[vehicleClass] = [range];
        }
    }

    for (const vehicleClass in arrayClass) {
        const rechargeTimes = arrayClass[vehicleClass];
        const averageRechargeTime = rechargeTimes.reduce((total, time) => total + time) / rechargeTimes.length;
        console.log(`Average recharge time for ${vehicleClass}: ${averageRechargeTime} hours`);
        vehicleClassArray.push(vehicleClass);
        rangeArray.push(averageRechargeTime);
    }
    displayChart(vehicleClassArray, rangeArray, "Range (in KM)", "rangeChart", 'rgb(85, 136, 179)', '#5588b3', 'bar', 'Average Range for each Vehicle Class');
    console.log('Exiting calculateAverageRange() method');
}

/*
    This is the common method for creation of charts.
*/
function displayChart(labelsArray, datasetsData, labelString, chartName, backgroundColourOfChart, borderColourOfChart, chartType, chartTitle) {
    console.log("The chart name is: " + chartName);
    console.log('Inside displayChart() method');
    // Define the data for the chart
    const data = {
        labels: labelsArray,
        datasets: [
            {
                label: labelString,
                data: datasetsData,
                backgroundColor: backgroundColourOfChart,
                borderColor: borderColourOfChart,
                borderWidth: 5
            }
        ]
    };

    // Create the chart
    const canvas = document.getElementById(chartName);
    if (!canvas) {
        console.error(`Canvas element with ID ${chartName} not found.`);
        return;
    }
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: {
            responsive: false,
            maintainAspectRatio: true,
            scales: {
                y: {
                    ticks: {
                        color: '#FFFFFF',
                    },
                    grid: {
                        color: '#FFFFFF',
                        lineWidth:0.7
                    },
                    beginAtZero: true,
                },
                x: {
                    ticks: {
                        color: '#FFFFFF',
                    },
                    grid: {
                        color: '#FFFFFF',
                        display: false,

                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    color:'#FFFFFF',
                    font: {
                        size: 25,
                    },
                },
                legend: {
                    labels: {
                        color:'#FFFFFF'
                    }
                }
            },
        }
    });
    console.log('Exiting displayChart() method');
}
