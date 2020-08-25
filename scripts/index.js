const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather')

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather')
})

// API CONNECTION

const API_KEY = 'hIgxMtSwDRmYc1LdRaiF7SghuGWUzAuSHLtGeeUA'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

// Grab SOL Day
const currentSolElement = document.querySelector('[data-current-sol')

let selectedSolIndex

// Gets the latest day's index (SOL)
getWeather().then(sols => {
    selectedSolIndex = sols.length - 1
    displaySelectedSol(sols)
})

function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex]
    currentSolElement.innerHTML = selectedSol.sol
}

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