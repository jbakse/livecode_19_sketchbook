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
CHEAT_CEILING = -.5 / L; // 
CHEAT_STUD_OD = .2 / L;
CHEAT_ROUND_OD = .1 / L;



////////////////////////////////////
// studs

module stud() {
    $fn = 20;

    color("blue")
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, STUD_HEIGHT * .5 ]) // align bottom t0 0
    cylinder(h = STUD_HEIGHT, d = 3 + CHEAT_STUD_OD , center  = true);
}

module tstud() {
    $fn = 20;

    difference()
    {
        stud();
        translate([2.5 , 2.5 ,0]) // align center to grid
        translate([0, 0, STUD_HEIGHT * .51 ]) // align bottom to 0
        cylinder(h = STUD_HEIGHT + .01 , d = 2 , center  = true);
    }
}


module sstud() {
    $fn = 20;

    difference()
    {
        tstud();
        translate([2.5, 2.5, STUD_HEIGHT * .51])
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
    $fn = 20;
    
    santistud(h);

    roundLid();
    // // top
    // translate([2.5, 2.5, 0]) // align center to grid
    // translate([0,0, -.25 ]) // align top to 0
    // cylinder(h = .5, d = 4.07 + CHEAT_ROUND_OD , center  = true);
    
    // antistud();
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
        translate([row * 5, col * 5, 0]) children();
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

scale(L) {
    translate([0, 0, 0]) {
        tile();
        mosEisleyDome();
    }

    translate([0, 8, 0]) {
        wall();
        mosEisleyVat();
    }

    translate([0, 16, 0]) {
        tile();
        mosEisleyTower();
    }

    translate([0, 24, 0]) {
        tile();
        fin();
    }

    translate([0, 32, 0]) {
        tile();
        fin2();
       
    }

    translate([0, 40, 0]) {
        tile();
        
        translate([0,5,0]) mirror([0, 1, 0]) fin2();
    }
   
    
}


 
// scale(L) {
   
//     translate([0, 0, 0]) {
//         roundTile();
//         dish();
//     }
//     translate([8, 0, 0]) {
//         roundTile();
//         //antistud();
//         //greebleBase();
//     }
//     translate([16, 0, 0]) {
//         plate(1, 1);
//     }
//     translate([24, 0, 0]) {
//         plate(1, 1);
//         tstud();
//     }
    
//     translate([32, 0, 0]) {
//         plate(1, 2);
//     }
//     translate([40, 0, 0]) {
//         plate(1, 2);
//         grid(1, 2) tstud();
//     }
//     translate([48, 0, 0]) {
//         roundTile();
//         dome();
//     }
    
// }

