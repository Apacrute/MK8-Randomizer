// src/utils/random.ts
export function randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
}
