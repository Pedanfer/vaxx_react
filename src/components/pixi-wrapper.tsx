"use client";

import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import * as PixiApp from "@/pixi/pixi-app";
import { Box, Container } from "@mui/material";

export default function PixiWrapper() {
  let pixiApp = useRef<Application<HTMLCanvasElement> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPixiAndAppend = async () => {
      pixiApp.current = await PixiApp.init();
      // We add the pixi code to a div in our DOM after component mounts
      canvasRef.current!.appendChild(pixiApp.current!.view);
    };

    initPixiAndAppend();

    // We reset the pixi app and its reference upon closing
    return () => {
      if (pixiApp.current) {
        pixiApp.current!.stop();
        pixiApp.current!.destroy(true);
        pixiApp.current = null;
      }
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: "url('Images/background.png')",
        width: "100vw",
        height: "100vh",
      }}
      ref={canvasRef}
    ></Box>
  );
}
