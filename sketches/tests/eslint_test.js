var a = 1;
{
  b = 2;
  c;
}

labeled: while (true) {
  const x = 1;
  const nums = [1, 2, 3];
  for (const num of nums) {
    continue labeled;
  }
}
