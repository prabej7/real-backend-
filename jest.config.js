module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@validations/(.*)$': '<rootDir>/src/validations/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1'
  }
}; 