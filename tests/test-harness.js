/**
 * DINE AI - Robust Zero-Dependency Test Harness
 * Provides describe, it/test, lifecycle hooks, and rich assertion library.
 */

class TestHarness {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.startTime = 0;
    this.resultsByTier = {};
  }

  describe(name, fn) {
    const parentSuite = this.currentSuite;
    const suite = {
      name,
      tests: [],
      beforeEachHooks: [],
      afterEachHooks: [],
      parent: parentSuite,
    };

    if (parentSuite) {
      parentSuite.suites = parentSuite.suites || [];
      parentSuite.suites.push(suite);
    } else {
      this.suites.push(suite);
    }

    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = parentSuite;
    }
  }

  beforeEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeEachHooks.push(fn);
    }
  }

  afterEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterEachHooks.push(fn);
    }
  }

  test(name, fn) {
    if (!this.currentSuite) {
      this.describe('Default Suite', () => {
        this.test(name, fn);
      });
      return;
    }
    this.currentSuite.tests.push({ name, fn });
  }

  it(name, fn) {
    this.test(name, fn);
  }

  async runSuite(suite, tier = 'Default') {
    let suitePassed = 0;
    let suiteFailed = 0;
    const suiteResults = [];

    for (const testCase of suite.tests) {
      this.totalTests++;
      const testStart = Date.now();
      let error = null;

      try {
        // Run beforeEach hooks
        let current = suite;
        const hooks = [];
        while (current) {
          hooks.unshift(...current.beforeEachHooks);
          current = current.parent;
        }
        for (const hook of hooks) {
          await hook();
        }

        // Run test function
        await testCase.fn();

        // Run afterEach hooks
        current = suite;
        const afterHooks = [];
        while (current) {
          afterHooks.push(...current.afterEachHooks);
          current = current.parent;
        }
        for (const hook of afterHooks) {
          await hook();
        }

        this.passedTests++;
        suitePassed++;
      } catch (err) {
        this.failedTests++;
        suiteFailed++;
        error = err;
      }

      const duration = Date.now() - testStart;
      suiteResults.push({
        name: testCase.name,
        passed: !error,
        error: error ? error.message : null,
        stack: error ? error.stack : null,
        duration,
      });
    }

    // Run nested suites
    if (suite.suites) {
      for (const nested of suite.suites) {
        const nestedRes = await this.runSuite(nested, tier);
        suitePassed += nestedRes.passed;
        suiteFailed += nestedRes.failed;
        suiteResults.push(...nestedRes.results);
      }
    }

    return { passed: suitePassed, failed: suiteFailed, results: suiteResults };
  }

  async runAll(tierName = 'Default') {
    const start = Date.now();
    const allResults = [];
    let passed = 0;
    let failed = 0;

    for (const suite of this.suites) {
      const res = await this.runSuite(suite, tierName);
      passed += res.passed;
      failed += res.failed;
      allResults.push({
        suiteName: suite.name,
        ...res,
      });
    }

    const duration = Date.now() - start;
    this.resultsByTier[tierName] = {
      passed,
      failed,
      total: passed + failed,
      duration,
      suites: allResults,
    };

    return this.resultsByTier[tierName];
  }

  reset() {
    this.suites = [];
    this.currentSuite = null;
  }
}

// Rich Assertions
export const assert = {
  equal(actual, expected, msg = '') {
    if (actual !== expected) {
      throw new Error(`Assertion Failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${msg}`);
    }
  },

  strictEqual(actual, expected, msg = '') {
    if (actual !== expected) {
      throw new Error(`Strict Equal Failed: expected ${expected} (${typeof expected}), got ${actual} (${typeof actual}). ${msg}`);
    }
  },

  notEqual(actual, expected, msg = '') {
    if (actual === expected) {
      throw new Error(`Assertion Failed: expected not equal to ${JSON.stringify(expected)}. ${msg}`);
    }
  },

  deepEqual(actual, expected, msg = '') {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(`Deep Equal Failed:\nExpected: ${expectedStr}\nActual:   ${actualStr}\n${msg}`);
    }
  },

  ok(value, msg = '') {
    if (!value) {
      throw new Error(`Assertion Failed: expected truthy value, got ${JSON.stringify(value)}. ${msg}`);
    }
  },

  isTrue(value, msg = '') {
    if (value !== true) {
      throw new Error(`Assertion Failed: expected true, got ${JSON.stringify(value)}. ${msg}`);
    }
  },

  isFalse(value, msg = '') {
    if (value !== false) {
      throw new Error(`Assertion Failed: expected false, got ${JSON.stringify(value)}. ${msg}`);
    }
  },

  isAbove(actual, target, msg = '') {
    if (actual <= target) {
      throw new Error(`Assertion Failed: expected ${actual} to be greater than ${target}. ${msg}`);
    }
  },

  isAtLeast(actual, target, msg = '') {
    if (actual < target) {
      throw new Error(`Assertion Failed: expected ${actual} to be >= ${target}. ${msg}`);
    }
  },

  isBelow(actual, target, msg = '') {
    if (actual >= target) {
      throw new Error(`Assertion Failed: expected ${actual} to be less than ${target}. ${msg}`);
    }
  },

  isAtMost(actual, target, msg = '') {
    if (actual > target) {
      throw new Error(`Assertion Failed: expected ${actual} to be <= ${target}. ${msg}`);
    }
  },

  includes(container, item, msg = '') {
    if (typeof container === 'string') {
      if (!container.includes(item)) {
        throw new Error(`Assertion Failed: expected string "${container}" to include "${item}". ${msg}`);
      }
    } else if (Array.isArray(container)) {
      if (!container.includes(item) && !container.some(x => JSON.stringify(x) === JSON.stringify(item))) {
        throw new Error(`Assertion Failed: expected array to include ${JSON.stringify(item)}. ${msg}`);
      }
    } else if (container && typeof container === 'object') {
      if (!(item in container)) {
        throw new Error(`Assertion Failed: expected object to have property "${item}". ${msg}`);
      }
    } else {
      throw new Error(`Assertion Failed: invalid container type. ${msg}`);
    }
  },

  match(str, regex, msg = '') {
    if (!regex.test(str)) {
      throw new Error(`Assertion Failed: expected "${str}" to match regex ${regex}. ${msg}`);
    }
  },

  isArray(val, msg = '') {
    if (!Array.isArray(val)) {
      throw new Error(`Assertion Failed: expected array, got ${typeof val}. ${msg}`);
    }
  },

  isObject(val, msg = '') {
    if (!val || typeof val !== 'object' || Array.isArray(val)) {
      throw new Error(`Assertion Failed: expected object, got ${typeof val}. ${msg}`);
    }
  },

  isNumber(val, msg = '') {
    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error(`Assertion Failed: expected number, got ${val}. ${msg}`);
    }
  },

  isString(val, msg = '') {
    if (typeof val !== 'string') {
      throw new Error(`Assertion Failed: expected string, got ${typeof val}. ${msg}`);
    }
  },

  hasProperty(obj, prop, msg = '') {
    if (!obj || typeof obj !== 'object' || !(prop in obj)) {
      throw new Error(`Assertion Failed: expected object to have property "${prop}". ${msg}`);
    }
  },

  throws(fn, expectedErr, msg = '') {
    let threw = false;
    try {
      fn();
    } catch (err) {
      threw = true;
      if (expectedErr) {
        if (typeof expectedErr === 'string' && !err.message.includes(expectedErr)) {
          throw new Error(`Expected error containing "${expectedErr}", got "${err.message}". ${msg}`);
        }
        if (expectedErr instanceof RegExp && !expectedErr.test(err.message)) {
          throw new Error(`Expected error matching ${expectedErr}, got "${err.message}". ${msg}`);
        }
      }
    }
    if (!threw) {
      throw new Error(`Expected function to throw error, but it did not. ${msg}`);
    }
  },

  async rejects(promiseOrFn, expectedErr, msg = '') {
    let threw = false;
    try {
      if (typeof promiseOrFn === 'function') {
        await promiseOrFn();
      } else {
        await promiseOrFn;
      }
    } catch (err) {
      threw = true;
      if (expectedErr) {
        if (typeof expectedErr === 'string' && !err.message.includes(expectedErr)) {
          throw new Error(`Expected rejection containing "${expectedErr}", got "${err.message}". ${msg}`);
        }
        if (expectedErr instanceof RegExp && !expectedErr.test(err.message)) {
          throw new Error(`Expected rejection matching ${expectedErr}, got "${err.message}". ${msg}`);
        }
      }
    }
    if (!threw) {
      throw new Error(`Expected promise to reject, but it resolved. ${msg}`);
    }
  },
};

export const createHarness = () => new TestHarness();
