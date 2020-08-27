const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather')

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather')
})

// API CONNECTION

const API_KEY = 'hIgxMtSwDRmYc1LdRaiF7SghuGWUzAuSHLtGeeUA'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

// Selectors for current sols
const currentSolElement = document.querySelector('[data-current-sol]')
const currentDateElement = document.querySelector('[data-current-date]')
const currentTempHighElement = document.querySelector('[data-current-temp-high]')
const currentTempLowElement = document.querySelector('[data-current-temp-low]')
const windSpeedElement = document.querySelector('[data-wind-speed]')
const windDirectionText = document.querySelector('[data-wind-direction-text]')
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]')

// Selectors for pre sols
const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')

// Toggle from C - F
const unitToggle = document.querySelector('[data-unit-toggle]')
const metricRadio = document.getElementById('cel')
const fahRadio = document.getElementById('fah')

let selectedSolIndex

// Gets the latest day's index (SOL)
getWeather().then(sols => {
    selectedSolIndex = sols.length - 1
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnits()

    unitToggle.addEventListener('click', () => {
        let metricUnits = !isMetric()
        metricRadio.checked = metricUnits
        fahRadio.checked = !metricUnits
        displaySelectedSol(sols)
        displayPreviousSols(sols)
        updateUnits()
    })

    metricRadio.addEventListener('change', () => {
        displaySelectedSol(sols)
        displayPreviousSols(sols)
        updateUnits()

    })

    fahRadio.addEventListener('change', () => {
        displaySelectedSol(sols)
        displayPreviousSols(sols)
        updateUnits()
    })
})

// Curent weather: add live data into HTML
function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex]
    currentSolElement.innerHTML = selectedSol.sol
    currentDateElement.innerHTML = displayDate(selectedSol.date)
    currentTempHighElement.innerHTML = displayTemp(selectedSol.maxTemp)
    currentTempLowElement.innerHTML = displayTemp(selectedSol.minTemp)
    windSpeedElement.innerHTML = displaySpeed(selectedSol.windSpeed)
    windDirectionText.innerHTML = selectedSol.windDirectionCardinal
    windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`)
}

// Previous weather: add live data into HTML
function displayPreviousSols(sols) {
    previousSolContainer.innerHTML = ''
    sols.forEach((solData, index) => {
        const solContainer = previousSolTemplate.content.cloneNode(true)
        solContainer.querySelector('[data-sol]').innerText = solData.sol
        solContainer.querySelector('[data-date').innerText = displayDate(solData.date) 
        solContainer.querySelector('[data-temp-high]').innerText = displayTemp(solData.maxTemp)
        solContainer.querySelector('[data-temp-low]').innerText = displayTemp(solData.minTemp)
        solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
            selectedSolIndex = index
            displaySelectedSol(sols)
        })
        previousSolContainer.appendChild(solContainer)
    })
    }
   


// Format date function
function displayDate(date) {
    return date.toLocaleDateString (
        undefined,
        { day: 'numeric', month: 'long' }
    )
}

// Format temperature
function displayTemp(temp) {
    let returnTemp = temp
    if (!isMetric()) {
        returnTemp = temp * 1.8 + 32
    }
    return Math.round(returnTemp)
}

// Format wind speed
function displaySpeed(speed) {
    let returnSpeed = speed
    if(!isMetric()) {
        returnSpeed  = speed / 1.609
    }
    return Math.round(speed)
}

// Get data from api
function getWeather() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(data => {
        const {
            sol_keys,
            validity_checks,
            ...solData
            } = data
        
        return Object.entries(solData).map(([sol,data]) => {
            return {
                sol: sol,
                maxTemp: data.AT.mx,
                minTemp: data.AT.mn,
                windSpeed: data.HWS.av,
                windDirectionDegrees: data.WD.most_common.compass_degrees,
                windDirectionCardinal: data.WD.most_common.compass_point,
                date: new Date(data.First_UTC)
            }
        })
        console.log(temp)
    })
}

// Conversion temp
function updateUnits() {
    const speedUnits = document.querySelectorAll('[data-speed-unit]')
    const tempUnits = document.querySelectorAll('[data-temp-unit]')

    speedUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'kph' : 'mph'
    })

    tempUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    })
}

function isMetric() {
    return metricRadio.checked
}