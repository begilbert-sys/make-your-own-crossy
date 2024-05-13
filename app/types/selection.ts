import { Coordinates } from '@/app/types/coordinates';
import { Direction } from '@/app/types/board';

export interface Selection {
    coordinates: Coordinates,
    direction: Direction,
    focus: boolean
}
