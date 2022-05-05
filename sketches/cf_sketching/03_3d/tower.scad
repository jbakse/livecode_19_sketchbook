// hi

module arch(height) {
    difference() {
        // main block
        translate([-1.5, -.5, 0]) cube([3,1,height]);

        // block cutout
        translate([-1, -1, -1]) cube([2,2,height-1]);

        // circle cutout
        translate([0,0,height - 2]) 
            rotate([90, 0, 0])
                cylinder(h=2, r = 1, center = true, $fn = 10);
    }
}


for (i=[1:60]) {
    rotate([0,0, i * 20])
     
    translate([0, 10 - i*.1, 0])
        arch(3 + i * .3);
}

