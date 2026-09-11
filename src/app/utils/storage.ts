export interface ClothingItem {
  id: string;
  photoUrl: string;
  category: string;
  fabric: string;
  primaryColor: string;
  secondaryColor?: string;
  pattern?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export interface Look {
  id: string;
  name: string;
  occasion: string;
  items: string[];
  createdAt: string;
  isFavorite: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  personalStyle: string[];
  joinedAt: string;
}

const STORAGE_KEYS = {
  ITEMS: 'dreamcloset_items',
  LOOKS: 'dreamcloset_looks',
  USER: 'dreamcloset_user',
  AUTH: 'dreamcloset_auth',
};

export const storage = {
  getItems(): ClothingItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return data ? JSON.parse(data) : [];
  },

  saveItems(items: ClothingItem[]): void {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  addItem(item: Omit<ClothingItem, 'id' | 'createdAt'>): ClothingItem {
    const items = this.getItems();
    const newItem: ClothingItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  },

  updateItem(id: string, updates: Partial<ClothingItem>): void {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveItems(items);
    }
  },

  deleteItem(id: string): void {
    const items = this.getItems().filter(item => item.id !== id);
    this.saveItems(items);
  },

  getLooks(): Look[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOOKS);
    return data ? JSON.parse(data) : [];
  },

  saveLooks(looks: Look[]): void {
    localStorage.setItem(STORAGE_KEYS.LOOKS, JSON.stringify(looks));
  },

  addLook(look: Omit<Look, 'id' | 'createdAt'>): Look {
    const looks = this.getLooks();
    const newLook: Look = {
      ...look,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    looks.push(newLook);
    this.saveLooks(looks);
    return newLook;
  },

  updateLook(id: string, updates: Partial<Look>): void {
    const looks = this.getLooks();
    const index = looks.findIndex(look => look.id === id);
    if (index !== -1) {
      looks[index] = { ...looks[index], ...updates };
      this.saveLooks(looks);
    }
  },

  deleteLook(id: string): void {
    const looks = this.getLooks().filter(look => look.id !== id);
    this.saveLooks(looks);
  },

  getUser(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  setAuthenticated(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.AUTH, value.toString());
  },

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
