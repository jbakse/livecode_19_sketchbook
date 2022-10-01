//https://bricks.stackexchange.com/questions/288/what-are-the-dimensions-of-a-lego-brick

L = 1.6; // A lego unit is 1.6mm



// divide by L to convert mm to Lego units
// cheats use positive numbers for MORE PLASTIC
// cheats use negative numbers for LESS PLASTIC
STUD_HEIGHT = 1.8 / L;
CHEAT_CEILING = -.5 / L; // 
CHEAT_STUD_OD = .2 / L;
CHEAT_ROUND_OD = .1 / L;

module stud() {
    $fn = 20;

    color("blue")
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, STUD_HEIGHT * .5 ]) // align bottom t0 0
    cylinder(h = STUD_HEIGHT, d = 3 + CHEAT_STUD_OD , center  = true);
}

module tstud() {
    $fn = 20;

    difference() {
        stud();
        translate([2.5 , 2.5 ,0]) // align center to grid
        translate([0, 0, STUD_HEIGHT * .51 ]) // align bottom to 0
        cylinder(h = STUD_HEIGHT + .01 , d = 2 , center  = true);
    }
}


module sstud() {
    $fn = 20;

    difference() {
        tstud();
        translate([2.5, 2.5, STUD_HEIGHT * .51])
            union() {
                cube([10, .25, STUD_HEIGHT], center = true);
                cube([.25, 10, STUD_HEIGHT], center = true);
             }
    }
}




module brick(w = 1, d = 1){
   difference() {
       // outer
       translate([0, 0, -6 ]) // align top
       cube([w * 5 , d * 5 , 6 ]);
        
       // hollow
       translate([0, 0, -6.01 ]) // align top
       translate([1, 1, 0]) // center
       cube([(w * 5 - 2) , (d * 5 - 2) , 5]);
   }
}


module plate(w = 1, d = 1){
   difference() {
       // outer
       translate([0, 0, -2 ]) // align top
       cube([w * 5 , d * 5 , 2 ]);
        
       // hollow
       translate([0, 0, -2.01 ]) // align top
       translate([1, 1, 0]) // center
       cube([(w * 5 - 2) , (d * 5 - 2) , STUD_HEIGHT - CHEAT_CEILING]);
   }
}


module grid(w = 1, d = 1) {
    for (row = [0:w-1], col = [0:d-1]) {
        translate([row * 5 , col * 5, 0]) children();
    }
}


module dish() {
    translate([0, 0, -.2]) // merge base
    translate([2.5, 2.51, 4 ]) // position
    // rotate([45, 0, 0]) // position
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
    translate([0, 0, -.2]) // merge base
    translate([2.5, 2.51, 0]) // position
    
    difference(){
    // antenna
   
        sphere(d = 4.07 + CHEAT_ROUND_OD, $fn = 40);
        translate([0, 0, -3]) cube([10, 10, 6], center = true);
       
    }
}


module antistud() {
    $fn = 20;
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, -1 ]) // align top t0 0
    color("Red") difference() {
        cylinder(h = 2, d = 4.07 + CHEAT_ROUND_OD, center  = true);
        //cylinder(h = 2.01, d = 3 , center  = true);
        cylinder_outer(2.01, 1.5, $fn); // acount for circle/poly error
        cube([10, .25, 2.01], center = true);
        cube([.25, 10, 2.01], center = true);
             
    }
}

/*

module greebleBase(d = 4.07) {
    $fn = 40;
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, -.5 ]) // align top t0 0
    cylinder(h = 1, d = d , center  = true);
    
}
*/

module roundTile() {

    $fn = 20;
    
    // top
    translate([2.5, 2.5, 0]) // align center to grid
    translate([0,0, -.25 ]) // align top t0 0
    cylinder(h = .5, d = 4.07 + CHEAT_ROUND_OD , center  = true);
    
    
    antistud();
    
    
    
}

 module cylinder_outer(height,radius,fn){
   fudge = 1/cos(180/fn);
   cylinder(h=height,r=radius*fudge,$fn=fn, center = true);
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

