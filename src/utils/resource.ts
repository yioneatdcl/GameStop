
export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface Coordinate {
        x: number;
        y: number;
        z: number;
};

export const orbPositions: Coordinate[] = [
    {x: 23.84, y: 0.88, z: 15.73},
    {x: 24.31, y: 0.88, z: 13.02},
    {x: 23.83, y: 0.88, z: 11.31},
    {x: 15.94, y: 0.88, z: 7.98},
    {x: 11.23, y: 0.88, z: 8.25},
    {x: 12.33, y: 0.88, z: 11.38},
    {x: 16.09, y: 0.88, z: 10.77},
    {x: 16.04, y: 0.88, z: 13.18},
    {x: 16.31, y: 0.88, z: 16.06},
    {x: 13.86, y: 0.88, z: 15.43},
    {x: 13.9, y: 0.88, z: 13.39},
    {x: 10.72, y: 0.88, z: 13.28},
    {x: 10.83, y: 0.88, z: 15.46},
    {x: 10.49, y: 0.88, z: 20.69},
    {x: 13.78, y: 0.88, z: 7.26},
    {x: 23.52, y: 0.88, z: 12.55},
    {x: 23.79, y: 0.88, z: 23.64}
]