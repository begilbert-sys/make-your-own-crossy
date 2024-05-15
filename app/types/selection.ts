import { Coordinates } from '@/app/types/coordinates';
import { Direction } from '@/app/types/crossy';

export interface Selection {
    coordinates: Coordinates,
    direction: Direction,
    focus: boolean
}
