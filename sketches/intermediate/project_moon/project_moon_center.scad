//https://bricks.stackexchange.com/questions/288/what-are-the-dimensions-of-a-lego-brick


L = 1.6; // A lego unit is 1.6mm

// bricks that are exactly the width of the stud pitch (8mm) fit
// to tightly in practice, so bricks are slightly shaved down
// PLAY is _half_ the amount of space between bricks

// TODO implement play (be sure to keep brick centered)
PLAY = .1 / L; 

// divide by L to convert mm to Lego units
// cheats use positive numbers for MORE PLASTIC
// cheats use negative numbers for LESS PLASTIC

PLATE_HEIGHT = 2;
BRICK_HEIGHT = 6;
STUD_HEIGHT = 1.8 / L;
LID_HEIGHT = .5 / L;

CHEAT_HEIGHT = .2 / L;
CHEAT_CEILING = -.5 / L;
CHEAT_STUD_OD_BOTTOM = .2 / L;
CHEAT_STUD_OD_TOP = .3 / L;
CHEAT_ROUND_OD = .1 / L;

$fn = 20;


////////////////////////////////////
// studs

module stud() {
    color("blue")
    translate([0,0, STUD_HEIGHT * .5 ]) // align bottom to 0
        cylinder(
            h = STUD_HEIGHT,
            d1 = 3 + CHEAT_STUD_OD_BOTTOM, 
            d2 = 3 + CHEAT_STUD_OD_TOP , 
            center  = true
        );
}

module stud_hole(){
    translate([0, 0, STUD_HEIGHT * .5]) // align bottom to 0
    scale([1, 1, 1.01]) //overcut
        cylinder(
            h = STUD_HEIGHT , 
            d = 2 , 
            center  = true
        );
}

module tstud() {
    difference()
    {
        stud();
        stud_hole();
    }
}


module sstud() {
    difference()
    {
        tstud();
        // slots
        translate([0, 0, STUD_HEIGHT * .5 ])
        scale([1, 1, 1.01]) //overcut
        {
            cube([10, .25, STUD_HEIGHT], center = true);
            cube([.25, 10, STUD_HEIGHT], center = true);
        }
    }
}


////////////////////////////////////
// antistuds

module antistud(h = 2) {
    $fn = 20;
    ch = h +CHEAT_HEIGHT;
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, -.5 * ch ]) // align top to 0
    difference() {
        cylinder(h = ch, d = 4.07 + CHEAT_ROUND_OD, center  = true);
        cylinder_outer(ch + .01, 1.5, $fn); // account for circle/poly error
    }
}

module santistud(h = 2) {
    ch = h +CHEAT_HEIGHT;
    difference(){
        antistud(h);
        
        translate([2.5, 2.5, 0]) // align center to grid
        translate([0,0, -.5 * ch ]) // align top to 0
        {
            cube([10, .25, ch + .01], center = true);
            cube([.25, 10, ch + .01], center = true);     
        }
    }
}

module roundLid() {
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, LID_HEIGHT * -.5 ]) // align top to 0
    cylinder(h = LID_HEIGHT, d = 4.07 + CHEAT_ROUND_OD , center  = true);
}

module roundTile(h = PLATE_HEIGHT) {
    santistud(h);
    roundLid();
}



////////////////////////////////////
// squares

module wall(w = 1, d = 1, h = 2) {
    cheatHeight = h + CHEAT_HEIGHT;
    difference() {
        // outer
        translate([0, 0, -cheatHeight ]) // align top
        // translate([PLAY, PLAY, 0]) // play
        cube([w * 5, d * 5, cheatHeight ]);
        
        // hollow
        translate([0, 0, -cheatHeight - .02 ]) // align top
        translate([1, 1, .01]) // center
        cube([w * 5 - 2 , d * 5 - 2 , cheatHeight + .02]);
    }
}

module lid(w = 1, d = 1) {
    translate([0, 0, -LID_HEIGHT ]) // align top
    cube([w * 5, d * 5, LID_HEIGHT ]);
}


// module brick(w = 1, d = 1){
//     tile(w, d, BRICK_HEIGHT);
// }

module tile(w = 1, d = 1, h = PLATE_HEIGHT) {
    wall(w, d, h);
    lid(w, d);
}

////////////////////////////////////
// util

module grid(w = 1, d = 1) {
    
    for (row = [0:w-1], col = [0:d-1]) {
        translate([(w - 1) * -2.5, (d - 1) * -2.5, 0]) // center grid
        translate([row * 5, col * 5, 0])   // grid cell
            children();
    }
}

module cylinder_outer(height,radius,fn){
    fudge = 1/cos(180/fn);
    cylinder(h=height,r=radius*fudge,$fn=fn, center = true);
}




////////////////////////////////////
// greebles

module dish(a) {
    translate([0, 0, -.2]) // merge base
    translate([2.5, 2.51, 4 ]) // position
    rotate([a, 0, 0]) // position
    {
        // antenna
        translate([0, 0, -3.5]) cylinder(h = 3.5, r1 = 1, r2= .5, $fn = 20);
        sphere(r = .5, $fn = 20);
        
        // dish
        difference() {
            sphere(d = 8, $fn = 30);
            sphere(d = 7, $fn = 30);
            translate([0, 0, 1.5]) cube([10, 10, 6], center = true);
            translate([0,0,-4]) cube([10, .25, 2.01], center = true);
            translate([0,0,-4]) cube([.25, 10, 2.01], center = true);
        }
    }
}

module dome() {
    // translate([0, 0, -.2035]) // merge base
    translate([2.5, 2.50, 0]) // position
    
    difference(){
    // antenna
   
        sphere(d = 4.07 + CHEAT_ROUND_OD, $fn = 40);
        translate([0, 0, -2]) cube([10, 10, 4], center = true);
       
    }
}

module microCity(seed) {
    
    for (row = [0:4], col = [0:4]) {
        h = floor(rands(0, 4, 1, seed*100+row*10+col)[0]) ;
        translate([row, col, 0]) cube([1, 1, h]);
    }
}

module gazebo(){
    difference() {
        union(){
            intersection() {
                translate([2.5, 2.5, 1.5])
                rotate([90, 0, 0])
                cylinder(d=5, h=5, center= true, $fn=30);

                translate([2.5, 2.5, 1.5])
                rotate([0, 90, 0])
                cylinder(d=5, h=5, center= true, $fn=30);
            }
            cube([5, 5, 1.5]);
        }

       

        translate([2.5, 2.5, 1.5])
        rotate([90, 0, 0])
            cylinder(d = 3, h = 10, center = true, $fn = 20);
       
        translate([2.5, 2.5, 1.5])
        rotate([0, 90, 0])
            cylinder(d = 3, h = 10, center = true, $fn = 20);

        translate([2.5, 2.5, .75])
            cube([3,10,1.5], center = true);
        translate([2.5, 2.5, .75])
            cube([10,3,1.5], center = true);

        translate([0,0,-1.5]) cube([5, 5, 1.5]);
    }
}

module jet() {
    difference() {
        union() {
            cylinder(d1=2, d2 = 3.1, h=1.5, $fn = 20);
            cylinder(d1=2, d2 = 3, h=2, $fn = 20);
        }
       translate([0,0,.1]) cylinder(d1=1, d2 = 2, h=2.01, $fn = 20);
    }
}
module quadJet() {
    translate([1.25, 1.25, 0])jet();
    translate([3.75, 3.75, 0])jet();
    translate([1.25, 3.75, 0])jet();
    translate([3.75, 1.25, 0])jet();
}



module mosEisleyDome() {
    hull() {
        translate([2.5, 2.5, 0])
        linear_extrude(.1)
        square(4, true);

        translate([2.5, 2.5, 2])
        linear_extrude(.1)
        square(3.5, true);
    }

    translate([2.5, 2.5, 1.8])
    sphere(1.6, $fn = 20);

    translate([2.5, 1.5, .75])
    cube([4.2, .8, 1.5], center= true);

    translate([2.5, 3.5, .75])
    cube([4.2, .8, 1.5], center= true);

    translate([1.5, 2.5, .75])
    cube([.8, 4.2, 1.5], center= true);

     translate([3.5, 2.5, .75])
    cube([.8, 4.2, 1.5], center= true);


}

module mosEisleyVat() {
    difference() {
        union() {
            difference() {
                hull() {
                    translate([2.5, 2.5, 0])
                    linear_extrude(.1)
                    square(5, true);

                    translate([2.5, 2.5, 2])
                    linear_extrude(.1)
                    square(4.5, true);
                }

                union() {
                    translate([2.5, 1.5, 3.25])
                    cube([5, .8, 3], center= true);

                    translate([2.5, 3.5, 3.25])
                    cube([5, .8, 3], center= true);

                    translate([1.5, 2.5, 3.25])
                    cube([.8, 5, 3], center= true);

                    translate([3.5, 2.5, 3.25])
                    cube([.8, 5, 3], center= true);
                }
            }


            translate([2.5, 2.5, 0])
            cylinder(d=4, h=2.4, $fn = 20);
        }

        translate([2.5, 2.5, -.01])
        cylinder(d=3, h=4, $fn = 40);
    }
}


module mosEisleyTower() {
    difference() {
        hull() {
            translate([2.5, 2.5, 0])
            linear_extrude(.1)
            square(5, true);

            translate([2.5, 2.5, 8])
            linear_extrude(.1)
            square(3.5, true);
        }
        translate([2.5, 2.5, 5])
        cube([5,5,.2], center = true);
        translate([2.5, 2.5, 2])
        cube([5,5,.2], center = true);

        translate([0, 1.5, 4])
        cube([1,1,1], center = true);

        translate([5, 1.5, 4])
        cube([1,1,1], center = true);

        translate([1.5, 0, 4])
        cube([1,1,1], center = true);

        translate([3.5, 5, 4])
        cube([1,1,1], center = true);

        translate([2.5, 0, 7])
        cube([1,2,4], center = true);

        translate([2.5, 5, 7])
        cube([1,2,4], center = true);
    }
    
    hull() {
        translate([2.5, 2.5, 0])
        linear_extrude(.1)
        square(4.5, true);

        translate([2.5, 2.5, 8])
        linear_extrude(.1)
        square(3, true);
    }
}

module fin() {
  
        hull() {
            translate([2.5, 2.5, 0])
            linear_extrude(.1)
            square([5,5], true);

            
            translate([2.5, 2.5, .6])
            // rotate([0, -5,0])
            linear_extrude(.1)
            square([4, 2], true);
        }

         hull() {
            

            translate([2.5, 2.5, .6])
            // rotate([0, -5,0])
            linear_extrude(.1)
            square([4, 2], true);

            translate([1.5, 2.5, 2.9])
            // rotate([0, -5,0])
            linear_extrude(.1)
            square([4,1], true);
        }

}


module fin2() {
  
        hull() {
            translate([2.5, 2.5, 0])
            linear_extrude(.1)
            square([5,5], true);

            
            translate([2.5, 1.5, .6])
            // rotate([0, -5,0])
            linear_extrude(.1)
            square([4, 2], true);
        }

         hull() {
            

            translate([2.5, 1.5, .6])
            // rotate([0, -5,0])
            linear_extrude(.1)
            square([4, 2], true);

            translate([1.5, .5, 2.9])
            // rotate([0, -5,0])
            linear_extrude(.1)
            square([4,1], true);
        }

}

module bump() {
    translate([0, 0, 1]) {
        
        minkowski() {
            difference() {
                cylinder(d=6, h=3, $fn = 20);
                cube([5,6,10]);
            }
            sphere(.5, $fn = 10);
        }

            minkowski() {
            difference() {
                cylinder(d=4, h=4, $fn = 20);
                rotate([90,0,0]) cube([5,6,10]);
            }
            sphere(.5, $fn = 10);
        }
        
    }
}
module podOval() {
    difference() {
        translate([2.5, 1, 0])
        rotate([90, 0, 0]) scale([1, 1, 1.25]) sphere(5, $fn = 50);
        translate([-5, -.1, 0]) cube([15, 10, 5]);
        translate([-5, 4.9, -5]) cube([15, 10, 10]);
    }
   
}

module pod() {
    difference() {
        translate([2.5, 0, 0])
        rotate([90, 0, 0]) sphere(4.9, $fn = 50);
        translate([-5, -.2, 0]) cube([15, 10, 5]);
        translate([2.5, -2.50, 0]) rotate([90,0,0]) cylinder(d=3.1, h=10, $fn = 20);
        translate([2.5, 0, -2.5]) rotate([180,0,0]) cylinder(d=3.1, h=10, $fn = 20);
        // #translate([-5, 5, -5]) cube([15, 10, 10]);
    }
   
}

module bottomFin() {
    radius = .5;
    translate([0,0,-.5]) 
    hull() linear_extrude(.5) {
        translate([2.5, 2.5, 0]) circle(d=4, $fn = 20);
        translate([7.5, 2.5, 0]) circle(d=4, $fn = 20);
    }
    difference() {
        translate([5,2.5,0]) 
        minkowski() {
            hull() {
                translate([0, 0, 0])
                linear_extrude(.1)
                square([6,.5], true);
                
                translate([-5, 0, -5])
                linear_extrude(.1)
                square([.1, .1], true);
            }
            sphere(radius, $fn = 20);
        }
        cube([10, 5, 5]);
    }

}

module sideFin() {
    difference() {
        minkowski() {
            translate([0, -6, -1.5])
                cube([4, 10, .1]);
            sphere(.5, $fn = 20);
        }

        translate([1, 1, -2.5])
        cube([3 , 3 , 2]);
    }
}

module negativeHead() {
    // units in this module are in mm
    scale(1 / L) 
    minkowski() {
        radius = 2;
        translate([0, 0, -8.3 + radius]) 
        cylinder(r=5.2 - radius, h=8.3 - 2 * radius, $fn = 20);
        sphere(r = radius, $fn = 20);
    }
}
module hat() {
    
    difference() {
        union() {
            // cap
            translate([0,0,-1.25]) 
            rotate([-10,0,0])
            difference() {
                sphere(r = 4.5, $fn = 30);
                translate([-10, -10, -10]) cube([20, 20, 10]);
            }

            // ears
            translate([3.5,0, -1.5]) rotate([0,90,0]) sphere(r = 2.0, $fn = 20);
            translate([-3.5,0, -1.5]) rotate([0,90,0]) sphere(r = 2.0, $fn = 20);
        }
    translate([0,0,-.1]) cylinder(r = 2.5, h = 2, $fn = 20);
    negativeHead();

    }
    translate([-2.5, -2.5, 2]) santistud(h = 2);

    
    
}
scale(L) {
    
    
    PLAY = .2;
    grid(3, 1) sstud();

    // translate([-2.5, -2.5, 2]) tile();

    difference() {
        rotate([90, 0, 0]) sphere(d = 15, $fn = 50);
        
        

        // corner
        translate([0, -5 + 2.5 + PLAY, 10])
            cube([20, 10, 20], center = true);
        
        // back
        translate([0, -12.5 + PLAY, 0])
            cube([20, 20, 20], center = true);

        // ink trap
        translate([0, 2.5, 0])
        rotate([0, 90, 0])
            cylinder(d = 1, h = 15.1, center = true);

        // front  hole
        translate([0, 7, 0])
        rotate([90, 0, 0])
            cylinder(d = 3, h = 5, center = true);
        
        // bottom  hole
        translate([0, 0, -7])
        rotate([0, 0, 0])
            cylinder(d = 3, h = 5, center = true);

        // translate([0, 0, -9])
        // rotate([0, 0, 0])
        //     cylinder(d = 5, h = 5, center = true);
    }
  
}