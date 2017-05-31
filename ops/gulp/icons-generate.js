const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const svgSprite = require("gulp-svg-sprites");

// svgSprite configuration
const config = {
    templates: { css: require("fs").readFileSync("./src/icons/techne-icons-template.css", "utf-8") },
    selector: "hyicon-%f",
    common: "hyicon",
    svg: { sprite: "css/techne-icons.svg" },
    cssFile: "css/techne-icons.css",
    preview: {sprite: "techne-icons.html"}
};

// generate icons 
const task = (cb) => {
    return gulp.src('./src/icons/raw-svg/*.svg')
           .pipe(svgmin())
           .pipe(svgSprite(config))
           .pipe(gulp.dest("./src/icons"))
}

gulp.task('icons-generate', task);
module.exports = task;