(function () {

  'use strict';

  var base = 'https://www.npmjs.org/package/';
  var extReg = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var ext = ['.coffee', '.js'];
  var reqReg = /require\({0,1}\s*('|")((?:[^\.\/\-\_])[\w\/\-!\.]+)\1\s*\){0,1}/;

  init();

  function init () {

    var max = 300;
    var cur = 0;

    document.body.addEventListener('click', function (event) {
      if (!event.target.classList.contains('js-directory-link')) {
        return;
      }
      var id = setInterval(function () {
        cur++;
        if (replaceModules()) {
          clearInterval(id);
          return;
        }
        if (cur > max) {
          clearInterval(id);
          return;
        }
      }, 16);
    }, false);

    replaceModules();
  }

  function replaceModules () {
    if (isPackageJsonFile()) {
      replaceDependencies();
      return true;
    }
    else if (isParsableFile()) {
      replaceRequires();
      replaceImports();
      return true;
    }
    return false;
  }

  function replaceModulesWithLinks (elements) {
    for(var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var a = createLink(el);
      el.innerHTML = "";
      el.appendChild(a);
    }
  }

  function replaceDependencies () {

    var packages = getDependencyElements('dependencies');
    replaceModulesWithLinks(packages);

    var devPackages = getDependencyElements('devDependencies');
    replaceModulesWithLinks(devPackages);

    var optionalPackages = getDependencyElements('optionalDependencies');
    replaceModulesWithLinks(optionalPackages);

    var peerPackages = getDependencyElements('peerDependencies');
    replaceModulesWithLinks(peerPackages);

    var bundledPackages = getDependencyElements('bundledDependencies');
    replaceModulesWithLinks(bundledPackages);

    var nameField = getNameField();

    if (nameField) {
      replaceModulesWithLinks([nameField]);
    }

  }

  function replaceRequires () {
    var requires = getRequireElements();
    replaceModulesWithLinks(requires);
  }

  function replaceImports () {
    var imports = getImportElements();
    replaceModulesWithLinks(imports);
  }

  function getExtname (path) {
    return extReg.exec(path)[4];
  }

  function getLines () {
    return document.querySelectorAll('.js-file-line');
  }

  function getTitle () {
    return document.querySelector('.final-path');
  }

  function getNameField () {
    var pls = document.querySelectorAll('.pl-s');
    for(var i = 0, len = pls.length; i < len; i++) {
      var pl = pls[i];
      if (pl.innerText.indexOf("name") !== -1) {
        return pl.parentNode.querySelectorAll('.pl-s')[1];
      }
    }
    return void 0;
  }

  function isPackageJsonFile () {
    var title = getTitle();
    return (title && title.textContent === 'package.json');
  }

  function isParsableFile () {
    var filename = getTitle();
    return (filename && ext.indexOf(getExtname(filename.textContent)) !== -1);
  }

  function createLink (el) {
    var text = el.textContent;
    var quote = text.indexOf("'") > -1 ? "'" : '"';
    var a = document.createElement('a');
    text = text.replace(/("|')/g, '');
    a.href = base + text;
    a.innerText = quote + text + quote;
    a.title = "Go to NPM Module site for " + text;
    return a;
  }

  function getDependencyElements (startName) {
    var lines = getLines();
    var elements = [];
    var insideScope = false;

    for(var i = 0, len = lines.length; i < len; i++) {
      var line = lines[i];
      if (!line) continue;

      if (isStartDependencyNode(line, startName) && !isEmptyDependencyNode(line)) {
        insideScope = true;
        continue;
      }

      if (!insideScope) continue;

      if (isEndDependencyNode(line)) {
        return elements;
      }

      var child = line.querySelector('.pl-s');
      if (child) {
        elements.push(child);
      }
    }

    return [];
  }

  function getRequireElements () {
    var lines = getLines();
    var elements = [];

    for(var i = 0, len = lines.length; i < len; i++) {
      var line = lines[i];
      if (!line) continue;

      var text = line.textContent;
      if (!reqReg.test(text)) continue;

      var child = line.querySelector('.pl-s');
      if (child) {
        elements.push(child);
      }
    }

    return elements;
  }

  function getImportElements () {
    return [];
  }

  function isEmptyDependencyNode (node) {
    return node.innerText.match(/\{\s*\}/);
  }

  function isStartDependencyNode (node, name) {
    var pl = node.querySelector('.pl-s');
    if (!pl) return false;

    return pl.innerText.indexOf(name) !== -1;
  }

  function isEndDependencyNode (node) {
    return node.innerText.indexOf("}") !== -1;
  }

}());

// vim: set et sw=2 sts=2 ts=2 :
