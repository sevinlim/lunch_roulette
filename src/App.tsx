// import { useState } from 'react'
import { useState } from 'react';
import './App.css';
import PlaceList from './components/PlaceList';
import Roulette from './components/Roulette';
import { useLocalStorage } from './hooks/LocalStorageHook';
import type { Place } from './models/Place';

function App() {

  function randomizeRouletteSectors(_placeList: Place[]): Place[] {
    // perform randomization on wedges
    let placeList = _placeList?.reduce((_arr, _place) => {
      _arr.push(...Array(_place.count).fill(_place))
      return _arr
    }, [] as Place[]);
    let sectors: Place[] = [];
    while (placeList.length > 0) {
      let popIndex = Math.round(Math.random() * placeList.length)
      sectors.push(...placeList.splice(popIndex, 1))
    }
    return sectors;
  }

  function setRouelettePlaces(_placeList: Place[]) {
    setPlaceList(_placeList)
    storedPlaces.setItem(_placeList);
    setRouletteList(randomizeRouletteSectors(_placeList));
  }

  let storedPlaces = useLocalStorage<Place[]>("roulette_list")
  // let inputSeed = useLocalStorage("roulette_seed")
  const [placeList, setPlaceList] = useState(storedPlaces.getItem()?.filter(_place => {
    return _place.name?.length
  }) ?? []);

  const [rouletteList, setRouletteList] = useState(randomizeRouletteSectors(placeList));



  return (
    <>
      <PlaceList placeList={placeList} setPlaceList={setRouelettePlaces}></PlaceList>
      <Roulette placeList={rouletteList}></Roulette>
    </>
  )
}

export default App
