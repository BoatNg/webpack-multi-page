const cssnano = require('cssnano')

module.exports = {
  plugins: {
    autoprefixer: { 
      browsers: [
        "defaults",
        "not ie < 8",
        "last 5 versions",
        "> 1%",
        "iOS 7",
        "last 3 iOS versions"
      ] 
    },
    cssnano,
  }
};
