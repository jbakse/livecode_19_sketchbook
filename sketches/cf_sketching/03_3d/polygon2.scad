sides = 3;
length = 10;

apothem = length / (2 * tan(180/sides));

echo(apothem);

for (i = [0:sides-1]) {
    rotate([0, 0, 360 / sides * i])
     translate([0, apothem, 0])
      translate([-length*.5, 0, 0])
       cube([length, 1, 1]);
}