export type MaxWidth = `${number}px` | `${number}%` | undefined;

export type MinWidth = `${number}px` | `${number}%` | undefined;

export type Border =
    | `${number}px ${'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none'}`
    | `${number}px ${'solid' | 'dashed' | 'dotted'} ${string}`;

export type BackgroundColor =
    | `${'#'}${string}` // Hex color
    | `rgb(${number},${number},${number})`
    | `rgba(${number},${number},${number},${number})`
    | `hsl(${number},${number}%,${number}%)`
    | `hsla(${number},${number}%,${number}%,${number})`
    | 'transparent'
    | 'inherit'
    | string; 
