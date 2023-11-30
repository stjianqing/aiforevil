import { useRouter } from "next/router";
import { useState, ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";


export const Header: React.FC = () => {
  const router = useRouter();
  function handleHome() {
    router.push("/",);
  }
    return (
      <div className="w-screen h-[3rem] flex absolute bg-transparent">
        <div className="w-fit h-[3rem] flex text-xl text-black mx-10 content-center">
          <button onClick={handleHome}>ForestFind</button>
          <FontAwesomeIcon className="h-[3rem] mt-3 mx-3" icon={faTree} />
        </div>
      </div>
    );

};

export default Header;
