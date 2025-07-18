export interface WeatherData {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    name: string;
    sys: {
        country: string;
    };
}

export interface TodoItem {
    id: string;
    content: string;
    completed: boolean;
    createdAt: Date;
}
