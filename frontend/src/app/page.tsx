"use client";

import {FormEvent, useEffect, useState} from "react";
import {GoogleMap, InfoWindow, Marker, useLoadScript} from "@react-google-maps/api";


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

type CenterType = {
  lat: number;
  lng: number;
}

type MarkerType = {
  id: number;
  name: string;
}

export default function Home() {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  const [places, setPlaces] = useState<ApiResponsePlace[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDDhl-OSSGdhY7dgCALcR2ZkgYNbhyd5T8',
  });
  const [mapRef, setMapRef] = useState<google.maps.Map | null>();
  const [circleRef, setCircleRef] = useState<google.maps.Circle | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<MarkerType>();
  const [center,setCenter] = useState<CenterType>();

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if(latitude && longitude){
      setCenter({ lat: Number(latitude), lng: Number(longitude) })
      drawCircleAroundMarkers();
      updateMapBounds();
    }
    else {
      setCenter({ lat: Number(41.057555), lng: Number(28.993958) })
    }

  },[places])

  const validateInputs = (): boolean => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Invalid latitude. Please type value that between -90 and 90');
      return false;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Invalid longitude. Please type value that between -180 and 180');
      return false;
    }

    if (isNaN(rad) || rad <= 0) {
      setError('Invalid radius. Please type positive input');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!validateInputs()){
      return;
    }

    const url = new URL('https://notificationexample16.oa.r.appspot.com/place/v1');

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

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    places?.forEach(({ latitude, longitude }) => bounds.extend({ lat: latitude, lng: longitude }));
    map.fitBounds(bounds);
  };

  const handleMarkerClick = (id: number, lat: number, lng:number, name: string) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, name });
    setIsOpen(true);
  };

  const drawCircleAroundMarkers = () => {
    const bounds = new google.maps.LatLngBounds();

    places.forEach(place => {
      bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
    });

    if (!bounds.isEmpty()) {

      if (circleRef) {
        circleRef.setMap(null);
      }

      const center = bounds.getCenter();

      const newCircleRef = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: mapRef,
        center: center,
        radius: Number(radius),
      });

      setCircleRef(newCircleRef);
    }
  };

  const updateMapBounds = () => {
    if (!mapRef || places.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
    });

    if (!bounds.isEmpty()) {
      const newCenter = bounds.getCenter();
      const newZoom = calculateZoomLevel(bounds);

      window.setTimeout(() => {
        mapRef.panTo(newCenter);
      }, 500);

      window.setTimeout(() => {
        mapRef.setZoom(newZoom);
      }, 500);
    }
  };

  const calculateZoomLevel = (bounds: google.maps.LatLngBounds): number => {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;

    function latRad(lat: number): number {
      const sin = Math.sin((lat * Math.PI) / 180);
      const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx: number, worldPx: number, fraction: number): number {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    const lngDiff = ne.lng() - sw.lng();
    const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    const latZoom = zoom(mapRef!.getDiv()!.offsetHeight, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(mapRef!.getDiv()!.offsetWidth, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
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
        {!isLoaded ? (
            <h1>Loading...</h1>
        ) : (
            <GoogleMap
                mapContainerStyle={{height:'70%', width:'70%'}}
                center={center}
                zoom={12}
                onLoad={onMapLoad}
                onClick={() => setIsOpen(false)}
            >
              {places.map((item,ind) => (
                  <Marker
                      key={ind}
                      position={{lat: item.latitude, lng: item.longitude}}
                      onClick={() => {
                        handleMarkerClick(ind, item.latitude, item.longitude, item.placeName);
                      }}
                  >
                    {isOpen && infoWindowData?.id === ind && (
                        <InfoWindow
                            onCloseClick={() => {
                              setIsOpen(false);
                            }}
                        >
                          <h3 className="text-black">{infoWindowData.name}</h3>
                        </InfoWindow>
                    )}
                  </Marker>
              ))}
            </GoogleMap>
        )}
      </div>
  )
}
