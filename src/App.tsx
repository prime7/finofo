import { useState } from "react";
import { useFruits } from "./hooks/use-fruits";
import { Provider, useAppContext } from "./contexts/context";
import FruitList from "./components/FruitList";
import Jar from "./components/Jar";
import { Spinner } from "./components/ui/spinner";
import type { GroupBy, ViewType } from "./types";

function AppContent() {
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [viewType, setViewType] = useState<ViewType>("list");
  const { data: fruits, isLoading } = useFruits();
  const { state, dispatch } = useAppContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
          <FruitList
            fruits={fruits || []}
            groupBy={groupBy}
            viewType={viewType}
            onGroupByChange={setGroupBy}
            onViewTypeChange={setViewType}
            onAddFruit={(fruit) => dispatch({ type: "ADD_FRUIT", fruit })}
            onAddGroup={(fruits) => dispatch({ type: "ADD_GROUP", fruits })}
          />
          <Jar
            jarItems={state.jarItems}
            onRemoveFruit={(fruitId) =>
              dispatch({ type: "REMOVE_FRUIT", fruitId })
            }
            onUpdateQuantity={(fruitId, quantity) =>
              dispatch({ type: "UPDATE_QUANTITY", fruitId, quantity })
            }
            onClearJar={() => dispatch({ type: "CLEAR_JAR" })}
            totalCalories={state.totalCalories}
            totalItems={state.totalItems}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

export default App;
