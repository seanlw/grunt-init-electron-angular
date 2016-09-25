'use strict';

exports.description = 'Scaffolds a new Electron with Angular project';

exports.after = 'You should now install project dependecies with _npm ' +
                'install_ and _npm run postinstall_. ' +
                'You may need webpack and typings installed globaly ' +
                '_npm install -g webpack_ and _npm install -g typings_.';

exports.warnOn = '*';

exports.template = function(grunt, init, done) {
    init.process({}, [
        init.prompt('name'),
        {
          name: 'productName',
          message: 'Product name',
          default: function(value, data, done) {
            var name = data.name || '';
            name = name.replace(/[\W_]+/g, ' ');
            name = name.replace(/\w+/g, function(word) {
              return word[0].toUpperCase() + word.slice(1).toLowerCase();
            });
            done(null, name);
          }
        },
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('licenses'),
        init.prompt('author_name'),
        init.prompt('author_email'),
        init.prompt('repository')
    ], function(err, props) {

        var files = init.filesToCopy(props);

        /* Getting license when only one is selected */
        if ( props.licenses && props.licenses.length === 1 ) {
          var license = props.licenses[0];
          var fileobj = init.expand({filter: 'isFile'}, 'licenses/LICENSE-' + license)[0];
          if (fileobj) {
            files['LICENSE.txt'] = fileobj.rel;
          }
        }
        else {
          init.addLicenseFiles(files, props.licenses);
        }

        init.copyAndProcess(files, props, { noProcess : 'resources/**' });

        init.writePackageJSON('package.json', props, function(pkg, props) {
          if (pkg.licenses && pkg.licenses.length === 1) {
            pkg.license = pkg.licenses[0].type;
            delete pkg.licenses;
          }
          else {
            pkg.licenses.map(function(license){
              return { type: license.type, url: 'LICENSE-' + license.type };
            });
          }

          return Object.assign(pkg, {
            productName: props.productName,
            appBundleId: props.productName + '.app',
            helperBundleId: props.productName + '.app.helper',
            main: "app/main.js",
            scripts: {
              "build": "webpack --progress --profile --colors --display-error-details --display-cached",
              "watch": "webpack --watch --progress --profile --colors --display-error-details --display-cached",
              "electron": "npm run build && electron app",
              "package": "npm run build && babel-node scripts/package.js --platform=all",
              "package:osx": "npm run build && babel-node scripts/package.js --platform=darwin",
              "package:win": "npm run build && babel-node scripts/package.js --platform=win32",
              "package:linux": "npm run build && babel-node scripts/package.js --platform=linux",
              "postinstall": "typings install"
            },
            devDependencies: {
              "@angular/common": "2.0.0",
              "@angular/compiler": "2.0.0",
              "@angular/core": "2.0.0",
              "@angular/forms": "2.0.0",
              "@angular/http": "2.0.0",
              "@angular/platform-browser": "2.0.0",
              "@angular/platform-browser-dynamic": "2.0.0",
              "@angular/router": "3.0.0",
              "@angular/upgrade": "2.0.0",
              "babel": "^5.8.29",
              "core-js": "^2.4.1",
              "denodeify": "^1.2.1",
              "electron-packager": "^7.3.0",
              "electron-prebuilt": "^1.3.4",
              "es6-shim": "^0.34.0",
              "json-loader": "^0.5.4",
              "lodash": "^3.10.1",
              "minimist": "^1.2.0",
              "node-sass": "^3.8.0",
              "raw-loader": "^0.5.1",
              "reflect-metadata": "^0.1.3",
              "rxjs": "5.0.0-beta.12",
              "sass-loader": "^4.0.0",
              "systemjs": "0.19.27",
              "ts-loader": "^0.8.2",
              "typescript": "^2.0.2",
              "typings": "^1.3.2",
              "webpack": "^1.13.2",
              "webpack-dev-server": "^1.16.1"
            },
            dependencies: {
              "font-awesome": "^4.6.3",
              "zone.js": "^0.6.13"
            }
          });
        });

        done();
    });
};
