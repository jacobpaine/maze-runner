import React, { useMemo, useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { playerPositionAndDirectionToSideWalls } from "../utils/viewUtils";

export const FirstPersonView: React.FC = () => {
  const { direction, mazeData, playerPos } = useGame();
  const { x, y } = playerPos;
  const [movementOffset, setMovementOffset] = useState(0);
  const [bobOffset, setBobOffset] = useState(0);

  // Simulate movement effects when walking
  useEffect(() => {
    setMovementOffset((prev) => (prev === 0 ? -5 : 0)); // Forward shift
    setBobOffset((prev) => (prev === 0 ? 3 : 0)); // Up-down bobbing effect

    const timeout = setTimeout(() => {
      setMovementOffset(0);
      setBobOffset(0);
    }, 200); // Short effect duration for natural feel
    return () => clearTimeout(timeout);
  }, [x, y]); // Trigger effect when position changes
  // Front walls - Render up to 3 layers deep
  const frontWalls = useMemo(() => {
    const walls = [];
    for (let i = 1; i <= 3; i++) {
      const checkX = direction === "E" ? x + i : direction === "W" ? x - i : x;
      const checkY = direction === "N" ? y - i : direction === "S" ? y + i : y;
      if (mazeData[checkY]?.[checkX] === "#") {
        walls.push({
          id: `wall-${i}`,
          distance: i,
          width: `${100 - i * 15}%`,
          height: `${100 - i * 15}%`,
          top: `${i * 8}%`,
          opacity: 1 - i * 0.2,
          texture: "/textures/brick_wall.png",
          zIndex: 30 - i,
        });
      }
    }
    return walls;
  }, [x, y, direction]);

  // const sideRooms = useMemo(() => {
  //   const sideWalls = playerPositionAndDirectionToSideWalls(
  //     playerPos,
  //     direction
  //   );
  //   return sideWalls.flat().filter(Boolean);
  // }, [playerPos, direction]);

  const sideRooms = useMemo(() => {
    const sideWalls = playerPositionAndDirectionToSideWalls(
      playerPos,
      direction
    );
    const walls = sideWalls.flat().filter(Boolean);
    console.log("Final sideWalls before rendering:", walls);
    return walls;
  }, [playerPos, direction]);

  const ceilingAndFloor = useMemo(() => {
    return [
      {
        type: "ceiling",
        width: "110%",
        height: "40%",
        top: "0%",
        transform: `perspective(800px) rotateX(20deg) scaleX(1) translateY(${bobOffset}px) translateZ(${movementOffset}px)`,
        backgroundColor: "rgba(120, 120, 200, 0.8)",
        zIndex: 10,
      },
      {
        type: "floor",
        width: "110%",
        height: "40%",
        bottom: "0%",
        transform: `perspective(800px) rotateX(-20deg) scaleX(1) translateY(${bobOffset}px) translateZ(${movementOffset}px)`,
        backgroundColor: "rgba(80, 50, 30, 0.9)",
        zIndex: 1,
      },
    ];
  }, [bobOffset, movementOffset]);

  return (
    <div className="relative w-64 h-64 bg-gray-900 border border-gray-700 overflow-hidden transition-all duration-200">
      {ceilingAndFloor.map((plane) => {
        console.log("Plane: ", plane);
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
      {sideRooms.map((sideRoom, index) => {
        if (!sideRoom) {
          console.warn(`Side wall at index ${index} is undefined!`);
          return null;
        }
        if (!sideRoom.transform) {
          console.warn(
            `Side wall at index ${index} is missing transform!`,
            sideRoom
          );
        }
        return (
          <div
            id={`${sideRoom.id}-${index}`}
            key={`${sideRoom.id}-${index}`} // Ensure each key is unique
            className="absolute transition-all duration-200"
            style={{
              width: sideRoom.width || "50%", // Ensure a default width
              height: sideRoom.height || "100%", // Ensure a default height
              transform: sideRoom.transform || "none",
              backgroundColor: sideRoom.backgroundColor || "red", // Make it visible for debugging
              zIndex: sideRoom.zIndex || 10,
            }}
          />
        );
      })}

      {frontWalls.map((wall) => (
        <div
          key={wall.id}
          className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300"
          style={{
            width: wall.width,
            height: wall.height,
            top: wall.top,
            opacity: wall.opacity,
            backgroundImage: `url(${wall.texture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: wall.zIndex,
          }}
        />
      ))}
    </div>
  );
};
