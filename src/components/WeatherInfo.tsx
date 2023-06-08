import React from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface WeatherData {
  name: string;
  icon: string;
  value: string;
}

interface WeatherInfoProps {
  weather: {
    weather: {
      icon: string;
      main: string;
      description: string;
    }[];
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      sea_level: number;
    };
    wind: {
      speed: number;
    };
    visibility: number;
  } | null;
}

export default function WeatherInfo({ weather }: WeatherInfoProps) {

  //initialize weather Array
  const weatherData: WeatherData[] = []

  //if weather data is available, push data to weatherData array
  weather && weatherData.push({
    name: 'Weather',
    icon: `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
    value: `${weather.weather[0].main} - ${weather.weather[0].description}`
  },
  {
    name: 'Temperature',
    icon: '/temperature.svg',
    value: `${weather.main.temp} °C`
  },
  {
    name: 'Feels like',
    icon: '/feels.svg',
    value: `${weather.main.feels_like} °C`
  },
  {
    name: 'Humidity',
    icon: '/humidity.svg',
    value: `${weather.main.humidity} %`
  },
  {
    name: 'Sea level',
    icon: '/sealevel.svg',
    value: `${weather.main.sea_level} millibars`
  },
  {
    name: 'Wind Speed',
    icon: '/windspeed.svg',
    value: `${weather.wind.speed} m/s`
  },
  {
    name: 'Visibility',
    icon: '/visibility.svg',
    value: `${weather.visibility}`
  })

  return (
    
      <div className='flex flex-col items-start justify-start mt-12 gap-2 mb-10'>
        <AnimatePresence>
          {
            weatherData?.map((data, index) => {
              if (data.value) {
              return (<motion.div 
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5, delay: 0.1 * index, type: 'spring' }}
                exit={{ opacity: 0, y: 10, transition: { delay: .05 * index, type: 'spring', duration: .2 } }}
                key={index} 
                className='flex items-center mobile:gap-2 mobile:px-2 mobile:py-1 gap-4 py-2 px-4 bg-green-400 bg-opacity-70 rounded justify-center hover:bg-cyan-500 transition-all duration-500'>
                <div className='flex items-center gap-4 mobile:gap-2'>
                  <label className='p-3 bg-slate-900 rounded mobile:text-sm mobile:p-2'>{data.name.toUpperCase()}</label>
                  <span className='text-xl mobile:text-base'>{data.value}</span>
                </div>
                <Image src={data.icon} width={60} height={60} alt='weather icon'/>
              </motion.div>)
              }
            })
          }
        </AnimatePresence>
      </div>
  )
}