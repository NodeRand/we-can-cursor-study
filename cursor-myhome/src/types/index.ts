export interface WeatherData {
    temperature: number;
    description: string;
    icon: string;
}

export interface TodoItem {
    id: string;
    content: string;
    completed: boolean;
    createdAt: Date;
}
