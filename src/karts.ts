// src/data/karts.ts
import { GameItem } from "./types"

import Roadster from "./Images/Karts/300SLRoadster_MK8.png"
import Badwagon from "./Images/Karts/BiddybuggyBodyMK8.png"
import BiddyBuggy from "./Images/Karts/BiddybuggyBodyMK8.png"
import CatCruiser from "./Images/Karts/CatCruiserBodyMK8.png"
import CircuitSpecial from "./Images/Karts/CircuitSpecialBodyMK8.png"
import Comet from "./Images/Karts/CometBodyMK8.png"
import FlameRider from "./Images/Karts/FlameRiderBodyMK8.png"
import GLA from "./Images/Karts/GLA-MK8.png"
import GoldStandard from "./Images/Karts/Gold_Standard.png"
import JetBike from "./Images/Karts/JetBikeBodyMK8.png"
import Landship from "./Images/Karts/LandshipBodyMK8.png"
import Mach8Body from "./Images/Karts/Mach8BodyMK8.png"
import PipeFrame from "./Images/Karts/MK8_Icon_Pipe_Frame_Mario.png"
import CityTripper from "./Images/Karts/MK8_Light-Green_City_Tripper.png"
import TanookiBuggySprite from "./Images/Karts/MK8_Tanooki_Buggy_Sprite.png"
import BlueFalcon from "./Images/Karts/MK8BlueFalcon.png"
import BoneRattler from "./Images/Karts/MK8BoneRattler.png"
import MasterCycle from "./Images/Karts/MK8MasterCycle.png"
import PWing from "./Images/Karts/MK8PWing.png"
import Streetle from "./Images/Karts/MK8Streetle.png"
import MrScooty from "./Images/Karts/MrScootyBodyMK8.png"
import Prancer from "./Images/Karts/PrancerBodyMK8.png"
import Sneaker from"./Images/Karts/SneakerBodyMK8.png"
import SportBike from "./Images/Karts/SportBikeBodyMK8.png"
import SportsCoupe from "./Images/Karts/SportsCoupeMK8.png"
import StandardATV from "./Images/Karts/StandardATVBodyMK8.png"
import StandardBike from "./Images/Karts/StandardBikeBodyMK8.png"
import StandardKart from "./Images/Karts/StandardKartBodyMK8.png"
import SteelDriver from "./Images/Karts/Steel_Driver.png"
import TeddyBuggy from "./Images/Karts/TeddyBuggyBodyMK8.png"
import TheDuke from "./Images/Karts/TheDukeBodyMK8.png"
import Trispeeder from "./Images/Karts/TrispeederBodyMK8.png"
import Varmint from "./Images/Karts/VarmintBodyMK8.png"
import SilverArrow from "./Images/Karts/W25SilverArrow-MK8.png"
import WildWiggler from "./Images/Karts/WildWigglerBodyMK8.png"
import YoshiBike from "./Images/Karts/YoshiBikeBodyMK8.png"
import ZeldaDasher from "./Images/Karts/ZeldaMK8Bdasher.png"


export const KARTS: GameItem[] = [
    { id: "300SLRoadster_MK8", name: "300SL Roadster", image: Roadster },
    { id: "BadwagonBodyMK8", name: "Badwagon", image:  Badwagon},
    { id: "BiddybuggyBodyMK8", name: "Biddy Buggy", image:  BiddyBuggy},
    { id: "CatCruiserBodyMK8", name: "Cat Cruiser", image:  CatCruiser},
    { id: "CircuitSpecialBodyMK8", name: "Circuit Special", image:  CircuitSpecial},
    { id: "CometBodyMK8", name: "Comet", image:  Comet},
    { id: "FlameRiderBodyMK8", name: "Flame Rider", image: FlameRider},
    { id: "GLA-MK8", name: "GLA", image:  GLA},
    { id: "Gold_Standard", name: "Gold Standard", image: GoldStandard  },
    { id: "JetBikeBodyMK8", name: "Jet Bike", image:  JetBike},
    { id: "LandshipBodyMK8", name: "Landship", image:  Landship},
    { id: "Mach8BodyMK8", name: "Mach 8 Body", image:  Mach8Body},
    { id: "MK8_Icon_Pipe_Frame_Mario", name: "Pipe Frame", image: PipeFrame },
    { id: "MK8_Light-Green_City_Tripper", name: "City Tripper", image:  CityTripper},
    { id: "MK8_Tanooki_Buggy_Sprite", name: "Tanooki Buggy Sprite", image: TanookiBuggySprite },
    { id: "MK8BlueFalcon", name: "Blue Falcon", image:  BlueFalcon},
    { id: "MK8BoneRattler", name: "Bone Rattler", image:  BoneRattler},
    { id: "MK8MasterCycle", name: "Master Cycle", image:  MasterCycle},
    { id: "MK8PWing", name: "PWing", image:  PWing},
    { id: "MK8Streetle", name: "Streetle", image:  Streetle},
    { id: "MrScootyBodyMK8", name: "Mr Scooty", image:  MrScooty},
    { id: "PrancerBodyMK8", name: "Prancer", image:  Prancer},
    { id: "SneakerBodyMK8", name: "Sneaker", image:  Sneaker},
    { id: "SportBikeBodyMK8", name: "Sport Bike", image:  SportBike},
    { id: "SportsCoupeMK8", name: "Sports Coupe", image:  SportsCoupe},
    { id: "StandardATVBodyMK8", name: "Standard ATV", image:  StandardATV},
    { id: "StandardBikeBodyMK8", name: "Standard Bike", image:  StandardBike},
    { id: "StandardKartBodyMK8", name: "Standard Kart", image:  StandardKart},
    { id: "Steel_Driver", name: "Steel Driver", image:  SteelDriver},
    { id: "TeddyBuggyBodyMK8", name: "Teddy Buggy", image:  TeddyBuggy},
    { id: "TheDukeBodyMK8", name: "The Duke", image:  TheDuke},
    { id: "TrispeederBodyMK8", name: "Trispeeder", image:  Trispeeder},
    { id: "VarmintBodyMK8", name: "Varmint", image:  Varmint},
    { id: "W25SilverArrow-MK8", name: "Silver Arrow", image:  SilverArrow},
    { id: "WildWigglerBodyMK8", name: "Wild Wiggler", image:  WildWiggler},
    { id: "YoshiBikeBodyMK8", name: "Yoshi Bike", image:  YoshiBike},
    { id: "ZeldaMK8Bdasher", name: "Zelda Dasher", image:  ZeldaDasher},

]
