import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import sutd from "public/sutd.png";
import aiforgood from "public/aiforgood.png";

export const About: React.FC = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-scroll">
      <div className="flex justify-center items-center flex-col text-black w-2/3">
        <p className=" text-lg sm:text-3xl">About</p>
        <p className="text-xs sm:text-lg sm:my-[1rem] my-[0.5rem]">
          Conservationists face a significant challenge in obtaining precise
          data, particularly when it comes to assessing the impact of factors
          such as defortation, urbanization, and forest degradation. Aiforgood
          ForestFind addresses this challenge by enabling you to measure, track,
          and compare forest boundaries over time. This tool provides valuable
          insights that can contribute to the protection and conservation of
          these vital resources, offering a solution to the difficulties
          associated with accurately gauging the extent of environmental
          changes.
        </p>
        <p className="mb-[1rem] text-xs sm:text-lg">
          We are a group of students from Singapore University of Technology and
          Design studying in Design and Artificial Intelligence. This project is
          a collaboration with AIforGood.
        </p>
        <div className="flex flex-row w-full justify-center items-center">
          <div>
            <Image
              src={sutd}
              alt="sutd logo"
              width={100}
              className="h-auto mr-[1rem]"
            ></Image>
          </div>
          <div>
            <Image
              src={aiforgood}
              alt="aiforgood logo"
              width={80}
              className="h-auto object-cover"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
