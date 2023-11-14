import { useRouter } from "next/router";
import { useState } from "react";

export const Header: React.FC = () => {
  const router = useRouter();
  function handleHome() {
    router.push("/");
  }

  return (
    <div className="w-screen h-[4rem] flex justify-center absolute bg-transparent">
      <div className="w-[95%] h-[4rem] flex items-center text-[2rem] border-b-2 border-[#969696]">
        <button onClick={handleHome}>ForestFind</button>
      </div>
    </div>
  );
};

export default Header;
