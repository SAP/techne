const nunjucks = require('nunjucks');
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const sass = require('node-sass');

const TEMPLATE_DIRECTORY = path.join(__dirname, 'templates');
const PUBLIC_DIRECTORY = path.join(__dirname, 'public');
const SASS_DIRECTORY = path.join(__dirname, '..', 'scss');

const GLOBALS = {
    namespace: 'tn'
};

// looks for html in templates folder, static resources in public
var env = nunjucks.configure([TEMPLATE_DIRECTORY,PUBLIC_DIRECTORY], {
    autoescape: false,
    cache: false,
    express: app,
    watch: true
});
// convert SASS to CSS from the lib source
env.addFilter('sass_to_css', function(sassFile="app.scss") {
    try {
        var scss_filename = `${SASS_DIRECTORY}/${sassFile}`;
        return sass.renderSync({
            file: scss_filename
        }).css.toString();
    } catch(err) {
        console.warn(`sassToCss: ${err.message}`);
    }
});
// convert an array to classes
// returns [ tn-element--mod ]
env.addFilter('modifier', function(array=[],element="") {
    //is string
    if (typeof array === "string") {
        return ` ${GLOBALS.namespace}-${element}--${array}`;
    }
    var mods = array.map((mod) => {
         return ` ${GLOBALS.namespace}-${element}--${mod}`;
    })
    //console.log(mods.join());
    return mods.join('') ;
});
// convert an array to classes
// returns [ tn-cls ]
env.addFilter('classes', function(array=[]) {
    //is string
    if (typeof array === "string") {
        return ` ${GLOBALS.namespace}-${array}`;
    }
    var classes = array.map((cls, index) => {
         return ` ${GLOBALS.namespace}-${cls}`;
    })
    //console.log(mods.join());
    return classes.join('') ;
});
// convert an object to classes
// returns [ is-key ]
env.addFilter('state', function(obj=[]) {
    var classes = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!!obj[key]) {
            classes.push(` is-${key}`);
        }
      }
    }
    return classes.join('') ;
});
// convert an object to classes
// returns [ aria-key="true", role="" ]
env.addFilter('aria', function(obj=[]) {
    var attrs = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key === "role") {
                attrs.push(` role="${obj[key]}"`);
            } else if (!!obj[key]) {
                attrs.push(` aria-${key}="${obj[key]}"`);
            }
        }
    }
    return attrs.join('') ;
});


app.set('views', TEMPLATE_DIRECTORY);
app.set('view engine', 'njk');

app.use(router);
app.use('/static', express.static(path.join(__dirname, 'resources')));

//load font files
router.get('/TechneIcons:key', (req, res) => {
    res.sendFile(path.join(__dirname, '..', `scss/icons/TechneIcons${req.params.key}`));
});

router.all('/', function (req, res, next) {
  //console.log('request initiated!');
  next();
});

router.get('/', function (req, res) {
  res.render('index', GLOBALS);
});

router.get('/:key', (req, res) => {
    var key = req.params.key;
    var data = {};
    try {
        data = require(`./templates/${key}/data.json`);
    } catch (e) {

    } finally {

    }
    console.log(`requested http://localhost:3030/${key}`);
    res.render(`${key}/index`, Object.assign(GLOBALS, { id: key, data: data, libs: getLibs(req.query.lib) }));
});

router.get('/pages/:key', (req, res) => {
    var key = req.params.key;
    console.log(`requested http://localhost:3030/pages/${key}`);
    res.render(`pages/${key}`, Object.assign(GLOBALS, { id: key }));
});


app.listen(3030);
console.log('listening at http://localhost:3030')
module.exports = app;

function getLibs(libQuery) {
    var libs = {
        b3: false,
        b4: false,
        md: false,
        tn: false
    }
    var libsChecked = libQuery;
    if (libsChecked) {
        if (typeof libsChecked == 'string') {
            libsChecked = [libsChecked];
        }
        for (var i = 0; i < libsChecked.length; i++) {
            switch (libsChecked[i]) {
                case "b3":
                    libs.b3 = true;
                    break;
                case "b4":
                    libs.b4 = true;
                    break;
                case "md":
                    libs.md = true;
                    break;
                case "tn":
                    libs.tn = true;
                    break;
                default:
            }
        }
    }
    return libs;
}
