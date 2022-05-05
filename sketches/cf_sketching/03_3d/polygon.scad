sides = 5;
length = 15;
interior_angle = (sides - 2) * 180 / sides;
adjacent = length * .5;
opposite = tan(interior_angle * .5) * adjacent;



for (i = [0:sides-1]) {
    rotate([0, 0, 360 / sides * i])
     translate([0, opposite, 0])
      translate([-length*.5, 0, 0])
       cube([length, 1, 1]);
}