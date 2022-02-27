import k from "./kaboom.js";
import { enemy, elevator } from "./components.js";

const config = {
  width: 32,
  height: 32,
  "E": () => [
    k.sprite("door"),
    k.area(),
    k.origin("center"),
    k.scale(5, 5),
    "exit",
  ],
  "=": () => [k.sprite("tiles", { frame: 1 }), k.area(), k.solid(), "ground"],
  "-": () => [k.sprite("tiles", { frame: 11 }), k.area(), k.solid(), "ground"],
  ">": () => [k.sprite("tiles", { frame: 12 }), k.area(), k.solid(), "ground"],
  "<": () => [k.sprite("tiles", { frame: 10 }), k.area(), k.solid(), "ground"],
  "r": () => [k.sprite("tiles", { frame: 23 }), k.area(), k.solid(), "ground"],
  "l": () => [k.sprite("tiles", { frame: 25 }), k.area(), k.solid(), "ground"],
  "L": () => [k.sprite("tiles", { frame: 0 }), k.area(), k.solid(), "ground"],
  "R": () => [k.sprite("tiles", { frame: 2 }), k.area(), k.solid(), "ground"],
  "(": () => [k.sprite("tiles", { frame: 31 }), k.area(), k.solid(), "ground"],
  "^": () => [k.sprite("tiles", { frame: 32 }), k.area(), k.solid(), "ground"],
  ")": () => [k.sprite("tiles", { frame: 33 }), k.area(), k.solid(), "ground"],
  "@": () => [
    k.sprite("tiles", { frame: 30 }),
    k.area(),
    k.body(),
    elevator(),
    "ground",
  ],
  "$": () => [
    k.sprite("acid", { animSpeed: 1, anim: "top" }),
    k.area(),
    k.scale(2),
    "acid",
  ],
  "#": () => [
    k.sprite("acid", { animSpeed: 1, anim: "bot" }),
    k.area(),
    k.scale(2),
    "dangrous",
  ],
  "!": () => [
    "badguy",
    k.sprite("skelly", { animSpeed: 1, anim: "move" }),
    k.area({ width: 32, height: 38 }),
    k.body(),
    k.scale(1.5),
    k.origin("center"),
    k.health(10),
    enemy(),
  ],
};

export default config;
