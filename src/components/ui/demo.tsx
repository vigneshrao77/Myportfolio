"use client";

import React from "react";
import { MouseFollowingEyes } from "@/components/ui/mouse-following-eyes";
import { TextParticle } from "@/components/ui/text-particle";

const Demo = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        background: "#12141A",
      }}
    >
      <div style={{ width: "600px", height: "150px" }}>
        <TextParticle text="Vignesh Rao" />
      </div>
      <MouseFollowingEyes size={42} gap={10} />
    </div>
  );
};

export { Demo };
export default Demo;
