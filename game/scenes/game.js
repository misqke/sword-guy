import k from "../kaboom.js";
import loadSprites from "../sprites.js";
import maps from "../maps.js";
import config from "../config.js";
import getPlayer from "../player.js";

loadSprites();

k.scene("game", ({ level }) => {
  k.layers(["bg", "game", "ui"], "game");
  k.addLevel(maps[level], config);
  const player = getPlayer();
  // move on
  player.onCollide("exit", () => {
    player.play("success");
    player.onAnimEnd("success", () => {
      k.go("game", { level: level + 1 });
    });
  });
});
