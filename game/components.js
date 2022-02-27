import k from "./kaboom.js";

export function enemy(
  distance = randi(80, 120),
  speed = randi(90, 110),
  dir = 1,
  damage = randi(2, 3)
) {
  return {
    id: "enemy",
    require: ["area"],
    startingPos: vec2(0, 0),
    left: false,
    dead: false,
    add() {
      this.onAnimEnd("death", () => {
        this.destroy();
        this.unuse("body");
        this.unuse("enemy");
      });
      k.timer();
      this.startingPos = this.pos;
      this.onCollide(["badguy", "ground"], () => {
        this.left = !this.left;
        dir = -dir;
      });
      this.onHurt(() => {
        if (this.hp() >= 0) {
          this.play("takeHit");
        }
      });
      this.onDeath(() => {
        this.dead = true;
        damage = 0;
      });

      this.onCollide("player", (p) => {
        if (p.pos.x > this.pos.x) {
          this.left = false;
          dir = 1;
        } else if (this.pos.x > p.pos.x) {
          this.left = true;
          dir = -1;
        }
        if (this.curAnim() !== "takeHit" && this.dead === false) {
          this.attack();
        }
      });
    },
    attack() {
      this.play("attack");
      wait(0.1, () => {
        const attackBox = k.add([
          k.rect(this.area.width, this.area.height),
          k.area({ width: this.area.width, height: this.area.height }),
          k.scale(this.scale),
          k.opacity(0),
          k.pos(
            this.left
              ? this.pos.x -
                  this.area.width * 0.5 -
                  this.area.width * this.scale.y
              : this.pos.x + this.area.width * 0.5,
            this.pos.y - this.area.height * 0.5 * this.scale.y
          ),
        ]);

        attackBox.onUpdate(() => {
          attackBox.pos = vec2(
            this.left
              ? this.pos.x -
                  this.area.width * 0.5 -
                  this.area.width * this.scale.y
              : this.pos.x + this.area.width * 0.5,
            this.pos.y - this.area.height * 0.5 * this.scale.y
          );
        });
        attackBox.onCollide("player", (p) => {
          if (!p.shield) {
            p.hurt(damage);
          }
        });
        this.onAnimEnd("attack", () => {
          k.destroy(attackBox);
        });
      });
    },
    update() {
      if (this.dead === true) {
        if (this.curAnim() !== "death") {
          this.play("death");
        } else {
          return;
        }
      }
      if (!this.curAnim()) {
        this.play("move");
      }
      if (this.left) {
        this.flipX(true);
      } else {
        this.flipX(false);
      }
      if (this.curAnim() === "move") {
        if (this.left) {
          if (this.startingPos.x - this.pos.x > distance) {
            this.left = false;
            dir = 1;
          }
        }
        if (!this.left) {
          if (this.pos.x - this.startingPos.x > distance) {
            this.left = true;
            dir = -1;
          }
        }
        this.move(speed * dir, 0);
      }
    },
  };
}

export function elevator() {
  return {
    id: "elevator",
    require: ["body"],
    startingPos: vec2(0, 0),
    dir: -1,
    add() {
      this.startingPos = this.pos;
      k.timer();
    },
    update() {
      this.move(0, 5 * dir);
      if (this.startingPos.y - this.pos.y > 100) {
        this.dir = 1;
      }
      if (this.startingPos.y - this.pos.y <= 0) {
        this.dir = -1;
      }
    },
  };
}
