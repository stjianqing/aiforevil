import { useRouter } from "next/router";
import { useState, ReactNode } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
import logo from "public/logo.svg";

export const Header: React.FC = () => {
  const router = useRouter();
  function handleHome() {
    router.push("/");
  }
  return (
    <div className="w-screen h-[3rem] flex absolute bg-white">
      <div className="w-fit h-[3rem] flex text-xl text-black sm:mx-10 mx-0 items-center justify-center">
        <button onClick={handleHome} className=" hidden sm:flex">
          ForestFind
        </button>
        <Image
          onClick={handleHome}
          src={logo}
          width={20}
          height={20}
          className="mx-2"
        ></Image>
      </div>
    </div>
  );
};

export default Header;
