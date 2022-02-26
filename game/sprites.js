import k from "./kaboom.js";

const loadSprites = () => {
  // mobile controls
  k.loadSprite("left-button", "sprites/controls/left-button.png");
  k.loadSprite("right-button", "sprites/controls/right-button.png");
  k.loadSprite("a-button", "sprites/controls/a-button.png");
  k.loadSprite("b-button", "sprites/controls/b-button.png");

  k.loadSprite("tiles", "sprites/terrain/Tileset.png", {
    sliceX: 10,
    sliceY: 6,
  });

  k.loadSprite("acid", "sprites/terrain/acid.png", {
    sliceX: 8,
    sliceY: 2,
    anims: {
      top: {
        from: 0,
        to: 7,
        loop: true,
        speed: 5,
      },
      bot: {
        from: 8,
        to: 15,
        loop: true,
        speed: 5,
      },
    },
  });

  k.loadSprite("door", "sprites/terrain/doorway.png");

  k.loadSprite("skelly", "sprites/enemies/skelly.png", {
    sliceX: 13,
    sliceY: 5,
    anims: {
      idle: {
        from: 39,
        to: 42,
        loop: true,
        speed: 8,
      },
      move: {
        from: 26,
        to: 37,
        loop: true,
        speed: 10,
      },
      attack: {
        from: 0,
        to: 12,
        speed: 15,
      },
      takeHit: {
        from: 52,
        to: 54,
        speed: 5,
      },
      death: {
        from: 13,
        to: 25,
        speed: 8,
      },
    },
  });
};

export default loadSprites;
