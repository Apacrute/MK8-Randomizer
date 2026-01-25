// src/data/modes.ts
import { GameItem } from "./types"

import FiftyCC from "./Images/Engine_Class/120px-50cc_MK8.png"
import HundredCC from "./Images/Engine_Class/120px-100cc_MK8.png"
import HundredFiftyCC from "./Images/Engine_Class/120px-150cc_MK8.png"
import MirrorCC from "./Images/Engine_Class/120px-Mirror-MK8.png"
import TwoHundredCC from "./Images/Engine_Class/120px-200cc_MK8.png"


export const MODES: GameItem[] = [
    { id: 1, name: "50 cc", image: FiftyCC },
    { id: 2, name: "100 cc", image: HundredCC },
    { id: 3, name: "150 cc", image: HundredFiftyCC },
    { id: 4, name: "Mirror", image: MirrorCC },
    { id: 5, name: "200 cc", image: TwoHundredCC },

]