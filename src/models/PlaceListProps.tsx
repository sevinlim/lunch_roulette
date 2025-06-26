import type { Place } from "./Place";

export interface PlaceListProps {
    placeList: Place[]
    setPlaceList: (_placeList: Place[]) => void
}