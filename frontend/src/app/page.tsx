"use client";

import {FormEvent, useState} from "react";


type ApiResponse = {
  id: number;
  latitude: number;
  longitude: number;
  places: ApiResponsePlace[];
  radius: number;
  timestamps: string;
}

type ApiResponsePlace = {
  id: number;
  latitude: number;
  longitude: number;
  placeId: string;
  placeName: string;
};

export default function Home() {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  const [places, setPlaces] = useState<ApiResponsePlace[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //if(!validateInputs()){
    //  return;
    //}

    const url = new URL('http://localhost:8070/place/v1');

    const params = { lat: latitude, lon: longitude, radius: radius };
    url.search = new URLSearchParams(params).toString();

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response)  => {
      const result = await response.json() as ApiResponse;
      console.log('RESPONSE : ', result);
      result.places.length > 0 && setPlaces(result.places);

    }).catch(err => {
      console.log('Error : ', err);
    });

  };

  return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-3">
          <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enlem"
              className="p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
          />
          <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Boylam"
              className="p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
          />
          <input
              type="text"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Yarıçap (metre)"
              className="p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
          />
          <button type="submit" className="p-2 bg-black text-white rounded-md hover:bg-gray-700">
            Restaurants
          </button>
        </form>
      </div>
  )
}
