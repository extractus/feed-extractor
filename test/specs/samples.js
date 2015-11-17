var samples = [
  {
    rating: [0, 0, 0, 0, 0],
    expect: {
      average: 0,
      score: 0
    }
  },
  {
    rating: [1, 1, 1, 1, 1],
    expect: {
      average: 3.0,
      score: 0.17
    }
  },
  {
    rating: [2, 2, 2, 2, 2],
    expect: {
      average: 3.0,
      score: 0.24
    }
  },
  {
    rating: [3, 3, 3, 3, 3],
    expect: {
      average: 3.0,
      score: 0.27
    }
  },
  {
    rating: [4, 4, 4, 4, 4],
    expect: {
      average: 3.0,
      score: 0.3
    }
  },
  {
    rating: [5, 5, 5, 5, 5],
    expect: {
      average: 3.0,
      score: 0.32
    }
  },
  {
    rating: [5, 4, 3, 2, 1],
    expect: {
      average: 2.3,
      score: 0.15
    }
  },
  {
    rating: [5, 0, 0, 0, 5],
    expect: {
      average: 3.0,
      score: 0.24
    }
  },
  {
    rating: [5, 0, 0, 4, 5],
    expect: {
      average: 3.3,
      score: 0.33
    }
  },
  {
    rating: [5, 4, 0, 0, 5],
    expect: {
      average: 2.7,
      score: 0.21
    }
  },
  {
    rating: [0, 0, 0, 0, 5],
    expect: {
      average: 5,
      score: 0.57
    }
  },
  {
    rating: [0, 0, 0, 4, 5],
    expect: {
      average: 4.6,
      score: 0.56
    }
  },
  {
    rating: [0, 0, 3, 4, 5],
    expect: {
      average: 4.2,
      score: 0.51
    }
  },
  {
    rating: [0, 2, 3, 4, 5],
    expect: {
      average: 3.9,
      score: 0.45
    }
  },
  {
    rating: [1, 2, 3, 4, 5],
    expect: {
      average: 3.7,
      score: 0.42
    }
  },
  {
    rating: [9524, 4158, 10177, 25971, 68669],
    expect: {
      average: 4.2,
      score: 0.79
    }
  },
  {
    rating: [134055, 57472, 143135, 365957, 1448459],
    expect: {
      average: 4.4,
      score: 0.84
    }
  }
];

module.exports = samples;
