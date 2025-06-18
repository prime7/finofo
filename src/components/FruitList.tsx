import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  Grid,
  Search,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import type { Fruit, GroupBy, ViewType, GroupedFruits } from "../types";

interface FruitListProps {
  fruits: Fruit[];
  groupBy: GroupBy;
  viewType: ViewType;
  onGroupByChange: (groupBy: GroupBy) => void;
  onViewTypeChange: (viewType: ViewType) => void;
  onAddFruit: (fruit: Fruit) => void;
  onAddGroup: (fruits: Fruit[]) => void;
}

const FruitList = ({
  fruits,
  groupBy,
  viewType,
  onGroupByChange,
  onViewTypeChange,
  onAddFruit,
  onAddGroup,
}: FruitListProps) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFruits = useMemo(() => {
    if (!searchQuery.trim()) return fruits;

    const query = searchQuery.toLowerCase().trim();
    return fruits.filter(
      (fruit) =>
        fruit.name.toLowerCase().includes(query) ||
        fruit.family.toLowerCase().includes(query) ||
        fruit.order.toLowerCase().includes(query) ||
        fruit.genus.toLowerCase().includes(query)
    );
  }, [fruits, searchQuery]);

  const groupedFruits = useMemo((): GroupedFruits => {
    if (groupBy === "none") {
      return { "All Fruits": filteredFruits };
    }

    return filteredFruits.reduce((acc, fruit) => {
      const key = fruit[groupBy];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(fruit);
      return acc;
    }, {} as GroupedFruits);
  }, [filteredFruits, groupBy]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderCompactFruitCard = (fruit: Fruit) => (
    <Card
      key={fruit.id}
      className="hover:shadow-md transition-all duration-200 border-gray-200 m-0 p-0 relative group cursor-pointer"
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-800 hover:text-gray-900 transition-colors">
              {fruit.name}
            </h4>
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 text-orange-400 bg-orange-50"
            >
              {fruit.nutritions.calories} cal
            </Badge>
          </div>
          <Button
            onClick={() => onAddFruit(fruit)}
            size="sm"
            className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-0.5 transition-all duration-200 hover:bg-primary/90 flex items-center justify-center w-full"
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFruitGrid = (groupFruits: Fruit[]) => (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {groupFruits.map(renderCompactFruitCard)}
    </div>
  );

  const renderFruitTable = (groupFruits: Fruit[]) => (
    <Card className="border-gray-200">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Family</TableHead>
              <TableHead className="text-xs">Order</TableHead>
              <TableHead className="text-xs">Genus</TableHead>
              <TableHead className="text-xs">Calories</TableHead>
              <TableHead className="text-center text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupFruits.map((fruit) => (
              <TableRow key={fruit.id} className="border-gray-100">
                <TableCell className="font-medium text-sm py-2">
                  {fruit.name}
                </TableCell>
                <TableCell className="text-sm py-2">{fruit.family}</TableCell>
                <TableCell className="text-sm py-2">{fruit.order}</TableCell>
                <TableCell className="text-sm py-2">{fruit.genus}</TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="text-xs">
                    {fruit.nutritions.calories}
                  </Badge>
                </TableCell>
                <TableCell className="text-center py-2">
                  <Button
                    onClick={() => onAddFruit(fruit)}
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                  >
                    <Plus size={10} className="mr-1" />
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderGroup = (groupName: string, groupFruits: Fruit[]) => {
    const isExpanded = expandedGroup === groupName;
    const showGroupHeader = groupBy !== "none";

    return (
      <div key={groupName} className="mb-4">
        {showGroupHeader && (
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
            <Button
              onClick={() => toggleGroup(groupName)}
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 p-0 h-auto text-sm"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span>{groupName}</span>
              <Badge variant="outline" className="ml-2 text-xs px-2 py-0.5">
                {groupFruits.length}
              </Badge>
            </Button>
            {showGroupHeader && groupFruits.length > 0 && (
              <Button
                onClick={() => onAddGroup(groupFruits)}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Plus size={12} className="mr-1" />
                Add All
              </Button>
            )}
          </div>
        )}

        {(isExpanded || !showGroupHeader) && (
          <div className="pl-2">
            {viewType === "list"
              ? renderFruitGrid(groupFruits)
              : renderFruitTable(groupFruits)}
          </div>
        )}
      </div>
    );
  };

  const totalResultCount = filteredFruits.length;
  const isFiltered = searchQuery.trim().length > 0;

  return (
    <Card className="p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Fruits</h2>
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search fruits by name, family, order, or genus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="groupBy"
                className="text-sm font-medium text-gray-700"
              >
                Group by
              </label>
              <Select value={groupBy} onValueChange={onGroupByChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="genus">Genus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View</span>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  onClick={() => onViewTypeChange("list")}
                  variant={viewType === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none border-0"
                >
                  <Grid size={14} className="mr-1" />
                  List
                </Button>
                <Button
                  onClick={() => onViewTypeChange("table")}
                  variant={viewType === "table" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none border-0"
                >
                  <List size={14} className="mr-1" />
                  Table
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {isFiltered ? (
              <>
                Showing {totalResultCount} of {fruits.length} fruits
                {totalResultCount === 0 && (
                  <span className="text-red-600 ml-2">
                    No fruits match your search
                  </span>
                )}
              </>
            ) : (
              `Showing ${fruits.length} fruits`
            )}
          </div>
        </div>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="pr-4">
          {Object.entries(groupedFruits).map(([groupName, groupFruits]) =>
            renderGroup(groupName, groupFruits)
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default FruitList;
