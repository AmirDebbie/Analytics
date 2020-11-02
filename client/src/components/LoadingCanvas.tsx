import React, { useEffect, useRef } from "react";
import styled from "styled-components";
interface CanvasProps {
  size: number;
  color: string;
}

const LoadingCanvas = ({ size, color }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const width: number = size;
    const height: number = size;
    let angle = 0;

    if (typeof canvas?.getContext === undefined) {
      return;
    }

    const ctx = canvas?.getContext("2d");

    const draw = () => {
      const outerRadius: number = size / 5;
      const innerRadius: number = size / 6;

      if (ctx) {
        ctx.save();
        ctx.translate(width / 2, height / 2);

        ctx.strokeStyle = color;
        ctx.lineWidth = size / 50;

        ctx.beginPath();
        ctx.moveTo(
          innerRadius * Math.cos((Math.PI / 180) * angle),
          innerRadius * Math.sin((Math.PI / 180) * angle)
        );
        ctx.lineTo(
          outerRadius * Math.cos((Math.PI / 180) * angle),
          outerRadius * Math.sin((Math.PI / 180) * angle)
        );
        ctx.stroke();

        ctx.restore();
      }
    };

    const update = () => {
      if (ctx) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(0, 0, width, height);
        draw();
        angle += 12;
        setTimeout(() => {
          update();
        }, 60);
      }
    };

    update();
  }, [color, size]);

  return <Canvas ref={canvasRef} width={size} height={size} />;
};

LoadingCanvas.defaultProps = {
  size: 300,
  color: "#53B2E6",
};

export default LoadingCanvas;

const Canvas = styled.canvas`
  display: "block";
`;
