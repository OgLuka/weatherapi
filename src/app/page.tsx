"use client"

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WeatherInfo from '../components/WeatherInfo';
import axios from 'axios';
import { type } from 'os';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    sea_level: number;
  };
  weather: {
    icon: string;
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
}

export default function Home() {

  //states
  const [ city, setCity ] = useState<string>('')
  const [ weatherInfo, setWeatherInfo ] = useState<WeatherData | null>(null)
  const [ error, setError ] = useState<string>('')

  useEffect(() => {
    //get current location on initial render
    getLocation()
  }, []);

  //get current location
  function getLocation() {
    //check if geolocation is available
    if (navigator.geolocation) {
      //get current position when available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //get current city from coordinates using openweathermap api
          getCurrentCity(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.log(error.message)
        }
      )
    } else {
      console.log('couldnt get location')
    }
  }

  //get weather data by city from openweathermap api
  const getWeather = async (city: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )

      const data = response.data
      //upadte weather data
      setError('')
      setWeatherInfo(data)

    } catch (error: any) {
      setWeatherInfo(null)
      setError(error.response.data.message)
      console.log('Error getting weather data:', error.response.data.message)
    }
  };

  //get current city from coordinates using openweathermap api
  const getCurrentCity = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      )

      const data = await response.data;
      //update city
      setCity(data[0].name)
      //get weather data for current city
      getWeather(data[0].name)

    } catch (error) {
      console.log('Error while getting current city:', error)
    }
  };

  //handle form submit
  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //check if input value is empty
    if ( city.trim() === '' ) {
      setError('Please enter a city')
      setWeatherInfo(null)
      return
    }

    //get weather data for city
    getWeather(city);
  };

  return (
   <div className='flex flex-col items-center justify-start pt-32 w-screen min-h-screen'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center gap-4 mobile:flex-col'>
            <motion.input
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.1, type: 'spring' }}
             className='pl-4 h-12 w-80 text-black' type="text" placeholder="Enter city" onChange={e => setCity(e.target.value)} value={city}></motion.input>

            <motion.button
              type='submit'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, type: 'spring' }}
              className='bg-green-400 h-12 px-6 hover:bg-green-800 transition-all duration-500 mobile:w-80' >
                  Get Weather
            </motion.button>
        </div>
      </form>

      {
        error != '' && <p className='text-red-500 mt-4'>{error}</p>
      }

      <WeatherInfo weather={weatherInfo}/>
   </div>
  )
}
