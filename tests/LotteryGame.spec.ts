import { shallowMount } from "@vue/test-utils";
import LotteryGame from "../src/components/LotteryGame.vue";
import PixiAnimation from "../src/components/PixiAnimation.vue";

describe("LotteryGame.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    jest.useFakeTimers();
    wrapper = shallowMount(LotteryGame);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders the component properly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("has a balance of 3 initially", () => {
    expect(wrapper.vm.balance).toBe(3);
  });

  it("displays the correct initial timer message", () => {
    expect(wrapper.find(".timer-text").text()).toContain("Time left: 15");
  });

  it("displays insufficient balance message when balance is less than 1", async () => {
    wrapper.vm.balance = 0;
    await wrapper.vm.toggleSelection(1);
    expect(wrapper.find(".insufficient-balance-message").text()).toBe(
      "Insufficient balance to select a ball."
    );
  });

  it("correctly toggles selection", async () => {
    wrapper.vm.balance = 3;
    await wrapper.vm.toggleSelection(1);
    expect(wrapper.vm.selectedBall).toBe(1);
    await wrapper.vm.toggleSelection(1);
    expect(wrapper.vm.selectedBall).toBeNull();
  });

  it("starts the timer on mounted", () => {
    expect(wrapper.vm.countdown).toBe(15);
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.countdown).toBe(14);
  });

  it("displays correct drawn number and updates balance correctly", async () => {
    wrapper.vm.selectedBall = 1;
    wrapper.vm.balance = 3;

    wrapper.vm.drawNumber = jest.fn(() => {
      wrapper.vm.drawnNumber = 1;
      if (wrapper.vm.selectedBall === wrapper.vm.drawnNumber) {
        wrapper.vm.balance += 1;
        wrapper.vm.timerMessage = `Congratulations! You won €1 with ticket number 1`;
      } else {
        wrapper.vm.balance -= 1;
        wrapper.vm.timerMessage = `Sorry, you lost. The drawn number was ${wrapper.vm.drawnNumber}`;
      }
    });

    await wrapper.vm.startTimer();
    jest.advanceTimersByTime(15000); // Simulate the countdown
    wrapper.vm.drawNumber();
    await wrapper.vm.$nextTick();

    // Verify the expectations
    expect(wrapper.vm.drawCount).toBe(1);
    expect(wrapper.vm.balance).toBe(4);
    expect(wrapper.vm.timerMessage).toContain(
      "Congratulations! You won €1 with ticket number 1"
    );
  });

  it("resets the timer and state after drawing a number", async () => {
    wrapper.vm.drawNumber = jest.fn(() => {
      wrapper.vm.drawnNumber = 1;
      if (wrapper.vm.selectedBall === wrapper.vm.drawnNumber) {
        wrapper.vm.balance += 1;
        wrapper.vm.timerMessage = `Congratulations! You won €1 with ticket number 1`;
      } else {
        wrapper.vm.balance -= 1;
        wrapper.vm.timerMessage = `Sorry, you lost. The drawn number was ${wrapper.vm.drawnNumber}`;
      }
    });

    await wrapper.vm.startTimer();
    jest.advanceTimersByTime(15000); // Simulate the countdown
    wrapper.vm.drawNumber();
    jest.advanceTimersByTime(5000); // Simulate the waiting time after drawing
    await wrapper.vm.$nextTick();

    // Verify the expectations
    expect(wrapper.vm.countdown).toBe(0);
    expect(wrapper.vm.selectedBall).toBeNull();
    expect(wrapper.vm.buttonsDisabled).toBe(true);
  });

  it("renders PixiAnimation component", () => {
    const wrapper = shallowMount(LotteryGame, {
      components: { PixiAnimation },
    });
    expect(wrapper.findComponent(PixiAnimation).exists()).toBe(true);
  });

  it("updates countdown and timer message correctly", async () => {
    wrapper.vm.updateTimerMessage = jest.fn(() => {
      if (wrapper.vm.countdown > 0) {
        wrapper.vm.timerMessage = `Time left: ${wrapper.vm.countdown}`;
      } else {
        wrapper.vm.timerMessage = "The draw is in progress...";
      }
    });
    wrapper.vm.countdown = 10;
    await wrapper.vm.$nextTick();
    wrapper.vm.updateTimerMessage();
    expect(wrapper.vm.timerMessage).toBe("Time left: 10");
    wrapper.vm.countdown = 0;
    await wrapper.vm.$nextTick();
    wrapper.vm.updateTimerMessage();
    expect(wrapper.vm.timerMessage).toBe("The draw is in progress...");
  });
});
