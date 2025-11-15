export default function DroppedItem({ x, y, type, color }) {
    const style = {
      position: "absolute",
      top: y - 20,
      left: x - 20,
    };
  
    return (
      <div style={style}>
        {type === "player" && (
          <div
            className="w-10 h-10 rounded-full border-2"
            style={{ background: color, borderColor: "white" }}
          ></div>
        )}
  
        {type === "cone" && (
          <div
            className="w-0 h-0 border-l-10 border-r-10 border-b-20"
            style={{ borderBottomColor: color }}
          ></div>
        )}
  
        {type === "ball" && <div style={{ fontSize: "24px" }}>⚽</div>}
      </div>
    );
  }
  