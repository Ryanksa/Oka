import React from "react";
import HotSpring from "../../components/HotSpring";
import Bulleting from "../../components/Bulleting";

export default function TakeABreak() {
  if (typeof window === "undefined") {
    return <></>;
  }

  const breakOption = localStorage.getItem("takeABreak");
  if (breakOption === "bulleting") {
    return <Bulleting />;
  }
  return <HotSpring />;
}
