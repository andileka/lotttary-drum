<template>
  <div class="gsap-animation" ref="container">
    <div v-if="loading" class="loading-container">
      <div class="loading">
        <div
          class="ball"
          v-for="(color, index) in ballColors"
          :key="index"
          :style="{ backgroundColor: color }"
        >
          <span class="ball-number">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="coin-animation" ref="coinAnimationContainer"></div>
      <div ref="circleContainer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  onBeforeUnmount,
  watch,
  PropType,
} from "vue";

import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { Emitter } from "@pixi/particle-emitter";
import "@pixi/sprite-animated"; //


import ballImage1 from "../assets/B1.png";
import ballImage2 from "../assets/B2.png";
import ballImage3 from "../assets/B3.png";
import ballImage4 from "../assets/B4.png";
import ballImage5 from "../assets/B5.png";
import ballImage6 from "../assets/B6.png";
import ballImage7 from "../assets/B7.png";
import ballImage8 from "../assets/B8.png";
import ballImage9 from "../assets/B9.png";
import ballImage10 from "../assets/B10.png";
import glassImage from "../assets/Glass.png";
import goldAnimImage from "../assets/gold_anim.png";
import goldAnimData from "../assets/gold_anim.json";
import winnerImage from "../assets/WINNER.png";

export default defineComponent({
  props: {
    drawnNumber: {
      type: Number as PropType<number>,
      required: true,
      default: 0,
    },
    timerStarted: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    isWinning: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    drawCount: {
      type: Number as PropType<number>,
      required: true,
      default: 0,
    },
  },

  emits: ["loadingComplete"],

  setup(props, { emit }) {
    const container = ref<HTMLDivElement | null>(null);
    const coinAnimationContainer = ref<HTMLDivElement | null>(null);

    const app = ref<PIXI.Application | null>(null);
    const loading = ref(true);
    const showCoinAnimation = ref(false);

    const glassImageDimensions = { width: 600, height: 600 };

    const ballImages = [
      ballImage1,
      ballImage2,
      ballImage3,
      ballImage4,
      ballImage5,
      ballImage6,
      ballImage7,
      ballImage8,
      ballImage9,
      ballImage10,
    ];

    const ballColors = [
      "#FF0000",
      "#FF7F00",
      "#FFFF00",
      "#0000FF",
      "#4B0082",
      "#8B00FF",
      "#00FFFF",
      "#FFC0CB",
      "#8B4513",
    ];

    const balls = ref<Array<PIXI.Sprite & { vx?: number; vy?: number }>>([]);
    const radius = 250;
    const centerX = glassImageDimensions.width / 2;
    const centerY = glassImageDimensions.height / 2;
    let emitter: Emitter | null = null;
    let winnerSprite: PIXI.Sprite | null = null;

    const startCoinAnimation = () => {
      if (!coinAnimationContainer.value || !app.value) {
        console.error("coinAnimationContainer or app is null");
        return;
      }

      if (emitter) {
        emitter.cleanup();
        emitter.destroy();
      }

      PIXI.utils.clearTextureCache();

      const loader = new PIXI.Loader();
      loader.add("goldAnimImage", goldAnimImage);
      loader.load((_loader, resources) => {
        if (!resources.goldAnimImage || !resources.goldAnimImage.texture) {
          console.error("Texture loading failed");
          return;
        }

        const sheet = new PIXI.Spritesheet(
          resources.goldAnimImage.texture,
          goldAnimData
        );
        sheet
          .parse()
          .then(() => {
            const frames = Object.keys(sheet.textures).map(
              (key) => sheet.textures[key]
            );
            if (frames.length === 0) {
              console.error("No frames found in the spritesheet");
              return;
            }

            const emitterContainer = new PIXI.Container();
            app.value?.stage.addChild(emitterContainer);

            const config = {
              lifetime: { min: 1, max: 4 },
              frequency: 0.03,
              spawnChance: 1,
              particlesPerWave: 2,
              emitterLifetime: 5,
              maxParticles: 200,
              pos: {
                x: app.value!.screen.width / 3,
                y: 0,
              },
              behaviors: [
                {
                  type: "spawnShape",
                  config: {
                    type: "rect",
                    data: {
                      x: 0,
                      y: 0,
                      w: app.value!.screen.width,
                      h: 1,
                    },
                  },
                },
                {
                  type: "animatedRandom",
                  config: {
                    anims: [
                      {
                        textures: frames,
                        framerate: 10,
                        loop: true,
                      },
                    ],
                  },
                },
                {
                  type: "moveSpeed",
                  config: {
                    speed: {
                      list: [
                        { value: 200, time: 0 },
                        { value: 300, time: 1 },
                      ],
                    },
                  },
                },
                {
                  type: "alpha",
                  config: {
                    alpha: {
                      list: [
                        { value: 1, time: 0 },
                        { value: 0.7, time: 1 },
                      ],
                    },
                  },
                },
                {
                  type: "scale",
                  config: {
                    scale: {
                      list: [
                        { value: 1, time: 0 },
                        { value: 0.5, time: 1 },
                      ],
                    },
                  },
                },
                {
                  type: "rotationStatic",
                  config: {
                    min: 0,
                    max: 360,
                  },
                },
              ],
            };

            emitter = new Emitter(emitterContainer, config);
            emitter.updateOwnerPos(0, 0);

            let elapsed = Date.now();

            const update = () => {
              const now = Date.now();
              if (emitter) {
                emitter.update((now - elapsed) * 0.001);
              }
              elapsed = now;
              requestAnimationFrame(update);
            };

            update();
          })
          .catch((error) => {
            console.error("Spritesheet parsing failed", error);
          });
      });

      if (winnerSprite && app.value) {
        app.value.stage.addChild(winnerSprite);
      }
    };

    onMounted(() => {

      app.value = new PIXI.Application({
        width: glassImageDimensions.width,
        height: glassImageDimensions.height,
        backgroundColor: 0x87ceeb,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (container.value && app.value) {
        container.value.appendChild(app.value.view);
        resizeCanvas();

      window.addEventListener("resize", resizeCanvas);

      const circle = new PIXI.Graphics();
      circle.lineStyle(0);
      circle.drawCircle(0, 0, radius);


      const stickLength = radius * 1.14;
      const diagonalLine = new PIXI.Graphics();
      diagonalLine.lineStyle(5, 0xffffff);
      diagonalLine.moveTo(-stickLength / 2, -stickLength / 2);
      diagonalLine.lineTo(stickLength / 2, stickLength / 2);

      const lineContainer = new PIXI.Container();
      lineContainer.addChild(diagonalLine);

      circle.addChild(lineContainer);
      circle.x = centerX;
      circle.y = centerY;
      // Only add the circle to the stage if not loading
      if (!loading.value) {
        app.value?.stage.addChild(circle);
      }

      // Animate line to rotate inside the circle
      gsap.to(lineContainer, {
        rotation: Math.PI * 2,
        duration: 1,
        repeat: -1,
        ease: "linear",
      });

      // Load ball images
      const loader = new PIXI.Loader();
      ballImages.forEach((image, index) => {
        loader.add(`ball${index + 1}`, image);
      });
      loader.add("glass", glassImage);
      loader.add("winnerImage", winnerImage);

      loader.load((_, resources) => {
        // Create balls with the loaded images
        const ballSpeed = 20;

        for (let i = 0; i < ballImages.length; i++) {
          const ballTexture = resources[`ball${i + 1}`].texture;
          const ball = new PIXI.Sprite(ballTexture) as PIXI.Sprite & {
            vx?: number;
            vy?: number;
          };
          ball.anchor.set(0.5);
          ball.scale.set(0.143);

          // Create a larger circular mask for the ball
          const mask = new PIXI.Graphics();
          mask.beginFill(0xffffff);
          mask.drawCircle(0, 0, (ball.width / 2) * 4);
          mask.endFill();
          ball.addChild(mask);
          ball.mask = mask;

          ball.x = centerX + Math.random() * radius * 2 - radius;
          ball.y = centerY + Math.random() * radius * 2 - radius;

          // Random direction
          const angle = Math.random() * Math.PI * 2;
          ball.vx = Math.cos(angle) * ballSpeed;
          ball.vy = Math.sin(angle) * ballSpeed;

          balls.value.push(ball);
          app.value?.stage.addChild(ball);
        }

        // Add the glass image on top of everything
        const glass = new PIXI.Sprite(resources["glass"].texture);
        glass.anchor.set(0.5);
        glass.x = centerX;
        glass.y = centerY;
        glass.alpha = 0.6;
        app.value?.stage.addChild(glass);

        // Add winner image sprite
        const winnerTexture = resources["winnerImage"].texture;
        winnerSprite = new PIXI.Sprite(winnerTexture);
        winnerSprite.anchor.set(0.5);
        winnerSprite.scale.set(0.5);
        winnerSprite.x = centerX;
        winnerSprite.y = centerY;
        winnerSprite.visible = false;

        // Function to move balls chaotically
        const moveBalls = () => {
          balls.value.forEach((ball) => {
            ball.x += ball.vx!;
            ball.y += ball.vy!;

            const dx = ball.x - centerX;
            const dy = ball.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance + ball.height / 2 > radius) {
              const angle = Math.atan2(dy, dx);
              ball.vx = -ball.vx!;
              ball.vy = -ball.vy!;
              ball.x = centerX + (radius - ball.height / 2) * Math.cos(angle);
              ball.y = centerY + (radius - ball.height / 2) * Math.sin(angle);
            }
          });
        };

        // Function to randomly change ball velocities
        const randomizeBallDirections = () => {
          balls.value.forEach((ball) => {
            const angle = Math.random() * Math.PI * 2;
            ball.vx = Math.cos(angle) * ballSpeed + Math.random() - 0.5;
            ball.vy = Math.sin(angle) * ballSpeed + Math.random() - 0.5;
          });
        };

        // Animate balls movement
        app.value?.ticker.add(moveBalls);

        // Randomize ball directions every 0.5 seconds
        setInterval(randomizeBallDirections, 500);

        // All assets are loaded, hide loading icon and emit event

          loading.value = false;
          emit("loadingComplete");
          if (app.value) {
            app.value.stage.addChild(circle);
          }

      });

      // Watch for the drawCount to trigger the animation
      watch(
        () => props.drawCount,
        () => {
          if (props.drawnNumber !== null && props.drawnNumber !== undefined) {
            animateDrawnBall(props.drawnNumber);
          }
        }
      );

      // Watch for timer start to stop the animation
      watch(
        () => props.timerStarted,
        (newTimerStarted) => {
          if (newTimerStarted) {
            stopAnimation();
          }
        }
      );
    });

    // Function to animate the drawn ball
    const animateDrawnBall = (number: number) => {
      const ball = balls.value[number - 1];

      if (props.isWinning) {
        showCoinAnimation.value = true;
        if (winnerSprite) {
          winnerSprite.visible = true;
        }
        startCoinAnimation();
      }

      const originalVx = ball.vx;
      const originalVy = ball.vy;

      gsap.to(ball, {
        duration: 1,
        x: centerX,
        y: centerY - radius - ball.height,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.to(ball, {
            duration: 3,
            x: ball.x,
            y: ball.y,
            vx: 0,
            vy: 0,
            ease: "none",
            onComplete: () => {
              gsap.to(ball, {
                duration: 1,
                x: centerX,
                y: centerY + Math.random() * radius * 2 - radius,
                ease: "none",
                onComplete: () => {
                  const angle = Math.random() * Math.PI * 2;
                  ball.vx =
                    originalVx ?? Math.cos(angle) * 20 + Math.random() - 0.5;
                  ball.vy =
                    originalVy ?? Math.sin(angle) * 20 + Math.random() - 0.5;
                  emit("loadingComplete");
                  stopAnimation();
                },
              });
            },
          });
        },
      });
    };

    // Function to stop the animation
    const stopAnimation = () => {
      showCoinAnimation.value = false;
      if (winnerSprite) {
        winnerSprite.visible = false;
      }
      if (emitter) {
        emitter.emit = false;
      }
    };

    // Function to resize canvas on window resize
    const resizeCanvas = () => {
      if (app.value && container.value) {
        const containerWidth = container.value.clientWidth;
        const containerHeight = container.value.clientHeight;
        const scale = Math.min(
          containerWidth / glassImageDimensions.width,
          containerHeight / glassImageDimensions.height
        );
        app.value.renderer.resize(
          glassImageDimensions.width * scale,
          glassImageDimensions.height * scale
        );
        app.value.stage.scale.set(scale, scale);
      }
    };

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeCanvas);
    });

    return {
      container,
      coinAnimationContainer,
      loading,
      showCoinAnimation,
      ballColors,
    };
  },
});
</script>

<style scoped>
.gsap-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  position: relative;
}

.coin-animation {
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
}

.loading {
  display: flex;
  position: relative;
  width: 50px;
  height: 50px;
}

.ball {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  animation: snake 1s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: white;
  font-weight: bold;
}

.ball:nth-child(1) {
  animation-delay: 0s;
}
.ball:nth-child(2) {
  animation-delay: 0.2s;
}
.ball:nth-child(3) {
  animation-delay: 0.4s;
}
.ball:nth-child(4) {
  animation-delay: 0.6s;
}
.ball:nth-child(5) {
  animation-delay: 0.8s;
}

@keyframes snake {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(20px, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
  75% {
    transform: translate(0, 20px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
