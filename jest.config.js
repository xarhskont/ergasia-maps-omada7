export default {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/.*': '<rootDir>/tests/mocks/firebase-mock.js'
  },
};
