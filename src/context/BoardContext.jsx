import { createContext, useState, useContext } from "react";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [items, setItems] = useState([]); // stores dropped icons on field

  const addItem = (item) => setItems((prev) => [...prev, item]);

  return (
    <BoardContext.Provider value={{ items, addItem }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
