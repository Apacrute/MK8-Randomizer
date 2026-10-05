// src/data/prixes.ts
// A "prix" (cup) is a group of 4 tracks. MK8 Deluxe has 24 cups total:
// 12 base game + 12 Booster Course Pass.
// `tracks` are map ids from maps.ts, in the order the cup plays them.

export type PrixCategory = 'base' | 'dlc'

export interface PrixItem {
  id: string
  name: string
  image: string       // cup emblem
  emblem: string      // emoji fallback if the image fails to load
  color: string       // accent colour for the card
  category: PrixCategory
  tracks: [string, string, string, string]
}

const BASE = 'images/Cups/Non-DLC/'
const DLC = 'images/Cups/DLC/60px-MK8D_BCP_'

export const PRIXES: PrixItem[] = [
  // ── Base game ──
  { id: "mushroom", name: "Mushroom Cup", image: BASE + "MK8_MushroomCup.png", emblem: "🍄", color: "#e8001c", category: "base",
    tracks: ["Mario_Kart_Stadium", "Water_Park", "Sweet_Sweet_Canyon", "Thwomp_Ruins"] },
  { id: "flower", name: "Flower Cup", image: BASE + "MK8_FlowerCup.png", emblem: "🌼", color: "#ff8c1a", category: "base",
    tracks: ["Mario_Circuit", "Toad_Harbor", "Twisted_Mansion", "Shy_Guy_Falls"] },
  { id: "star", name: "Star Cup", image: BASE + "MK8_Star_Cup_Emblem.png", emblem: "⭐", color: "#ffd700", category: "base",
    tracks: ["Sunshine_Airport", "Dolphin_Shoals", "Electrodrome", "Mount_Wario"] },
  { id: "special", name: "Special Cup", image: BASE + "MK8_Special_Cup_Emblem.png", emblem: "👑", color: "#7b2fff", category: "base",
    tracks: ["Cloudtop_Cruise", "Bone-Dry_Dunes", "Bowsers_Castle", "Rainbow_Road"] },
  { id: "shell", name: "Shell Cup", image: BASE + "MK8_Shell_Cup_Emblem.png", emblem: "🐢", color: "#00a651", category: "base",
    tracks: ["Wii_Moo_Moo_Meadows", "GBA_Mario_Circuit", "DS_Cheep_Cheep_Beach", "N64_Toads_Turnpike"] },
  { id: "banana", name: "Banana Cup", image: BASE + "MK8_Banana_Cup_Emblem.png", emblem: "🍌", color: "#f2c700", category: "base",
    tracks: ["GCN_Dry_Dry_Desert", "SNES_Donut_Plains_3", "N64_Royal_Raceway", "3DS_DK_Jungle"] },
  { id: "leaf", name: "Leaf Cup", image: BASE + "MK8_Leaf_Cup_Emblem.png", emblem: "🍃", color: "#3fae3f", category: "base",
    tracks: ["DS_Wario_Stadium", "GCN_Sherbet_Land", "3DS Music Park", "N64_Yoshi_Valley"] },
  { id: "lightning", name: "Lightning Cup", image: BASE + "MK8_Lightning_Cup_Emblem.png", emblem: "⚡", color: "#ffb300", category: "base",
    tracks: ["DS_Tick-Tock_Clock", "3DS_Piranha_Plant_Slide", "Wii_Grumble_Volcano", "N64_Rainbow_Road"] },
  { id: "egg", name: "Egg Cup", image: BASE + "MK8_Egg_Cup_Emblem.png", emblem: "🥚", color: "#3fbf7f", category: "base",
    tracks: ["GCN_Yoshi_Circuit", "Excite_Bike_Arena", "Dragon_Driftway", "Mute_City"] },
  { id: "triforce", name: "Triforce Cup", image: BASE + "MK8_Triforce_Cup_Emblem.png", emblem: "🔺", color: "#d4af37", category: "base",
    tracks: ["Wii_Warios_Goldmine", "SNES_Rainbow_Road", "Ice_Ice_Outpost", "Hyrule_Circuit"] },
  { id: "crossing", name: "Crossing Cup", image: BASE + "MK8_Crossing_Cup_Emblem.png", emblem: "🍂", color: "#5bb85b", category: "base",
    tracks: ["GCNBaby_Park", "GBA_Cheese_Land", "Wild_Woods", "Animal_Crossing"] },
  { id: "bell", name: "Bell Cup", image: BASE + "MK8_Bell_Cup_Emblem.png", emblem: "🔔", color: "#ffcc33", category: "base",
    tracks: ["3DS_Neo_Bowser_City", "GBA_Ribbon_Road", "Super_Bell_Subway", "Big_Blue"] },

  // ── Booster Course Pass ──
  { id: "golden-dash", name: "Golden Dash Cup", image: DLC + "Golden_Dash_Emblem.png", emblem: "💨", color: "#e8b923", category: "dlc",
    tracks: ["paris-promenade", "toad-circuit", "choco-mountain", "coconut-mall"] },
  { id: "lucky-cat", name: "Lucky Cat Cup", image: DLC + "Lucky_Cat_Emblem.png", emblem: "🐱", color: "#ff9e44", category: "dlc",
    tracks: ["tokyo-blur", "shroom-ridge", "sky-garden", "ninja-hideaway"] },
  { id: "turnip", name: "Turnip Cup", image: DLC + "Turnip_Emblem.png", emblem: "🥬", color: "#9acd32", category: "dlc",
    tracks: ["new-york-minute", "mario-circuit-3", "kalimari-desert", "waluigi-pinball"] },
  { id: "propeller", name: "Propeller Cup", image: DLC + "Propeller_Emblem.png", emblem: "🚁", color: "#33aaff", category: "dlc",
    tracks: ["sydney-sprint", "snow-land", "mushroom-gorge", "sky-high-sundae"] },
  { id: "rock", name: "Rock Cup", image: DLC + "Rock_Emblem.png", emblem: "🪨", color: "#9e8877", category: "dlc",
    tracks: ["london-loop", "boo-lake", "rock-rock-mountain", "maple-treeway"] },
  { id: "moon", name: "Moon Cup", image: DLC + "Moon_Emblem.png", emblem: "🌙", color: "#b0a8ff", category: "dlc",
    tracks: ["berlin-byways", "peach-gardens", "merry-mountain", "rainbow-road-dlc"] },
  { id: "fruit", name: "Fruit Cup", image: DLC + "Fruit_Emblem.png", emblem: "🍓", color: "#ff5a7a", category: "dlc",
    tracks: ["amsterdam-drift", "riverside-park", "dk-summit", "yoshis-island"] },
  { id: "boomerang", name: "Boomerang Cup", image: DLC + "Boomerang_Emblem.png", emblem: "🪃", color: "#ff7733", category: "dlc",
    tracks: ["bangkok-rush", "mario-circuit-dlc", "waluigi-stadium", "singapore-speedway"] },
  { id: "feather", name: "Feather Cup", image: DLC + "Feather_Emblem.png", emblem: "🪶", color: "#66d9d9", category: "dlc",
    tracks: ["athens-dash", "daisy-cruiser", "moonview-highway", "squeaky-clean-sprint"] },
  { id: "cherry", name: "Cherry Cup", image: DLC + "Cherry_Emblem.png", emblem: "🍒", color: "#e8003c", category: "dlc",
    tracks: ["los-angeles-laps", "sunset-wilds", "koopa-cape", "vancouver-velocity"] },
  { id: "acorn", name: "Acorn Cup", image: DLC + "Acorn_Emblem.png", emblem: "🌰", color: "#b5651d", category: "dlc",
    tracks: ["rome-avanti", "dk-mountain", "daisy-circuit", "piranha-plant-cove"] },
  { id: "spiny", name: "Spiny Cup", image: DLC + "Spiny_Emblem.png", emblem: "🔵", color: "#1f6feb", category: "dlc",
    tracks: ["madrid-drive", "rosalinas-ice-world", "bowsers-castle-3", "rainbow-road-wii"] },
]
