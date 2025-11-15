import { useDroppable } from "@dnd-kit/core";
import { useBoard } from "../../context/BoardContext";
import DroppedItem from "./DroppedItem";

export default function Field() {
  const { items } = useBoard();
  const { setNodeRef } = useDroppable({ id: "football-field" });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-green-500 relative border-4 border-white"
      style={{
        backgroundImage:
          "linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px)",
        backgroundSize: "80px 80px",
      }}
    >
      {items.map((item, index) => (
        <DroppedItem key={index} {...item} />
      ))}
    </div>
  );
}
