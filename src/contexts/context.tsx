import { createContext, useReducer, useContext as useReactContext } from "react";
import type { ReactNode } from "react";
import type { Fruit, JarItem } from "../types";

type State = {
  jarItems: JarItem[];
  totalCalories: number;
  totalItems: number;
};

type Action =
  | { type: "ADD_FRUIT"; fruit: Fruit }
  | { type: "ADD_GROUP"; fruits: Fruit[] }
  | { type: "REMOVE_FRUIT"; fruitId: number }
  | { type: "UPDATE_QUANTITY"; fruitId: number; quantity: number }
  | { type: "CLEAR_JAR" };

type ContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Context = createContext<ContextType | undefined>(undefined);

function calculateTotals(items: JarItem[]): Pick<State, "totalCalories" | "totalItems"> {
  return {
    totalCalories: items.reduce((sum, item) => sum + item.nutritions.calories * item.quantity, 0),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_FRUIT": {
      const existingItem = state.jarItems.find((item) => item.id === action.fruit.id);
      const jarItems = existingItem
        ? state.jarItems.map((item) =>
            item.id === action.fruit.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.jarItems, { ...action.fruit, quantity: 1 }];
      return { ...state, jarItems, ...calculateTotals(jarItems) };
    }
    case "ADD_GROUP": {
      let jarItems = [...state.jarItems];
      action.fruits.forEach((fruit) => {
        const existingItem = jarItems.find((item) => item.id === fruit.id);
        if (existingItem) {
          jarItems = jarItems.map((item) =>
            item.id === fruit.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          jarItems.push({ ...fruit, quantity: 1 });
        }
      });
      return { ...state, jarItems, ...calculateTotals(jarItems) };
    }
    case "REMOVE_FRUIT": {
      const jarItems = state.jarItems.filter((item) => item.id !== action.fruitId);
      return { ...state, jarItems, ...calculateTotals(jarItems) };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const jarItems = state.jarItems.filter((item) => item.id !== action.fruitId);
        return { ...state, jarItems, ...calculateTotals(jarItems) };
      }
      const jarItems = state.jarItems.map((item) =>
        item.id === action.fruitId ? { ...item, quantity: action.quantity } : item
      );
      return { ...state, jarItems, ...calculateTotals(jarItems) };
    }
    case "CLEAR_JAR": {
      return { jarItems: [], totalCalories: 0, totalItems: 0 };
    }
    default:
      return state;
  }
}

export function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    jarItems: [],
    totalCalories: 0,
    totalItems: 0,
  });

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}

export function useAppContext(): ContextType {
  const context = useReactContext(Context);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a Provider");
  }
  return context;
} 