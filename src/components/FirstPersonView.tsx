import React, { useMemo, useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { findAllVisibleRoomCoords, renderRooms } from "../utils/viewUtils";

export const FirstPersonView: React.FC = () => {
  const { direction, playerPos } = useGame();
  const { x, y } = playerPos;
  const [movementOffset, setMovementOffset] = useState(0);
  const [bobOffset, setBobOffset] = useState(0);

  // Simulate movement effects when walking
  useEffect(() => {
    setMovementOffset((prev) => (prev === 0 ? -5 : 0)); // Forward shift
    setBobOffset((prev) => (prev === 0 ? 3 : 0)); // Up-down bobbing effect

    const timeout = setTimeout(() => {
      setMovementOffset(0);
      setBobOffset(-10);
    }, 150);
    return () => clearTimeout(timeout);
  }, [x, y]);

  const walls = useMemo(() => {
    const visibility = 4;
    const coords = findAllVisibleRoomCoords({ x, y }, direction, visibility);
    const rooms = renderRooms({ x, y }, coords, direction);
    return rooms.flat();
  }, [x, y, direction]);


  const ceilingAndFloor = useMemo(() => {
    return [
      {
        type: "ceiling",
        width: "110%",
        height: "25%",
        top: "0%",
        transform: `perspective(800px) rotateX(20deg) scaleX(1) translateY(0px) translateZ(${movementOffset}px)`,
        backgroundColor: "rgba(80, 10, 10, 0.5)",
        zIndex: 0,
      },
      {
        type: "floor",
        width: "110%",
        height: "40%",
        bottom: "0%",
        transform: `perspective(800px) rotateX(-20deg) scaleX(1) translateY(-5px) translateZ(${movementOffset}px)`,
        backgroundColor: "rgba(80, 50, 30, 0.9)",
        zIndex: 0,
      },
    ];
  }, [bobOffset, movementOffset]);

  return (
    <div className="relative w-64 h-64 bg-gray-900 border border-gray-700 overflow-hidden transition-all duration-200">
      {ceilingAndFloor.map((plane) => {
        return (
          <div
            key={`plane-${plane.type}`}
            className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-200"
            style={{
              width: plane.width,
              height: plane.height,
              [plane.type === "ceiling" ? "top" : "bottom"]:
                plane.type === "ceiling" ? plane.top : plane.bottom,
              transform: plane.transform,
              backgroundColor: plane.backgroundColor,
              zIndex: plane.zIndex,
            }}
          ></div>
        );
      })}

      {walls.map((wall) => {
        if (!wall) return null;
        const { id, width, height, backgroundImage, transform, zIndex } = wall;
        return (
          <div
            id={id}
            key={id}
            className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300"
            style={{
              width: width,
              height: height,
              top: wall.top || "0%",
              opacity: wall.opacity || 1,
              transform,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              zIndex,
            }}
          />
        );
      })}
    </div>
  );
};
