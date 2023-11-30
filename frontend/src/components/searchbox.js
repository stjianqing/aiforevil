import {
  AddressAutofill,
  SearchBox,
  AddressMinimap,
} from "@mapbox/search-js-react";
import React, { useState, createRef, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export default function SearchBoc( {updateCoordinates }) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoieWVva2V3ZWkiLCJhIjoiY2xlcG5wZ3ZmMGUweTNxdGt4ZG1ldGhsYyJ9.HHNGnKUPolWAo5_UYwzCZg";
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [value, setValue] = useState("");

  function handleSelectLocation(e) {
    const selectLat = e.features[0].geometry.coordinates[1];
    const selectLon = e.features[0].geometry.coordinates[0];
    setLat(selectLat);
    setLng(selectLon);
    updateCoordinates(selectLat, selectLon);
    map.current.flyTo({
      center: [lng, lat],
      zoom: zoom,
    });
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <>
      <form>
        <SearchBox
          value=""
          onRetrieve={handleSelectLocation}
          accessToken="pk.eyJ1IjoidmFsdWRvbGxhciIsImEiOiJjbG95NTd1dmcwMTR0MmtuOW5mbGZjYXBlIn0.sKTGeqZyqi8BRP2O_0A8Xg"
        />
      </form>
      <div>
        <div ref={mapContainer} className="w-[30rem] h-[20rem] text-xs" />
      </div>
    </>
  );
}
