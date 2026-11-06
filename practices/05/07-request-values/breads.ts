export interface Bread {
  id: number;
  name: string;
  price: number;
  vegan: boolean;
}

export interface BreadListOptions {
  page: number;
  sort: "name" | "price";
  vegan?: boolean;
}

export const PAGE_SIZE = 3;

const BREADS: Bread[] = [
  { id: 1, name: "소금빵", price: 3200, vegan: false },
  { id: 2, name: "통밀 바게트", price: 4500, vegan: true },
  { id: 3, name: "크루아상", price: 3800, vegan: false },
  { id: 4, name: "호밀빵", price: 5200, vegan: true },
  { id: 5, name: "단팥빵", price: 2500, vegan: false },
  { id: 6, name: "베이글", price: 3000, vegan: true },
  { id: 7, name: "치아바타", price: 4000, vegan: true },
];

export function listBreads(options: BreadListOptions): Bread[] {
  const filtered =
    options.vegan === undefined
      ? BREADS
      : BREADS.filter((bread) => bread.vegan === options.vegan);
  const sorted = [...filtered].sort((a, b) =>
    options.sort === "price" ? a.price - b.price : a.name.localeCompare(b.name),
  );
  const start = (options.page - 1) * PAGE_SIZE;

  return sorted.slice(start, start + PAGE_SIZE);
}
