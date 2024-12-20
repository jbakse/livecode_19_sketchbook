How many cheats would save you at least 100 picoseconds?

I don't need to find all the cheats. Just the ones that save at least 100 steps.

No cheat that ends in the first 100 steps can save 100+.
Some of those ~100-120 steps in don't need to search the whole 20 manhattans pace (but that doesn't seem to help too much).

Since two cheats that start and end at the same place cound as the same cheat, the focus here is on manhattan distance.

savings = (toCost - fromCost) - manhattan(fromXY, toXY)

naive:

```
for visited on path
    get all visiteds within manhattan 20
        count++ if (toCost - fromCost) - manhattan(from, to) >= 100

```
