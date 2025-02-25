import React from "react";
import { TitleProps } from "@refinedev/core";
import NextRouter from '@refinedev/nextjs-router';
const { Link } = NextRouter;



export const Title: React.FC<TitleProps> = ({ collapsed }) => (
  <Link to="/home">
    {collapsed ? (
      <img
        src={"/images/logo.svg"}
        alt="Refine"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "6px 9px",
          width: "40px",
          height: "40px",
          objectFit: "contain",
          borderRadius: 8,
          backgroundColor:'#f8f9fe',
          // borderBottom: "1px solid #3c3b3b"
        }}
      />
    ) : (
      <img
        src={"/images/logo.svg"}
        alt="Refine"
        style={{
          width: "40px",
          margin: "6px 9px",
          height: "40px",
          objectFit: "contain",
          backgroundColor:'#f8f9fe',
          borderRadius: 8,
          // borderBottom: "1px solid #3c3b3b"
        }}
      />
    )}
  </Link>
);
