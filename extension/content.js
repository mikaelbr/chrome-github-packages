(function () {
  'use strict';

  var base = 'https://www.npmjs.org/package/';

  replaceModuleLinks();

  function replaceModuleLinks () {
    if(!isPackageJsonFile()) return;

    var packages = getPackageElements('dependencies');
    replacePackagesWithLinks(packages);

    var devPackages = getPackageElements('devDependencies');
    replacePackagesWithLinks(devPackages);

    var nameField = getNameField();

    if (nameField) {
      replacePackagesWithLinks(nameField.querySelectorAll('.s2'));
    }
  }

  function isPackageJsonFile () {
    var title = document.querySelector('.final-path');
    return (title.textContent === 'package.json');
  }

  function getNameField () {
    var nts = document.querySelectorAll('.nt');
    for(var i = 0, len = nts.length; i < len; i++) {
      var nt = nts[i];
      if (nt.innerText.indexOf("name") !== -1) {
        return nt.parentNode;
      }
    }
    return void 0;
  }

  function replacePackagesWithLinks(elements) {
    for(var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var a = createLink(elements[i]);
      el.innerHTML = "";
      el.appendChild(a);
    }
  }

  function createLink (el) {
    var text = el.textContent.replace(/"/g, '');
    var a = document.createElement('a');
    a.href = base + text;
    a.innerText = '"' + text + '"';
    a.title = "Go to NPM Module site for " + text;
    return a;
  }

  function getPackageElements (startName) {
    var lines = document.querySelectorAll('.line');
    var packageNodes = [];
    var insideScope = false;

    for(var i = 0, len = lines.length; i < len; i++) {
      var line = lines[i];
      if (!line) continue;

      if (isStartNode(line, startName)) {
        insideScope = true;
        continue;
      }

      if (!insideScope) continue;

      if (isEndNode(line)) {
        return packageNodes;
      }

      var child = line.querySelector('.nt');
      if (child) {
        packageNodes.push(child);
      }
    }

    return [];
  }

  function isStartNode(node, name) {
    var nt = node.querySelector('.nt');
    if (!nt) return false;

    return nt.innerText.indexOf(name) !== -1;
  }

  function isEndNode(node) {
    var nt = node.querySelector('.p');
    if (!nt) return false;

    return nt.innerText.indexOf("}") !== -1;
  }
}());