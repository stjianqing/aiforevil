import { useRouter } from "next/router";
import { useState, ReactNode } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
import logo from "public/logo.svg";
import Link from "next/link";
import aiforgood from "public/aiforgood.png";
import aiforgoodtext from "public/aiforgood_text.png";

export const Header: React.FC = () => {
  const router = useRouter();
  function handleHome() {
    router.push("/");
  }
  return (
    <div className="w-screen h-[3rem] flex absolute justify-between bg-white">
      <div className="w-fit h-[3rem] flex text-xl text-black  mx-0 items-center justify-center">
        {/* <div className="w-[2rem] h-[2rem] object-cover "> */}
        <Image
          onClick={handleHome}
          src={aiforgood}
          width={80}
          height={80}
          className=" w-[3rem] object-cover sm:mx-2 ml-2  "
        ></Image>
        {/* </div> */}
        <button onClick={handleHome} className=" hidden sm:flex">
          ForestFind
        </button>
        <Image
          onClick={handleHome}
          src={logo}
          width={20}
          height={20}
          className="ml-2"
        ></Image>
      </div>
      {/* <div className="flex w-fit h-[3rem] items-center justify-center sm:mx-5 mx-2 ">
        <Link href="/about">
          <u>
            <p className="">About</p>
          </u>
        </Link>
      </div> */}
    </div>
  );
};

export default Header;
