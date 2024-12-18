part b solution works, but takes too long.
algo complexity is to high!

i'm not sure how to reduce the complexity

but i think we can reduce the search space

1. [done] stop any path that goes over cost
2. [done] get best price
3. calculate the cost of all squares FROM TARGET OUT, (reverse)
   black out any squares that over cost
   this should leave all best paths open and a fair bit of squares near target
   VISUALIZE
4. do the smae thing FROM START OUT
   black out any squares over cost
   this should leave the best paths open
   it would leave a lot of squares open near the start, but they are closed from previous step
   VISUALIZe
5. run the working existing but slow solution on this now much smaller problem

oh wait...

Actually. If the walk() gets to any xyfacing that could be gotten more cheaply then it’s off the path and can return. I think search already leaves that behind as a byproduct!

oh wait...

actually, can we just walk backwards from the end to the start following using the data in visited. only following the the squares that lead to the current square and tie for best price.
