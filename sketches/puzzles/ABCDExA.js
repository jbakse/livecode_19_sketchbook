/* eslint-disable */

const digits = "0123456789";

for (const a of "123456789")
  for (const b of digits)
    for (const c of digits)
      for (const d of digits)
        for (const e of digits) {
          const factorA = a + b + c + d + e;
          const factorB = a;
          const product = e + e + e + e + e;
          if (factorA * factorB == product) {
            // == !== === !
            console.log(`${factorA} x ${factorB} = ${product}`);
          }
        }
