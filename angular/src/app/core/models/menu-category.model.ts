export interface MenuCategory {
  id: number;
  slug: string;
  label: string;
  icon: string;
  orderIndex: number;
  active: boolean;
}

export interface MenuCategoryRequest {
  slug: string;
  label: string;
  icon: string;
  orderIndex: number;
  active: boolean;
}
