# Rivers

![Makwa](/sketches/river/_renders/makwa.png)

# Inspiration

This started with a conversation with [Nikki Makagiansar](http://sketches2021spring.compform.net/users/TXDPuyAjpaj9WnTJK). Nikki was working on the treasure map challenge from the Comp Form [noise chapter](https://compform.net/noise/). She was using [p5's](https://p5js.org) noise function to create a randomly meandering river on her map. We talked about a few different approaches. A lot of the easiest approaches would allow two rivers to cross each other, which breaks the illusion. This wasn't a big deal for the Nikki's sketch; she could just run it a few times and cherry pick the best results.

Generating rivers is a somewhat common creative coding project. Robert Hogin's [Meander](http://roberthodgin.com/project/meander) and Scott Turner's [Here Dragons Abound](https://heredragonsabound.blogspot.com/2020/07/a-meandering-subject.html).

# A sketch

One common technique to generate a river uses a height map and a particle. The particle follows the slope of the height map from a higher point to a lower point. The traced path is your river.

I decided to explore this technique with a sketch in p5.

![01_01](/sketches/river/_renders/sketch_01_render_01.png)

outline of algo
[perlin noise](https://mrl.cs.nyu.edu/~perlin/doc/oscar.html)
[domain warping](https://iquilezles.org/www/articles/warp/warp.htm)
cone

While tweaking the parameters a bit, I stumbled on this rendering, which looked a lot like some kind of celestial knight.

![01_02](/sketches/river/_renders/sketch_01_render_02.png)

# Project

hero forge

blender shader
![01_02](/sketches/river/_figures/blender.png)

sketch

composite in photoshop

![Makwa](/sketches/river/_renders/makwa.png)
![Laoth](/sketches/river/_renders/laoth.png)
![Thexius](/sketches/river/_renders/thexius.png)

http://www.flong.com/archive/projects/floccugraph/index.html
