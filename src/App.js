import { useState, useEffect } from 'react'
import axios from "axios"
// import getCountry from './services/countries'
const App = () => {
  const [country, setCountry] = useState("")
  const [countryShow, setCountryShow] = useState([])
  const [forecast, setForecast] = useState([])
  // const [test, setTest] = useState()
  const handleSetCountry = (e) => {
    if (e.target.value !== undefined) {
      setCountry(e.target.value)
    }
  }


  useEffect(() => {
    if (country) {
      axios
        .get(`https://restcountries.com/v3.1/name/${country}`)

        .then(response => {
          console.log(response)

          if (response.data.length > 10) {
            setCountryShow("Too many matches, specify another filter")
          }

          else if (response.data.length <= 10 && response.data.length > 1) {
            console.log(response.data)
            setCountryShow(response.data.map(countr => <li key={countr.cca3}>{countr.name.common} <button onClick={() => setCountry(countr.name.common)}>Show</button> </li>))
          }

          else if (response.data.length === 1) {
            axios
              .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${response.data[0].latlng[0]}&lon=${response.data[0].latlng[1]}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
              .then(response => {
                // console.log(response.data.list[0])
                // console.log(response.data.list[0].weather[0].icon)
                const weather = response.data.list[0].main.temp
                setForecast(<div>
                  <div>Temperature: {weather} Celcius</div>
                  <div><img src={`https://openweathermap.org/img/wn/${response.data.list[0].weather[0].icon}@2x.png`} /></div>
                </div>
                )
              })

            //!
            // const elems = []
            // for (const key in response.data[0].languages) {
            //   elems.push(<li key={key}>{response.data[0].languages[key]}</li>)
            // }
            console.log(response.data[0].latlng[0])
            console.log(response.data[0].latlng)
            console.log(response.data[0].latlng[1])
            const elems = Object.entries(response.data[0].languages).map(([key, value]) => (<li key={key}>{value}</li>))
            const curObj = Object.values(response.data[0].currencies)
            const cur = curObj[0].name
            const flagObj = Object.values(response.data[0].flags)
            console.log(flagObj[0])
            setCountryShow(
              <div>
                <h2>{response.data[0].name.common}</h2>
                <div>Capital: {response.data[0].capital}</div>
                <div>Currency: {cur}</div>
                <br></br>
                <div>Languages:
                  <ul>{elems}</ul>
                </div>
                <br></br>
                <div>Flag:
                  <br></br>
                  <img src={flagObj[0]} alt={`Flag of ${response.data[0].name.common}`} />
                </div>
                <div>
                  <h2>Weather in {response.data[0].capital}</h2>
                  <div>{forecast}</div>
                </div>
              </div>
            )
          }
        }
        )
        .catch(error => {
          alert("That country does not exist or you are using foreing language")
        })
    }
  }, [country, forecast]
  )

  return (
    <div>
      <h1>Find countries</h1>
      <div>Country name: <input onChange={handleSetCountry}></input> </div>
      <ul>{countryShow}</ul>
    </div>
  )
}

export default App

