// src/components/ResultCard.tsx
import { GameItem } from "../types"
import React from "react";

export function ResultCard({ item }: { item: GameItem }) {
    return (
        <div>
            <h3>{item.name}</h3>
            <img src={item.image} alt={item.name} width={120} />
        </div>
    )
}
