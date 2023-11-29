import React from "react";
import { useRouter } from "next/router";

export const Home: React.FC = () => {
  const router = useRouter();

  function handleFindForest() {
    router.push("/findforest/coordinates");
  }

  function handleForestChange() {
    router.push("/compareforestchange/coordinates");
  }

  function handleTimeSeries() {
    router.push("/timeseries/coordinates");
  }

  return(
    <div className="flex w-screen h-screen flex-col justify-center items-center pt-[1rem] ">
      <h1 className="text-7xl p-3">ForestFind</h1>
      <p className="w-4/6 text-xl p-3">
        Whether you're an environmental enthusiast, a conservationist, a forestry
        professional, or just a curious nature lover, ForestFind allows you to
        track and compare forest boundaries over time.
      </p>
      <div className="flex flex-row flex-wrap justify-center p-3 w-full h-1/3 ">
        <div className="w-1/5 h-full flex-col m-3">
          <button
            onClick={handleFindForest}
            className="border-4 border-green w-full h-full p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
          ></button>
          <p className="flex justify-center text-xl m-3 font-medium">
            {" "}
            Find Forest
          </p>
        </div>
        <div className="w-1/5 h-full flex-col m-3">
          <button
            onClick={handleForestChange}
            className="border-4 border-pink w-full h-full p-3 rounded-xl focus:bg-slate-300 hover:bg-slate-300"
          ></button>
          <p className="flex justify-center text-xl m-3 font-medium ">
            Forest Change
          </p>
        </div>

        <div className="w-1/5 h-full flex-col m-3">
          <button
            onClick={handleTimeSeries}
            className="border-4 border-purple w-full h-full p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
          ></button>
          <p className="flex justify-center text-xl font-medium m-3">
            {" "}
            Time Series
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
