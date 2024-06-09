require('@testing-library/jest-dom');
const { config } = require('@vue/test-utils');

config.global.plugins = []; // Add any plugins you need here

jest.useFakeTimers(); // Use Jest's fake timers globally
