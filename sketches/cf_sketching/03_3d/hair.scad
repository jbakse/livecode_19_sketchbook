
color("black")
    difference() {
        scale([1, .5, 1])
            sphere(r = 12);
        translate([0, 0, - 10])
            rotate([90,0,0])
                cylinder(h = 20, r = 10, center = true);
    }

# sphere(r = 10);
