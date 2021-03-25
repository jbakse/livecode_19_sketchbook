# River Portraits!

![Makwa](/sketches/intermediate/river/_renders/makwa_01.png)

# Inspiration

This started with a conversation with [Nikki Makagiansar](http://sketches2021spring.compform.net/users/TXDPuyAjpaj9WnTJK). Nikki was working on the treasure map challenge from the Comp Form [noise chapter](https://compform.net/noise/). She was using [p5's](https://p5js.org) noise function to create a randomly meandering river on her map. We talked about a few different approaches. A noise walking approach was easy to try and worked pretty well, but would sometimes result in two rivers crossing each other, which breaks the illusion. This wasn't a big deal for Nikki's sketch; she could just run it a few times and cherry pick the best results.

That conversation got me interested in trying some other techniques.

# A sketch

Generating rivers is a somewhat common creative coding project. Some great examples include Robert Hogin's [Meander](http://roberthodgin.com/project/meander) and Scott Turner's [Here Dragons Abound](https://heredragonsabound.blogspot.com/2020/07/a-meandering-subject.html).

One common technique to generate a river uses a height map and a particle. The particle follows the slope of the height map from a higher point to a lower point. The traced path is your river.

I decided to explore this technique with a sketch in p5.

![01_01](/sketches/intermediate/river/_renders/sketch_01_render_01.png)

This sketch starts by creating a height map using
[domain warped](https://iquilezles.org/www/articles/warp/warp.htm)
[perlin noise](https://mrl.cs.nyu.edu/~perlin/doc/oscar.html). It then randomly places particles, one at a time, and lightly traces their path for a couple of hundred steps. Particles flow down the slopes, and naturally retrace the steps of other particles. These heavily visted areas build up the brightest color.

While tweaking the parameters a bit, I stumbled on this rendering, which looked a lot like some kind of celestial knight.

![01_02](/sketches/intermediate/river/_renders/sketch_01_render_02.png)

I really liked this image, and thought it would be fun to run with this sketch a litte further.

# A Small Project

I decided I wanted to take the basic premise of the sketch and see how it would look if provided a height map generated from a 3d model.

## Generating A Height Map

I used some models I already had: Dungeons and Dragons miniatures from [Hero Forge](https://www.heroforge.com/). I brought that model into [Blender](http://blender.org/) and create a custom node-based material to color the surface based on its distance from the camera.

![01_02](/sketches/intermediate/river/_figures/blender.png)

## Tracing the Rivers

I rendered some character depth-map portraits as .pngs and loaded them into the p5 sketch. p5 blends the rendered height map with the noise based one from the original sketch and then traces the particles.

I tweaked the code by hand for each portrait to get different effects, and saved out a few generated images of each one.

<div class="two-up">

![Makwa](/sketches/intermediate/river/_outtakes/makwa_10.jpg)
![Makwa](/sketches/intermediate/river/_outtakes/makwa_11.jpg)

</div>

## Final Compositing

The final images seen here are post processed a bit in photoshop, usually compositing a few p5 exports together and adjusting contrast.

![Makwa](/sketches/intermediate/river/_renders/makwa_01.png)
![Laoth](/sketches/intermediate/river/_renders/laoth_01.png)
![Thexius](/sketches/intermediate/river/_renders/thexius_01.png)

# Closing Thoughts

This was a fun area to explore, and I'm pretty happy with the immediate results. Looking back though, I kind of like the celestial knight render more than finished portraits. I think I can get the portraits to capture more of the feel of that happy accident with a little tweaking. If I continue this project I think the first step should be to add a bit of an interface for tweaking parameters to make it easier to dial in different effects.
