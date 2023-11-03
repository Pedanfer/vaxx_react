import React from "react";
import dynamic from "next/dynamic";
const PixiWrapper = dynamic(() => import("../components/pixi-wrapper"), {
  ssr: false,
});
export default function Home() {
  return <PixiWrapper />;
}
