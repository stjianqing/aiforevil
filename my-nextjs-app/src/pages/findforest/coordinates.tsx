import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  AddressAutofill,
  SearchBox,
  AddressMinimap,
} from "@mapbox/search-js-react";
import SearchBoc from "@/components/searchbox";
import dynamic from "next/dynamic";

export const FFCoordinate: React.FC = () => {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [cropData, setCropData] = useState(router.query.cropData);

  const Box = dynamic(() => import("@/components/searchbox"), {
    ssr: false,
  });
  useEffect(() => {
    const accessToken =
      "pk.eyJ1IjoidmFsdWRvbGxhciIsImEiOiJjbG95NTd1dmcwMTR0MmtuOW5mbGZjYXBlIn0.sKTGeqZyqi8BRP2O_0A8Xg";
    setToken(accessToken);
    // config.accessToken = accessToken;
  }, []);
  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  function handleConfirm() {
    router.push({
      pathname: "/findforest/date",
      query: { latitude: latitude, longitude: longitude },
    });
  }
  return (
    <div className="flex w-screen h-screen flex-col pt-[5rem] items-center  ">
      <h1 className="text-[1.5rem]">Find Forest</h1>

      <div className="flex w-1/2 flex-col justify-center items-center">
        <p>Enter your coordinates</p>
        <div className="flex flex-row mt-[1rem]">
          <div className="flex flex-col mr-[2rem]">
            <label className="mt-1 mb-6">Latitude:</label>
            <label className="">Longitude:</label>
          </div>
          <div className="flex flex-col">
            <input
              onChange={handleLatitudeChange}
              type="text"
              className="w-[8rem] mb-4 border border-black p-1 rounded "
            ></input>
            <input
              onChange={handleLongitudeChange}
              type="text"
              className="w-[8rem] border border-black p-1 rounded"
            ></input>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          className="mt-[1rem] border border-black rounded-xl p-2"
        >
          Confirm
        </button>
      </div>

      <div>
        {/* <SearchBox accessToken={token}></SearchBox> */}
        <SearchBoc />
      </div>
    </div>
  );
};

export default FFCoordinate;
