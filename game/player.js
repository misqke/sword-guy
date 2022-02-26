import k from "./kaboom.js";

const SPEED = 200;
const JUMP_FORCE = 600;

k.loadSprite("warrior", "/sprites/warrior.png", {
  sliceX: 16,
  sliceY: 7,
  anims: {
    idle: {
      from: 0,
      to: 8,
      loop: true,
      speed: 10,
    },
    jump: {
      from: 16,
      to: 27,
      speed: 20,
    },
    move: {
      from: 32,
      to: 39,
      loop: true,
      speed: 15,
    },
    attack: {
      from: 48,
      to: 58,
      speed: 15,
    },
    explode: {
      from: 96,
      to: 111,
      speed: 10,
    },
    success: {
      from: 80,
      to: 83,
      speed: 5,
    },
  },
});

const getPlayer = () => {
  // ADD PLAYER
  const player = k.add([
    "player",
    k.sprite("warrior", {
      animSpeed: 1,
      anim: "idle",
    }),
    k.area({ width: 32, height: 40 }),
    k.pos(100, 0),
    k.body(),
    k.scale(1.25),
    k.origin(vec2(0, 0.62)),
    k.health(20),
    k.outline(20, "BLUE"),
    k.timer(),
    {
      dir: 1,
      attacking: false,
      left: false,
      right: false,
      damage: 5,
      shield: false,
    },
  ]);

  // PLAYER HELPER FUNCTIONS
  // moving
  const move = () => {
    player.move(SPEED * player.dir, 0);
  };
  // jumping
  const jump = () => {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    } else {
      player.doubleJump(JUMP_FORCE);
    }
    if (player.curAnim() !== "attack") {
      player.play("jump");
    }
    player.onGround(() => {
      if (player.curAnim() === "attack") {
        return;
      } else if (player.left || player.right) {
        player.play("move");
      } else {
        player.play("idle");
      }
    });
  };
  // attacking
  const attack = () => {
    if (player.curAnim() === "attack") {
      return;
    }
    player.play("attack");
    const attackBox = k.add([
      "attackBox",
      k.rect(
        player.area.width + 10 * player.scale.x * player.scale.x,
        player.area.height * player.scale.y
      ),
      area(),
      opacity(0),
      pos(
        player.dir === 1
          ? player.pos.x + player.area.width * 0.5 * player.scale.x
          : player.pos.x -
              player.area.width * 0.5 -
              (player.area.width * player.scale.x + 35),
        player.pos.y - player.height * (1 - player.origin.y) + 5
      ),
    ]);
    attackBox.onUpdate(() => {
      attackBox.pos.x =
        player.dir === 1
          ? player.pos.x + player.area.width * 0.5 * player.scale.x
          : player.pos.x -
            player.area.width * 0.5 -
            (player.area.width * player.scale.x + 10);
      attackBox.pos.y =
        player.pos.y - player.height * (1 - player.origin.y) + 5;
    });
    attackBox.onCollide("enemy", (e) => {
      e.hurt(player.damage);
      console.log(e.hp());
    });

    player.onAnimEnd("attack", () => {
      k.destroy(attackBox);
      if (player.left || player.right) {
        player.play("move");
      }
    });
  };

  // PLAYER KEY BINDINGS
  // moving left
  k.onKeyPress(["a", "left"], () => {
    player.dir = -1;
    if (player.curAnim() !== "attack" || player.curAnim() !== "takeHit") {
      player.play("move");
    }
    player.flipX(true);
  });
  k.onKeyDown(["a", "left"], () => {
    player.left = true;
  });
  k.onKeyRelease(["a", "left"], () => {
    player.left = false;
    if (player.curAnim() !== "attack" || player.curAnim() !== "takeHit") {
      player.play("idle");
    }
  });
  // moving right
  k.onKeyPress(["d", "right"], () => {
    player.dir = 1;
    if (player.curAnim() !== "attack" || player.curAnim() !== "takeHit") {
      player.play("move");
    }
    player.flipX(false);
  });
  k.onKeyDown(["d", "right"], () => {
    player.right = true;
  });
  k.onKeyRelease(["d", "right"], () => {
    player.right = false;
    if (player.curAnim() !== "attack" || player.curAnim() !== "takeHit") {
      player.play("idle");
    }
  });
  // jumping
  k.onKeyPress(["w", "up"], () => {
    jump();
  });
  // attacking
  k.onKeyPress("space", () => {
    attack();
  });

  // MOBILE CONTROLS
  if (k.isTouch()) {
    const leftButton = k.add([
      k.sprite("left-button"),
      k.layer("ui"),
      k.opacity(0.5),
      k.area(),
      k.fixed(),
      k.pos(5, k.height() - 100),
    ]);
    const rightButton = k.add([
      k.sprite("right-button"),
      k.layer("ui"),
      k.opacity(0.5),
      k.area(),
      k.fixed(),
      k.pos(90, k.height() - 100),
    ]);
    const aButton = k.add([
      k.sprite("a-button"),
      k.layer("ui"),
      k.opacity(0.5),
      k.area(),
      k.fixed(),
      k.pos(k.width() - 190, k.height() - 100),
    ]);
    const bButton = k.add([
      k.sprite("b-button"),
      k.layer("ui"),
      k.opacity(0.5),
      k.area(),
      k.fixed(),
      k.pos(k.width() - 95, k.height() - 100),
    ]);

    k.onTouchStart((pos, touch) => {
      if (leftButton.hasPoint(touch)) {
        player.left = true;
        leftButton.opacity = 1;
      } else if (rightButton.hasPoint(touch)) {
        player.right = true;
        rightButton.opacity = 1;
      } else if (aButton.hasPoint(touch)) {
        attack();
      } else if (bButton.hasPoint(touch)) {
        jump();
      }
    });

    k.onTouchEnd((pos, touch) => {
      if (bButton.hasPoint(touch)) {
        return;
      } else if (leftButton.hasPoint(touch)) {
        player.left = false;
        leftButton.opacity = 0.5;
      } else if (rightButton.hasPoint(touch)) {
        player.right = false;
        rightButton.opacity = 0.5;
      }
    });
  }

  // PLAYER UPDATES

  player.onUpdate(() => {
    if (player.curAnim() === "success") {
      return;
    }
    if (player.dead === true) {
      if (player.curAnim() !== "explode") {
        player.play("explode", {
          onEnd: () => k.go("game", { level: 0 }),
        });
      } else {
        return;
      }
    }
    k.camPos(player.pos);
    if (player.left || player.right) {
      move();
    }
  });

  // handle acid
  player.onCollide("acid", () => {
    player.hurt(2);
  });

  // get hurt
  player.onHurt(() => {
    k.shake(8);
    player.shield = true;
    player.wait(1, () => (player.shield = false));
    console.log(player.hp());
  });
  // die
  player.onDeath(() => {
    player.dead = true;
  });

  console.log(player);

  return player;
};

export default getPlayer;
