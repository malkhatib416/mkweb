import * as React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    // @ts-ignore
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF7F3",
        },
      },
      [
        React.createElement("img", {
          src: "https://mk-web.fr/logo.png",
          width: 120,
          height: 120,
          style: { borderRadius: 24, marginBottom: 32 },
          key: "logo",
        }),
        React.createElement(
          "span",
          {
            style: {
              fontSize: 56,
              fontWeight: 800,
              color: "#FF7F50",
              margin: 0,
              fontFamily: "Inter, sans-serif",
            },
            key: "title",
          },
          "MKWeb"
        ),
        React.createElement(
          "span",
          {
            style: {
              fontSize: 32,
              color: "#4F66FF",
              marginTop: 16,
              fontFamily: "Inter, sans-serif",
            },
            key: "desc",
          },
          "Création de sites web modernes & SEO"
        ),
      ]
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
