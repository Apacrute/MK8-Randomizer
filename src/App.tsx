// src/App.tsx
import { useState } from "react"
import { CHARACTERS } from "./data/characters"
import { KARTS } from "./data/karts"
import { TIRES } from "./data/tires"
import { HANGERS } from "./data/hangers"
import { MODES } from "./data/modes"
import { MAPS } from "./data/maps"
// import { ITEMS } from "./data/items"
import { randomItem } from "./random"
import { ResultCard } from "./ResultCard"
import { Selector } from "./Selector"

export default function App() {
  const [randomize, setRandomize] = useState({
    character: false,
    kart: false,
    tire: false,
    hanger: false,
    mode: false,
    map: true,
    standardMaps: true,
    dlcMaps: true,
  })

  const [results, setResults] = useState<any>({})

  function runRandomizer() {
    const filteredMaps = MAPS.filter(m =>
        (randomize.standardMaps && m.category === "standard") ||
        (randomize.dlcMaps && m.category === "dlc")
    )

    setResults({
      character: randomize.character ? randomItem(CHARACTERS) : null,
      kart: randomize.kart ? randomItem(KARTS) : null,
      tire: randomize.tire ? randomItem(TIRES) : null,
      hanger: randomize.hanger ? randomItem(HANGERS) : null,
      mode: randomize.mode ? randomItem(MODES) : null,
      map: randomize.map ? randomItem(filteredMaps) : null,
    })
  }

  return (
      <div>
        <h1>Mario Kart 8 Deluxe Randomizer</h1>

        <h2>Setup</h2>
        <Selector label="Character" checked={randomize.character} onChange={() => setRandomize(s => ({ ...s, character: !s.character }))} />
        <Selector label="Kart" checked={randomize.kart} onChange={() => setRandomize(s => ({ ...s, kart: !s.kart }))} />
        <Selector label="Tire" checked={randomize.tire} onChange={() => setRandomize(s => ({ ...s, tire: !s.tire }))} />
        <Selector label="Hanger" checked={randomize.hanger} onChange={() => setRandomize(s => ({ ...s, hanger: !s.hanger }))} />

        <h2>Mode</h2>
        <Selector label="Randomize Mode" checked={randomize.mode} onChange={() => setRandomize(s => ({ ...s, mode: !s.mode }))} />

        <h2>Map</h2>
        <Selector label="Randomize Map" checked={randomize.map} onChange={() => setRandomize(s => ({ ...s, map: !s.map }))} />
        <Selector label="Standard Maps" checked={randomize.standardMaps} onChange={() => setRandomize(s => ({ ...s, standardMaps: !s.standardMaps }))} />
        <Selector label="DLC Maps" checked={randomize.dlcMaps} onChange={() => setRandomize(s => ({ ...s, dlcMaps: !s.dlcMaps }))} />

        <button onClick={runRandomizer}>Randomize</button>

        <h2>Results</h2>
        {Object.values(results).map((item: any) =>
            item ? <ResultCard key={item.id} item={item} /> : null
        )}
      </div>
  )
}
