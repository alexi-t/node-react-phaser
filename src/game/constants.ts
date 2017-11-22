export interface Color {
    r: number;
    g: number;
    b: number;
}

export interface TerrainType {
    shortcut: string;
    color: Color;
}

export let Colors: { [key: string]: Color } = {
    water: {
        r: 66,
        g: 173,
        b: 244
    },
    sand: {
        r: 244,
        g: 229,
        b: 66
    },
    grass: {
        r: 110,
        g: 183,
        b: 71
    },
    swamp: {
        r: 87,
        g: 168,
        b: 126
    },
    ice: {
        r: 155,
        g: 250,
        b: 255
    }
};
export let TerrainTypes: { [key: string]: TerrainType } = {
    sand: {
        shortcut: 's',
        color: Colors.sand
    },
    grass: {
        shortcut: 'g',
        color: Colors.grass
    },
    water: {
        shortcut: 'w',
        color: Colors.water
    },
    swamp: {
        shortcut: 'm',
        color: Colors.swamp
    },
    ice: {
        shortcut: 'i',
        color: Colors.ice
    }
};
export const TextureSize: number = 128;