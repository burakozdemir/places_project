"use client";

import {FormEvent, useEffect, useState} from "react";
import {GoogleMap, InfoWindow, Marker, useLoadScript} from "@react-google-maps/api";


// Types
interface ApiResponse {
  id: number;
  latitude: number;
  longitude: number;
  places: ApiResponsePlace[];
  radius: number;
  timestamps: string;
}

interface ApiResponsePlace {
  id: number;
  latitude: number;
  longitude: number;
  placeId: string;
  placeName: string;
}

interface CenterType {
  lat: number;
  lng: number;
}

interface MarkerType {
  id: number;
  name: string;
}

// Constants
const DEFAULT_CENTER: CenterType = { lat: 41.057555, lng: 28.993958 };
const MAP_API_KEY = 'AIzaSyDDhl-OSSGdhY7dgCALcR2ZkgYNbhyd5T8';
const API_URL = 'https://notificationexample16.oa.r.appspot.com/place/v1';
const DEFAULT_ZOOM = 12;

// Helper Functions
const isLatitudeValid = (latitude: number): boolean => !isNaN(latitude) && latitude >= -90 && latitude <= 90;
const isLongitudeValid = (longitude: number): boolean => !isNaN(longitude) && longitude >= -180 && longitude <= 180;
const isRadiusValid = (radius: number): boolean => !isNaN(radius) && radius > 0;


export default function Home() {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  const [places, setPlaces] = useState<ApiResponsePlace[]>([]);

  const [mapRef, setMapRef] = useState<google.maps.Map | null>();
  const [circleRef, setCircleRef] = useState<google.maps.Circle | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<MarkerType>();
  const [center,setCenter] = useState<CenterType>();

  const [error, setError] = useState<string>('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
  });

  useEffect(() => {
    if(latitude && longitude){
      setCenter({ lat: Number(latitude), lng: Number(longitude) })
      drawCircleAroundMarkers();
      updateMapBounds();
    }
  },[places])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    if (!isLatitudeValid(lat)) {
      setError('Invalid latitude. Please type a value between -90 and 90');
      return;
    }

    if (!isLongitudeValid(lng)) {
      setError('Invalid longitude. Please type a value between -180 and 180');
      return;
    }

    if (!isRadiusValid(rad)) {
      setError('Invalid radius. Please type a positive input');
      return;
    }

    setError('');
    fetchPlaces(lat, lng, rad);
  };

  const fetchPlaces = (lat: number, lng: number, rad: number) => {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lng.toString(), radius: rad.toString() });
    fetch(`${API_URL}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then((result: ApiResponse) => {
          if (result.places.length > 0) {
            setPlaces(result.places);
          }
        })
        .catch(err => {
          console.error('Error:', err);
          setError('Failed to fetch places.');
        });
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    setCenter(DEFAULT_CENTER)
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
        {error && <div className="mt-3 text-red-500">{error}</div>}
        <div className="mt-3" />
        {!isLoaded ? (
            <h1>Loading...</h1>
        ) : (
            <GoogleMap
                mapContainerStyle={{height:'70%', width:'70%'}}
                center={center}
                zoom={DEFAULT_ZOOM}
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
