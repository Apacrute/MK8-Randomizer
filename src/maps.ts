// src/data/maps.ts
import { GameItem, MapCategory } from "./types"

import MusicPark  from "./Images/maps/Non_DLC/3DS Music Park.jpg"
import DKJungle from "./Images/maps/Non_DLC/3DS_DK_Jungle.jpg"
import Neo_Bowser_City from "./Images/maps/Non_DLC/3DS_Neo_Bowser_City.jpg"
import Piranha_Plant_Slide from "./Images/maps/Non_DLC/3DS_Piranha_Plant_Slide.jpg"
import Animal_Crossing from "./Images/maps/Non_DLC/Animal_Crossing.jpg"
import Big_Blue from "./Images/maps/Non_DLC/Big_Blue.jpg"
import BoneDry_Dunes from "./Images/maps/Non_DLC/Bone-Dry_Dunes.jpg"
import Bowsers_Castle from "./Images/maps/Non_DLC/Bowsers_Castle.jpg"
import Cloudtop_Cruise from "./Images/maps/Non_DLC/Cloudtop_Cruise.jpg"
import Dolphin_Shoals from "./Images/maps/Non_DLC/Dolphin_Shoals.jpg"
import Dragon_Driftway from "./Images/maps/Non_DLC/Dragon_Driftway.jpg"
import Cheep_Cheep_Beach from "./Images/maps/Non_DLC/DS_Cheep_Cheep_Beach.jpg"
import TickTock_Clock from "./Images/maps/Non_DLC/DS_Tick-Tock_Clock.jpg"
import Wario_Stadium from "./Images/maps/Non_DLC/DS_Wario_Stadium.jpg"
import Electrodrome from "./Images/maps/Non_DLC/Electrodrome.jpg"
import Excite_Bike_Arena from "./Images/maps/Non_DLC/Excite_Bike_Arena.jpg"
import Cheese_Land from "./Images/maps/Non_DLC/GBA_Cheese_Land.jpg"
import Mario_Circuit from "./Images/maps/Non_DLC/GBA_Mario_Circuit.jpg"
import Ribbon_Road from "./Images/maps/Non_DLC/GBA_Ribbon_Road.jpg"
import Dry_Dry_Desert from "./Images/maps/Non_DLC/GCN_Dry_Dry_Desert.jpg"
import Sherbet_Land from "./Images/maps/Non_DLC/GCN_Sherbet_Land.jpg"
import Yoshi_Circuit from "./Images/maps/Non_DLC/GCN_Yoshi_Circuit.jpg"
import Baby_Park from "./Images/maps/Non_DLC/GCNBaby_Park.jpg"
import HyruleCircuit from "./Images/maps/Non_DLC/Hyrule Circuit.jpg"
import IceIceOutpost from "./Images/maps/Non_DLC/Ice_Ice_Outpost.jpg"
import MarioCircuit from "./Images/maps/Non_DLC/Mario_Circuit.jpg"
import MarioKartStadium from "./Images/maps/Non_DLC/Mario_Kart_Stadium.jpg"
import MountWario from "./Images/maps/Non_DLC/Mount_Wario.jpg"
import MuteCity from "./Images/maps/Non_DLC/Mute_City.jpg"
import N64Rainbow_Road from "./Images/maps/Non_DLC/N64_Rainbow_Road.jpg"
import Royal_Raceway from "./Images/maps/Non_DLC/N64_Royal_Raceway.jpg"
import Toads_Turnpike from "./Images/maps/Non_DLC/N64_Toads_Turnpike.jpg"
import Yoshi_Valley from "./Images/maps/Non_DLC/N64_Yoshi_Valley.jpg"
import Rainbow_Road from "./Images/maps/Non_DLC/Rainbow_Road.jpg"
import Shy_Guy_Falls from "./Images/maps/Non_DLC/Shy_Guy_Falls.jpg"
import Donut_Plains_3 from "./Images/maps/Non_DLC/SNES_Donut_Plains_3.jpg"
import SNESRainbow_Road from "./Images/maps/Non_DLC/SNES_Rainbow_Road.jpg"
import Sunshine_Airport from "./Images/maps/Non_DLC/Sunshine_Airport.jpg"
import Super_Bell_Subway from "./Images/maps/Non_DLC/Super_Bell_Subway.jpg"
import Sweet_Sweet_Canyon from "./Images/maps/Non_DLC/Sweet_Sweet_Canyon.jpg"
import Thwomp_Ruins from "./Images/maps/Non_DLC/Thwomp_Ruins.jpg"
import Toad_Harbor from "./Images/maps/Non_DLC/Toad_Harbor.jpg"
import Twisted_Mansion from "./Images/maps/Non_DLC/Twisted_Mansion.jpg"
import Water_Park from "./Images/maps/Non_DLC/Water_Park.jpg"
import GrumbleVolcano from "./Images/maps/Non_DLC/Wii Grumble Volcano.jpg"
import Moo_Moo_Meadows from "./Images/maps/Non_DLC/Wii_Moo_Moo_Meadows.jpg"
import Warios_Goldmine from "./Images/maps/Non_DLC/Wii_Warios_Goldmine.jpg"
import Wild_Woods from "./Images/maps/Non_DLC/Wild_Woods.jpg"
import amsterdamdrift from "./Images/maps/DLC/amsterdam-drift.jpg"
import athensdash from "./Images/maps/DLC/athens-dash.jpg"
import bangkokrush from "./Images/maps/DLC/bangkok-rush.jpg"
import berlinbyways from "./Images/maps/DLC/berlin-byways.jpg"
import boolake from "./Images/maps/DLC/boo-lake.jpg"
import bowserscastle3 from "./Images/maps/DLC/bowsers-castle-3.jpg"
import chocomountain from "./Images/maps/DLC/choco-mountain.jpg"
import coconutmall from "./Images/maps/DLC/coconut-mall.jpg"
import daisycircuit from "./Images/maps/DLC/daisy-circuit.jpg"
import daisycruiser from "./Images/maps/DLC/daisy-cruiser.jpg"
import dkmountain from "./Images/maps/DLC/dk-mountain.jpg"
import dksummit from "./Images/maps/DLC/dk-summit.jpg"
import kalimaridesert from "./Images/maps/DLC/kalimari-desert.jpg"
import koopacape from "./Images/maps/DLC/koopa-cape.jpg"
import londonloop from "./Images/maps/DLC/london-loop.jpg"
import losangeleslaps from "./Images/maps/DLC/los-angeles-laps.jpg"
import madriddrive from "./Images/maps/DLC/madrid-drive.jpg"
import mapletreeway from "./Images/maps/DLC/maple-treeway.jpg"
import mariocircuit from "./Images/maps/DLC/mario-circuit.jpg"
import mariocircuit3 from "./Images/maps/DLC/mario-circuit-3.jpg"
import merrymountain from "./Images/maps/DLC/merry-mountain.jpg"
import moonviewhighway from "./Images/maps/DLC/moonview-highway.jpg"
import mushroomgorge from "./Images/maps/DLC/mushroom-gorge.jpg"
import newyorkminute from "./Images/maps/DLC/new-york-minute.jpg"
import ninjahideaway from "./Images/maps/DLC/ninja-hideaway.jpg"
import parispromenade from "./Images/maps/DLC/paris-promenade.jpg"
import peachgardens from "./Images/maps/DLC/peach-gardens.jpg"
import piranhaplantcove from "./Images/maps/DLC/piranha-plant-cove.jpg"
import rainbowroad from "./Images/maps/DLC/rainbow-road.jpg"
import rainbowroadwii from "./Images/maps/DLC/rainbow-road-wii.jpg"
import riversidepark from "./Images/maps/DLC/riverside-park.jpg"
import rockrockmountain from "./Images/maps/DLC/rock-rock-mountain.jpg"
import romeavanti from "./Images/maps/DLC/rome-avanti.jpg"
import rosalinasiceworld from "./Images/maps/DLC/rosalinas-ice-world.jpg"
import shroomridge from "./Images/maps/DLC/shroom-ridge.jpg"
import singaporespeedway from "./Images/maps/DLC/singapore-speedway.jpg"
import skygarden from "./Images/maps/DLC/sky-garden.jpg"
import skyhighsundae from "./Images/maps/DLC/sky-high-sundae.jpg"
import snowland from "./Images/maps/DLC/snow-land.jpg"
import squeakycleansprint from "./Images/maps/DLC/squeaky-clean-sprint.jpg"
import sunsetwilds from "./Images/maps/DLC/sunset-wilds.jpg"
import sydneysprint from "./Images/maps/DLC/sydney-sprint.jpg"
import toadcircuit from "./Images/maps/DLC/toad-circuit.jpg"
import tokyoblur from "./Images/maps/DLC/tokyo-blur.jpg"
import vancouvervelocity from "./Images/maps/DLC/vancouver-velocity.jpg"
import waluigipinball from "./Images/maps/DLC/waluigi-pinball.jpg"
import waluigistadium from "./Images/maps/DLC/waluigi-stadium.jpg"
import yoshisisland from "./Images/maps/DLC/yoshis-island.jpg"

export interface MapItem extends GameItem {
    category: MapCategory
}

export const MAPS: MapItem[] = [
    { id: "3DS Music Park", name: "Music Park", image: MusicPark, category: "standard" },
    { id: "3DS_DK_Jungle", name: "DK Jungle", image: DKJungle, category: "standard" },
    { id: "3DS_Neo_Bowser_City", name: "Neo Bowser City", image: Neo_Bowser_City, category: "standard" },
    { id: "3DS_Piranha_Plant_Slide", name: "Piranha Plant Slide", image: Piranha_Plant_Slide, category: "standard" },
    { id: "Animal_Crossing", name: "Animal Crossing", image: Animal_Crossing, category: "standard" },
    { id: "Big_Blue", name: "Big Blue", image: Big_Blue, category: "standard" },
    { id: "Bone-Dry_Dunes", name: "Bone Dry Dunes", image: BoneDry_Dunes, category: "standard" },
    { id: "Bowsers_Castle", name: "Bowsers Castle", image: Bowsers_Castle, category: "standard" },
    { id: "Cloudtop_Cruise", name: "Cloudtop Cruise", image: Cloudtop_Cruise, category: "standard" },
    { id: "Dolphin_Shoals", name: "Dolphin Shoals", image: Dolphin_Shoals, category: "standard" },
    { id: "Dragon_Driftway", name: "Dragon Driftway", image: Dragon_Driftway, category: "standard" },
    { id: "DS_Cheep_Cheep_Beach", name: "Cheep Cheep Beach", image: Cheep_Cheep_Beach, category: "standard" },
    { id: "DS_Tick-Tock_Clock", name: "Tick Tock Clock", image: TickTock_Clock, category: "standard" },
    { id: "DS_Wario_Stadium", name: "Wario Stadium", image: Wario_Stadium, category: "standard" },
    { id: "Electrodrome", name: "Electrodrome", image: Electrodrome, category: "standard" },
    { id: "Excite_Bike_Arena", name: "Excite Bike Arena", image: Excite_Bike_Arena, category: "standard" },
    { id: "GBA_Cheese_Land", name: "Cheese Land", image: Cheese_Land, category: "standard" },
    { id: "GBA_Mario_Circuit", name: "Mario Circuit", image: MarioCircuit, category: "standard" },
    { id: "GBA_Ribbon_Road", name: "Ribbon Road", image: Ribbon_Road, category: "standard" },
    { id: "GCN_Dry_Dry_Desert", name: "Dry Dry Desert", image: Dry_Dry_Desert, category: "standard" },
    { id: "GCN_Sherbet_Land", name: "Sherbet Land", image: Sherbet_Land, category: "standard" },
    { id: "GCN_Yoshi_Circuit", name: "Yoshi Circuit", image: Yoshi_Circuit, category: "standard" },
    { id: "GCNBaby_Park", name: "Baby Park", image: Baby_Park, category: "standard" },
    { id: "Hyrule Circuit", name: "Hyrule Circuit", image: HyruleCircuit, category: "standard" },
    { id: "Ice_Ice_Outpost", name: "Ice Ice Outpost", image: IceIceOutpost, category: "standard" },
    { id: "Mario_Circuit", name: "Mario Circuit", image: Mario_Circuit, category: "standard" },
    { id: "Mario_Kart_Stadium", name: "Mario Kart Stadium", image: MarioKartStadium, category: "standard" },
    { id: "Mount_Wario", name: "Mount Wario", image: MountWario, category: "standard" },
    { id: "Mute_City", name: "Mute City", image: MuteCity, category: "standard" },
    { id: "N64_Royal_Raceway", name: "Royal Raceway", image: Royal_Raceway, category: "standard" },
    { id: "N64_Toads_Turnpike", name: "Toads Turnpike", image: Toads_Turnpike, category: "standard" },
    { id: "N64_Yoshi_Valley", name: "Yoshi Valley", image: Yoshi_Valley, category: "standard" },
    { id: "Shy_Guy_Falls", name: "Shy Guy Falls", image: Shy_Guy_Falls, category: "standard" },
    { id: "SNES_Donut_Plains_3", name: "Donut Plains 3", image: Donut_Plains_3, category: "standard" },
    { id: "Sunshine_Airport", name: "Sunshine Airport", image: Sunshine_Airport, category: "standard" },
    { id: "Super_Bell_Subway", name: "Super Bell Subway", image: Super_Bell_Subway, category: "standard" },
    { id: "Sweet_Sweet_Canyon", name: "Sweet Sweet Canyon", image: Sweet_Sweet_Canyon, category: "standard" },
    { id: "Thwomp_Ruins", name: "Thwomp Ruins", image: Thwomp_Ruins, category: "standard" },
    { id: "Toad_Harbor", name: "Toad Harbor", image: Toad_Harbor, category: "standard" },
    { id: "Twisted_Mansion", name: "Twisted Mansion", image: Twisted_Mansion, category: "standard" },
    { id: "Water_Park", name: "Water Park", image: Water_Park, category: "standard" },
    { id: "Wii Grumble Volcano", name: "Grumble Volcano", image: GrumbleVolcano, category: "standard" },
    { id: "Wii_Moo_Moo_Meadows", name: "Moo Moo Meadows", image: Moo_Moo_Meadows, category: "standard" },
    { id: "Wii_Warios_Goldmine", name: "Warios Goldmine", image: Warios_Goldmine, category: "standard" },
    { id: "Wild_Woods", name: "Wild Woods", image: Wild_Woods, category: "standard" },

    { id: "N64_Rainbow_Road", name: "Rainbow Road", image: N64Rainbow_Road, category: "Rainbow Roads" },
    { id: "Rainbow_Road", name: "Rainbow Road", image: Rainbow_Road, category: "Rainbow Roads" },
    { id: "SNES_Rainbow_Road", name: "Rainbow Road", image: SNESRainbow_Road, category: "Rainbow Roads" },
    { id: "rainbow-road", name: "Rainbow Road", image: rainbowroad, category: "Rainbow Roads" },
    { id: "rainbow-road-wii", name: "Rainbow Road", image: rainbowroadwii, category: "Rainbow Roads" },

    { id: "amsterdam-drift", name: "Amsterdam Drift", image: amsterdamdrift, category: "Tours" },
    { id: "athens-dash", name: "Athens Dash", image: athensdash, category: "Tours" },
    { id: "bangkok-rush", name: "Bangkok Rush", image: bangkokrush, category: "Tours" },
    { id: "berlin-byways", name: "Berlin Byways", image: berlinbyways, category: "Tours" },
    { id: "london-loop", name: "London Loop", image: londonloop, category: "Tours" },
    { id: "los-angeles-laps", name: "Los Angeles Laps", image: losangeleslaps, category: "Tours" },
    { id: "madrid-drive", name: "Madrid Drive", image: madriddrive, category: "Tours" },
    { id: "new-york-minute", name: "New York Minute", image: newyorkminute, category: "Tours" },
    { id: "rome-avanti", name: "Rome Avanti", image: romeavanti, category: "Tours" },
    { id: "singapore-speedway", name: "Singapore Speedway", image: singaporespeedway, category: "Tours" },
    { id: "sydney-sprint", name: "Sydney Sprint", image: sydneysprint, category: "Tours" },
    { id: "vancouver-velocity", name: "Vancouver Velocity", image: vancouvervelocity, category: "Tours" },
    { id: "tokyo-blur", name: "Tokyo Blur", image: tokyoblur, category: "Tours" },

    { id: "boo-lake", name: "Boo Lake", image: boolake, category: "dlc" },
    { id: "bowsers-castle-3", name: "Bowsers Castle 3", image: bowserscastle3, category: "dlc" },
    { id: "choco-mountain", name: "Choco Mountain", image: chocomountain, category: "dlc" },
    { id: "coconut_mall", name: "Coconut Mall", image: coconutmall, category: "dlc" },
    { id: "daisy-circuit", name: "Daisy Circuit", image: daisycircuit, category: "dlc" },
    { id: "daisy-cruiser", name: "Daisy Cruiser", image: daisycruiser, category: "dlc" },
    { id: "dk-mountain", name: "DK Mountain", image: dkmountain, category: "dlc" },
    { id: "dk-summit", name: "DK Summit", image: dksummit, category: "dlc" },
    { id: "kalimari-desert", name: "Kalimari Desert", image: kalimaridesert, category: "dlc" },
    { id: "koopa-cape", name: "Koopa Cape", image: koopacape, category: "dlc" },
    { id: "maple-treeway", name: "Maple Treeway", image: mapletreeway, category: "dlc" },
    { id: "mario-circuit", name: "Mario Circuit", image: mariocircuit, category: "dlc" },
    { id: "mario-circuit-3", name: "Mario Circuit 3", image: mariocircuit3, category: "dlc" },
    { id: "merry-mountain", name: "Merry Mountain", image: merrymountain, category: "dlc" },
    { id: "moonview-highway", name: "Moonview Highway", image: moonviewhighway, category: "dlc" },
    { id: "mushroom-gorge", name: "Mushroom Gorge", image: mushroomgorge, category: "dlc" },
    { id: "ninja-hideaway", name: "Ninja Hideaway", image: ninjahideaway, category: "dlc" },
    { id: "paris-promenade", name: "Paris Promenade", image: parispromenade, category: "dlc" },
    { id: "peach-gardens", name: "Peach Gardens", image: peachgardens, category: "dlc" },
    { id: "piranha-plant-cove", name: "Piranha Plant Cove", image: piranhaplantcove, category: "dlc" },
    { id: "riverside-park", name: "Riverside Park", image: riversidepark, category: "dlc" },
    { id: "rock-rock-mountain", name: "Rock Rock Mountain", image: rockrockmountain, category: "dlc" },
    { id: "rosalinas-ice-world", name: "Rosalinas Ice World", image: rosalinasiceworld, category: "dlc" },
    { id: "shroom-ridge", name: "Shroom Ridge", image: shroomridge, category: "dlc" },
    { id: "sky-garden", name: "Sky Garden", image: skygarden, category: "dlc" },
    { id: "sky-high-sundae", name: "Sky High Sundae", image: skyhighsundae, category: "dlc" },
    { id: "snow-land", name: "Snow Land", image: snowland, category: "dlc" },
    { id: "squeaky-clean-sprint", name: "Squeaky Clean Sprint", image: squeakycleansprint, category: "dlc" },
    { id: "sunset-wilds", name: "Sunset Wilds", image: sunsetwilds, category: "dlc" },
    { id: "toad-circuit", name: "Toad Circuit", image: toadcircuit, category: "dlc" },
    { id: "waluigi-pinball", name: "Waluigi Pinball", image: waluigipinball, category: "dlc" },
    { id: "waluigi-stadium", name: "Waluigi Stadium", image: waluigistadium, category: "dlc" },
    { id: "yoshis-island", name: "Yoshis Island", image: yoshisisland, category: "dlc" },

]
