module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.mjs$': 'babel-jest', 
    '^.+\\.js$': 'babel-jest',   
  },
  moduleFileExtensions: ['js', 'mjs', 'json'],
  testMatch: ['**/tests/**/*.test.mjs'],  
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],  
};
