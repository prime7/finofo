export type Fruit = {
  name: string;
  id: number;
  family: string;
  order: string;
  genus: string;
  nutritions: Nutritions;
};

export type Nutritions = {
  calories: number;
  fat: number;
  sugar: number;
  carbohydrates: number;
  protein: number;
};

export type GroupBy = 'none' | 'family' | 'order' | 'genus';

export type ViewType = 'list' | 'table';

export type JarItem = Fruit & {
  quantity: number;
};

export type GroupedFruits = {
  [key: string]: Fruit[];
};
