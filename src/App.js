import { useState, useEffect } from 'react'
import axios from "axios"
const App = () => {
  const [country, setCountry] = useState("")
  const [countryShow, setCountryShow] = useState([])
  const [forecast, setForecast] = useState([])

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
            console.log(countryShow)
          }

          else if (response.data.length <= 10 && response.data.length > 1) {
            console.log(response.data)
            setCountryShow(response.data.map(countr => <li key={countr.cca3}>{countr.name.common} <button onClick={() => setCountry(countr.name.common)}>Show</button> </li>))
            console.log(countryShow)
          }

          else if (response.data.length === 1) {


            const countryData = response.data[0];
            setCountryShow(countryData);

            console.log(countryData)
            console.log(countryData.capitalInfo.latlng)

            const elems = Object.entries(response.data[0].languages).map(([key, value]) => (<li key={key}>{value}</li>))

            const latlng = [countryData.capitalInfo.latlng[0], countryData.capitalInfo.latlng[1]]

            const curObj = Object.values(response.data[0].currencies)

            console.log(Object.values(response.data[0].currencies))

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
                <div style={{ display: "none" }}>{latlng}</div>
                <div>
                  <h2>Weather in {response.data[0].capital}</h2>
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
  }, [country]
  )



  useEffect(() => {
    if (countryShow.length >= 0) {
      setForecast(<></>)
    } else if (countryShow.length === undefined) {
      const latlng = countryShow.props.children[7].props.children
      console.log(countryShow)
      axios
        .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latlng[0]}&lon=${latlng[1]}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
        .then(response => {
          const weather = response.data.list[0].main.temp;
          console.log(weather)
          setForecast(<div>
            <div>Temperature: {weather} Celcius</div>
            <div><img src={`https://openweathermap.org/img/wn/${response.data.list[0].weather[0].icon}@2x.png`} alt='weather icon' /></div>
          </div>);
          console.log(forecast)
        });

    }
  }, [countryShow]);


  console.log(forecast)

  return (
    <div>
      <h1>Find countries</h1>
      <div>Country name: <input onChange={handleSetCountry}></input> </div>
      <ul>{countryShow}</ul>
      <div>{forecast}</div>
    </div>
  )
}

export default App

