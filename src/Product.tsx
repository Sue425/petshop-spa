export interface DetailedProduct {
    id: number;
    name: string;
    animalCategories: AnimalCategory[];
    price: number;
    description: string;
}

export interface AnimalCategory {
    id: number;
    name: string;
}

export interface BriefProduct {
    id: number;
    name: string;
    price: number;
}