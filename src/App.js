import { useState, useEffect } from 'react'
import axios from "axios"
const App = () => {
  const [country, setCountry] = useState("")
  const [countryShow, setCountryShow] = useState([])
  const [forecast, setForecast] = useState([])
  const [ccn, setCcn] = useState()



  const handleSetCountry = (e) => {
    if (e.target.value !== undefined) {
      setCountry(e.target.value)
    }
  }




  const handleRandomNumber = () => {
    const newRandomNumber = Math.floor(Math.random() * 249) + 1;
    // setRandomNumber(newRandomNumber);
    axios
      .get("https://restcountries.com/v3.1/all?fields=ccn3")
      .then(response => {
        setCcn(response.data[newRandomNumber]["ccn3"])

        // axios
        //   .get(`https://restcountries.com/v3.1/alpha/${ccn}`)
        //   .then(response => {
        //     console.log(response)
        //   })
      });

    // setRandomNumber(Math.floor(Math.random() * 249) + 1)

  }



  // useEffect(() => {
  //   axios
  //     .get("https://restcountries.com/v3.1/all?fields=ccn3")
  //     .then(response => {
  //       const list = response.data

  //       setCountryShow()
  //     }
  //     )
  // }, [ccn3])




  // https://restcountries.com/v3.1/alpha


  useEffect(() => {

    if (country) {
      axios
        .get(`https://restcountries.com/v3.1/name/${country}`)

        .then(response => {

          if (response.data.length > 10) {
            setCountryShow("Too many matches, specify another filter")

          }

          else if (response.data.length <= 10 && response.data.length > 1) {
            console.log(response.data)
            setCountryShow(response.data.map(countr => <li className='li' key={countr.cca3}>{countr.name.common} <button className='showbutton' onClick={() => setCountry(countr.name.common)}>Show</button> </li>))

          }

          else if (response.data.length === 1) {


            const countryData = response.data[0];
            setCountryShow(countryData);
            let elems
            console.log(countryData.languages)
            if (countryData.languages !== undefined) {
              elems = Object.entries(countryData.languages).map(([key, value]) => (<li key={key}>{value}</li>))
            } else {
              elems = "No languages"
            }

            let nativeName
            if (countryData.name.nativeName !== undefined) {
              nativeName = Object.values(countryData.name.nativeName)[0].official
              console.log(nativeName)
            } else {
              nativeName = "No native name"
            }

            let latlng
            console.log(countryData.capitalInfo)
            if (countryData.capitalInfo.latlng) {
              latlng = [countryData.capitalInfo.latlng[0], countryData.capitalInfo.latlng[1]]
            } else {
              latlng = [null, null]
            }


            // let curObj
            let cur
            if (countryData.currencies) {
              cur = Object.values(countryData.currencies)[0].name
              // cur = curObj[0].name
            } else {
              cur = "No currency"
              // cur = curObj
            }

            let capital
            if (countryData.capital) {
              capital = countryData.capital
            } else {
              capital = "No capital"
            }

            let weather
            if (countryData.capital) {
              weather = `Weather in ${capital}`
            } else {
              weather = "No capital for forecast"
            }

            const flagObj = Object.values(countryData.flags)

            setCountryShow(
              <div className='country'>
                <h2 className='name'>{countryData.name.common}</h2>
                <div className='capital'>Capital: {capital}</div>
                <div className='nativename'>Native name: {nativeName}</div>
                <div className='currency'>Currency: {cur}</div>
                <br></br>
                <div className='languages'>Languages:
                  <ul className='language'>{elems}</ul>
                </div>
                <div className='flag'>Flag:
                  <br></br>
                  <img className='flag-img' src={flagObj[0]} alt={`Flag of ${countryData.name.common}`} />
                </div>
                <div style={{ display: "none" }}>{latlng}</div>
                <div>
                  <h2 className='weather'>{weather}</h2>
                </div>
              </div>
            )
          }
        }
        )
        .catch(error => {
          setCountryShow("That country does not exist or you are using foreing language")
        })
    }
  }, [country]
  )


  useEffect(() => {
    if (ccn !== undefined) {
      axios
        .get(`https://restcountries.com/v3.1/alpha/${ccn}`)
        .then(response => {

          const countryData = response.data[0];
          setCountryShow(countryData);
          let elems
          console.log(countryData.languages)
          if (countryData.languages !== undefined) {
            elems = Object.entries(countryData.languages).map(([key, value]) => (<li key={key}>{value}</li>))
          } else {
            elems = "No languages"
          }


          let latlng
          console.log(countryData.capitalInfo)
          if (countryData.capitalInfo.latlng) {
            latlng = [countryData.capitalInfo.latlng[0], countryData.capitalInfo.latlng[1]]
          } else {
            latlng = [null, null]
          }

          let nativeName
          if (countryData.name.nativeName !== undefined) {
            nativeName = Object.values(countryData.name.nativeName)[0].official
            console.log(nativeName)
          } else {
            nativeName = "No native name"
          }


          let curObj
          let cur
          if (countryData.currencies) {
            curObj = Object.values(countryData.currencies)
            cur = curObj[0].name
          } else {
            curObj = "No currency"
            cur = curObj
          }

          let capital
          if (countryData.capital) {
            capital = countryData.capital
          } else {
            capital = "No capital"
          }

          let weather
          if (countryData.capital) {
            weather = `Weather in ${capital}`
          } else {
            weather = "There is no capital"
          }
          const flagObj = Object.values(countryData.flags)



          setCountryShow(
            <div className='country'>
              <h2 className='name'>{countryData.name.common}</h2>
              <div className='capital'>Capital: {capital}</div>
              <div className='nativename'>Native name: {nativeName}</div>
              <div className='currency'>Currency: {cur}</div>
              <br></br>
              <div className='languages'>Languages:
                <ul className='language'>{elems}</ul>
              </div>
              <div className='flag'>Flag:
                <br></br>
                <img className='flag-img' src={flagObj[0]} alt={`Flag of ${countryData.name.common}`} />
              </div>
              <div style={{ display: "none" }}>{latlng}</div>
              <div>
                <h2 className='weather'>{weather}</h2>
              </div>
            </div>
          )


        });
    }
  }, [ccn]);


  useEffect(() => {
    if (countryShow.length >= 0) {
      setForecast(<></>)
    } else if (countryShow.length === undefined) {
      const latlng = countryShow.props.children[7].props.children
      console.log(countryShow.props.children)
      if (latlng[0] !== null) {
        axios
          .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latlng[0]}&lon=${latlng[1]}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
          .then(response => {
            const weather = Math.floor(response.data.list[0].main.temp);
            setForecast(<div className='forecast'>
              <div className='tempearture'> {weather}°C</div>
              <div className='forecast-img'><img src={`https://openweathermap.org/img/wn/${response.data.list[0].weather[0].icon}@2x.png`} alt='weather icon' /></div>
            </div>);
          });
      }
    }
  }, [countryShow]);


  return (
    <main className='container'>
      <header className='header'><h1 className='title'>Find countries &#127757;</h1></header>
      <div className='wrapper'>
        <div className='searchtitle'>Country name: <input autoFocus className='search' onChange={handleSetCountry}></input> </div>
        <button className='randombutton' onClick={handleRandomNumber}>Random &#127922;</button>
        <ul className='list'>{countryShow}</ul>
      </div>
      <footer><div>{forecast}</div></footer>
    </main>
  )
}

export default App

