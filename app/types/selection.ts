import { Coordinates } from '@/app/types/coordinate';
import { Direction } from '@/app/types/board';

export interface Selection {
    coordinates: Coordinates,
    direction: Direction,
    focus: boolean
}
