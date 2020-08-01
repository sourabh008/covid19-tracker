import React, {useState,useEffect} from 'react';
import './App.css';
import { FormControl,MenuItem,Select,Card,CardContent } from '@material-ui/core';
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table"
import {sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from "./util";

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([])
  const [mapCenter,setMapcenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom ,setMapzoom]=useState(3);
  const [mapCountries ,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");

  useEffect(()=>{
       fetch('https://disease.sh/v3/covid-19/all')
       .then(response=>response.json())
       .then(data=>{
         setCountryInfo(data);
       })
  },[])
  useEffect(()=>{
    const getCountriesData=async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response=> response.json())
      .then((data)=>{
        
        const countries=data.map((country)=>{
          return(
          {
            name:country.country,
            value:country.countryInfo.iso2
          })
        })
        const sortedData=sortData(data);
        setMapCountries(data);
        console.log(data)

        setCountries(countries)
        setTableData(sortedData);
      })
    }
    getCountriesData();

  },[]);
  const onSelectChange=async (event)=>{
    const data1=event.target.value;
    const url=data1==='worldwide' ? "https://disease.sh/v3/covid-19/all" :`https://disease.sh/v3/covid-19/countries/${data1}`;
    await fetch(url)
    .then((response)=>
      response.json()
    ).then((data)=>{
      setCountry(data1);
      setCountryInfo(data);
      setMapcenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapzoom(4);
    })

  }

  return (
    <div className="App">
      <div className="app_left">
    <div className="app_header">
     <h1 className="h1" variant="primary">COVID-19 TRACKER</h1>
     <FormControl className="app_dropdown">
      <Select  variant="outlined" onChange={onSelectChange} value={country}>
      <MenuItem value="worldwide">worldwide</MenuItem>
        {countries.map(data=>{
          return(
                <MenuItem value={data.value}>{data.name}</MenuItem>
          )
        })}
      </Select>
     </FormControl>
    </div>
    <div className="app_status">
      <InfoBox 
      isRed
      active={casesType==="cases"}
      onClick={(e)=>{setCasesType("cases")}}
      title="Coronavirus cases"  cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}/>
      <InfoBox 
      active={casesType==="recovered"}
      onClick={(e)=>{setCasesType("recovered")}}
      title="Recovered"  cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}/>
      <InfoBox 
      isRed
      active={casesType==="deaths"}
      onClick={(e)=>{setCasesType("deaths")}}
      title="Deaths"  cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}/>
    </div>
    <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
    </div>
    <Card className="app_right">
      <CardContent>
        <h2>live cases by country</h2>
        <Table countries={tableData} />
      <h2>new worldwide {casesType}</h2>
        <LineGraph casesType={casesType}/>
      </CardContent>

    </Card>
    </div>
  );
}

export default App;
