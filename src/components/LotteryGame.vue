<template>
  <div class="lottery-game" ref="lotteryGameContainer">
    <div class="menu">
      <div class="balance-and-selected">
        <p class="timer-text">
          {{ timerMessage }}
          <span
            v-if="insufficientBalanceMessage"
            class="insufficient-balance-message"
          >
            {{ insufficientBalanceMessage }}
          </span>
        </p>
        <p class="balance">Balance: €{{ balance }}</p>
        <p class="selected-ball">
          Selected Ticket: {{ selectedBall !== null ? selectedBall : "None" }}
        </p>
      </div>
      <div class="bet-options">
        <button
          v-for="ball in 10"
          :key="ball"
          :class="{ active: selectedBall === ball }"
          @click="toggleSelection(ball)"
          :disabled="buttonsDisabled || countdown === 0"
        >
          Ticket number {{ ball }}
        </button>
      </div>
    </div>
    <div class="animations">
      <h2 class="title">Lottery Game</h2>
      <PixiAnimation
        :drawnNumber="drawnNumber"
        :timerStarted="timerStarted"
        :selectedBall="selectedBall ?? 0"
        :drawCount="drawCount"
        @loadingComplete="startTimer"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";
import PixiAnimation from "./PixiAnimation.vue";

export default defineComponent({
  components: {
    PixiAnimation,
  },
  setup() {
    const balance = ref(3);
    const selectedBall = ref<number | null>(null);
    const countdown = ref(15);
    const timerMessage = ref(`Time left: ${countdown.value}`);
    const drawnNumber = ref<number>(1);
    const buttonsDisabled = ref(false);
    const lotteryGameContainer = ref<HTMLDivElement | null>(null);
    const insufficientBalanceMessage = ref<string | null>(null);
    const timerStarted = ref(false);
    const drawCount = ref(0);
    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const updateTimerMessage = () => {
      if (countdown.value > 0) {
        timerMessage.value = `Time left: ${countdown.value}`;
      } else {
        timerMessage.value = "The draw is in progress...";
      }
    };

    const toggleSelection = (ball: number) => {
      if (countdown.value > 0 && !buttonsDisabled.value) {
        if (balance.value < 1) {
          insufficientBalanceMessage.value =
            "Insufficient balance to select a ball.";
          setTimeout(() => {
            insufficientBalanceMessage.value = null;
          }, 2000);
          return;
        }
        if (selectedBall.value === ball) {
          selectedBall.value = null;
        } else {
          selectedBall.value = ball;
        }
      }
    };

    const drawNumber = () => {
      drawnNumber.value = Math.floor(Math.random() * 10) + 1;
      drawCount.value += 1;
      buttonsDisabled.value = true;
      if (selectedBall.value !== null) {
        if (selectedBall.value === drawnNumber.value) {
          balance.value += 1;
          timerMessage.value = `Congratulations! You won €1 with ticket number ${drawnNumber.value}`;
        } else {
          balance.value -= 1;
          timerMessage.value = `Sorry, you lost. The drawn number was ${drawnNumber.value}`;
        }
      } else {
        timerMessage.value = `Sorry, you didn't choose a ticket. The drawn number was ${drawnNumber.value}`;
      }
      setTimeout(() => {
        timerMessage.value = "The draw is in progress...";
        selectedBall.value = null;
        countdown.value = 15;
        buttonsDisabled.value = false;
        updateTimerMessage();
        startTimer();
      }, 5000);
    };

    const startTimer = () => {
      timerStarted.value = false;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      countdownInterval = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value -= 1;
          updateTimerMessage();
        } else {
          clearInterval(countdownInterval!);
          timerStarted.value = true;
          drawNumber();
        }
      }, 1000);
    };

    const resizeHandler = () => {
      if (lotteryGameContainer.value) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        lotteryGameContainer.value.style.width = `${width}px`;
        lotteryGameContainer.value.style.height = `${height}px`;
      }
    };

    onMounted(() => {
      window.addEventListener("resize", resizeHandler);
      resizeHandler();
      startTimer();
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeHandler);
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    });

    watch(
      () => drawnNumber.value,
      () => {
        drawCount.value += 1;
      },
      { immediate: true }
    );

    return {
      balance,
      selectedBall,
      countdown,
      timerMessage,
      buttonsDisabled,
      toggleSelection,
      drawnNumber,
      startTimer,
      lotteryGameContainer,
      insufficientBalanceMessage,
      timerStarted,
      drawCount,
    };
  },
});
</script>

<style scoped>
.lottery-game {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #333;
  font-family: "Arial", sans-serif;
  width: 95%;
  overflow-x: hidden;
  padding: 10px;
  box-sizing: border-box;
}

.menu {
  padding: 10px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.balance-and-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.balance-and-selected .timer-text,
.balance-and-selected .balance,
.balance-and-selected .selected-ball {
  display: block;
  width: 100%;
  text-align: left;
  margin-left: 5px;
}

.balance-and-selected .insufficient-balance-message {
  color: red;
  font-weight: bold;
  margin-left: 10px;
}

.bet-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.bet-options button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
  flex: 1 1 45%;
  min-width: 60px;
}

.bet-options button.active {
  background: #22a7ff;
}

.bet-options button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.bet-options button:hover:not(:disabled) {
  background: #45a049;
}

.animations {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .lottery-game {
    flex-direction: row;
  }

  .menu {
    width: 33.33%;
    margin-right: 20px;
    flex-shrink: 0;
  }

  .balance-and-selected {
    flex-direction: column;
  }

  .animations {
    width: 66.67%;
    height: 100%;
  }

  .title {
    margin-top: 0;
  }
}

@media (max-width: 767px) {
  .lottery-game {
    flex-direction: column-reverse;
    max-height: 90vh;
    margin-right: 30px;
  }

  .menu {
    width: 100%;
    height: auto;
    padding: 10px 20px;
  }

  .menu p {
    margin: 5px 0;
  }

  .balance-and-selected {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    margin-bottom: 10px;
  }

  .balance-and-selected .timer-text {
    grid-column: 1 / span 2;
    text-align: left;
    margin-left: 5px;
  }

  .balance-and-selected .balance {
    grid-column: 1 / 2;
    text-align: left;
    margin-left: 5px;
  }

  .balance-and-selected .selected-ball {
    grid-column: 2 / 3;
    text-align: left;
    margin-left: 5px;
  }

  .animations {
    flex: 1;
    width: 100%;
    padding: 10px;
    max-height: 50vh;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .bet-options button {
    flex: 1 1 45%;
    min-width: 50px;
    padding: 5px;
  }
}
</style>
