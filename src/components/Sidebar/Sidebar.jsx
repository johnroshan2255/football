import { useDraggable } from "@dnd-kit/core";

const items = [
  { id: "player-blue", type: "player", color: "blue" },
  { id: "player-red", type: "player", color: "red" },
  { id: "cone-yellow", type: "cone", color: "yellow" },
  { id: "ball", type: "ball" },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4 border-r h-screen">
      <h2 className="font-bold mb-4">Tools</h2>

      {items.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  );
}

const DraggableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
    data: item,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-pointer p-2 rounded mb-2 bg-white shadow border"
    >
      {item.type === "player" && (
        <div
          className="w-8 h-8 rounded-full"
          style={{ background: item.color }}
        ></div>
      )}

      {item.type === "cone" && (
        <div
          className="w-0 h-0 border-l-8 border-r-8 border-b-16"
          style={{ borderBottomColor: item.color }}
        ></div>
      )}

      {item.type === "ball" && <div>⚽</div>}
    </div>
  );
};
