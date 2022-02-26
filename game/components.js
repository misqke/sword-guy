import k from "./kaboom.js";

export function enemy(distance = 100, speed = 100, dir = 1, damage = 2) {
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
      });
      k.timer();
      this.startingPos = this.pos;
      this.onCollide(["enemy"], () => {
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
      wait(0.5, () => {
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
        if (Math.abs(this.pos.x - this.startingPos.x) > distance) {
          this.left = !this.left;
          dir = -dir;
        }
        this.move(speed * dir, 0);
      }
    },
  };
}
