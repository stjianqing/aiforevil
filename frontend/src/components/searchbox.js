// import {
//   AddressAutofill,
//   SearchBox,
//   AddressMinimap,
// } from "@mapbox/search-js-react";
// import React, { useState, createRef, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";

// export default function SearchBoc({ updateCoordinates }) {
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoieWVva2V3ZWkiLCJhIjoiY2xlcG5wZ3ZmMGUweTNxdGt4ZG1ldGhsYyJ9.HHNGnKUPolWAo5_UYwzCZg";
//   const mapContainer = useRef(null);
//   const mapSeen = useRef(null);
//   const [lng, setLng] = useState(-70.9);
//   const [lat, setLat] = useState(42.35);
//   const [zoom, setZoom] = useState(9);
//   const [value, setValue] = useState("");

//   function handleSelectLocation(e) {
//     const selectLat = e.features[0].geometry.coordinates[1];
//     const selectLon = e.features[0].geometry.coordinates[0];
//     setLat(selectLat);
//     setLng(selectLon);
//     updateCoordinates(selectLat, selectLon);
//     mapSeen.current.flyTo({
//       center: [lng, lat],
//       zoom: zoom,
//     });
//   }

//   useEffect(() => {
//     if (mapSeen.current) return; // initialize map only once
//     mapSeen.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v12",
//       center: [lng, lat],
//       zoom: zoom,
//     });
//   });

//   return (
//     <>
//       <form className="flex flex-col">
//         <SearchBox
//           value=""
//           onRetrieve={handleSelectLocation}
//           accessToken="pk.eyJ1IjoidmFsdWRvbGxhciIsImEiOiJjbG95NTd1dmcwMTR0MmtuOW5mbGZjYXBlIn0.sKTGeqZyqi8BRP2O_0A8Xg"
//           className="w-[18rem] sm:w-full "
//         />
//       </form>
//       <div>
//         <div
//           ref={mapContainer}
//           className="sm:w-[30rem] sm:h-[20rem] text-xs w-[18rem] h-[18rem]"
//         />
//       </div>
//     </>
//   );
// }

// import {
//   AddressAutofill,
//   SearchBox as MapboxSearchBox,
//   AddressMinimap,
// } from "@mapbox/search-js-react";
// import React, { useState, createRef, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";

// export default function SearchBox({ updateCoordinates }) {
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoieWVva2V3ZWkiLCJhIjoiY2xlcG5wZ3ZmMGUweTNxdGt4ZG1ldGhsYyJ9.HHNGnKUPolWAo5_UYwzCZg";
//   const mapContainer = useRef(null);
//   const mapSeen = useRef(null);
//   const [lng, setLng] = useState(-70.9);
//   const [lat, setLat] = useState(42.35);
//   const [zoom, setZoom] = useState(9);
//   const [value, setValue] = useState("");

//   function handleSelectLocation(e) {
//     const selectLat = e.features[0].geometry.coordinates[1];
//     const selectLon = e.features[0].geometry.coordinates[0];
//     setLat(selectLat);
//     setLng(selectLon);
//     updateCoordinates(selectLat, selectLon);
//     mapSeen.current.flyTo({
//       center: [lng, lat],
//       zoom: zoom,
//     });
//   }

//   useEffect(() => {
//     // Check if document is defined before using it
//     if (typeof document !== "undefined" && mapSeen.current === null) {
//       mapSeen.current = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: "mapbox://styles/mapbox/streets-v12",
//         center: [lng, lat],
//         zoom: zoom,
//       });
//     }
//   }, [mapSeen]); // Ensure the effect runs when mapSeen changes

//   return (
//     <>
//       <form className="flex flex-col">
//         <MapboxSearchBox
//           value=""
//           onRetrieve={handleSelectLocation}
//           accessToken="pk.eyJ1IjoidmFsdWRvbGxhciIsImEiOiJjbG95NTd1dmcwMTR0MmtuOW5mbGZjYXBlIn0.sKTGeqZyqi8BRP2O_0A8Xg"
//           className="w-[18rem] sm:w-full "
//         />
//       </form>
//       <div>
//         <div
//           ref={mapContainer}
//           className="sm:w-[30rem] sm:h-[20rem] text-xs w-[18rem] h-[18rem]"
//         />
//       </div>
//     </>
//   );
// }
import {
  AddressAutofill,
  SearchBox as MapboxSearchBox,
  AddressMinimap,
} from "@mapbox/search-js-react";
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export default function SearchBox({ updateCoordinates }) {
  const mapContainer = useRef(null);
  const mapSeen = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  function handleSelectLocation(e) {
    const selectLat = e.features[0].geometry.coordinates[1];
    const selectLon = e.features[0].geometry.coordinates[0];
    setLat(selectLat);
    setLng(selectLon);
    updateCoordinates(selectLat, selectLon);
    mapSeen.current.flyTo({
      center: [lng, lat],
      zoom: zoom,
    });
  }

  useEffect(() => {
    // Check if document is defined before using it
    if (typeof document !== "undefined" && mapSeen.current === null) {
      mapSeen.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
        accessToken:
          "pk.eyJ1IjoidmFsdWRvbGxhciIsImEiOiJjbG95NTd1dmcwMTR0MmtuOW5mbGZjYXBlIn0.sKTGeqZyqi8BRP2O_0A8Xg",
      });
    }

    return () => {
      // Clean up the map instance when the component is unmounted
      if (mapSeen.current) {
        mapSeen.current.remove();
      }
    };
  }, [lng, lat, zoom]); // Ensure the effect runs when lng, lat, or zoom changes

  return (
    <>
      <form className="flex flex-col justify-center">
        <MapboxSearchBox
          value=""
          onRetrieve={handleSelectLocation}
          accessToken="pk.eyJ1IjoidmFsdWRvbGxhciIsImEiOiJjbG95NTd1dmcwMTR0MmtuOW5mbGZjYXBlIn0.sKTGeqZyqi8BRP2O_0A8Xg"
          className="w-[16rem] sm:w-full "
        />
      </form>
      <div>
        <div
          ref={mapContainer}
          className="sm:w-[30rem] sm:h-[20rem] text-[0.5rem] w-[16rem] h-[16rem]"
        />
      </div>
    </>
  );
}
