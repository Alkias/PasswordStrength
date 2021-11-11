var tests = [
    {
      name: 'Size Matters',
      description: 'Is the password longer than 11 characters?',
      cb: function (val) {
        return (val.length > 11 ? true : false);
      }
    },
    {
      name: 'Groundhog',
      description: 'Does the password contain repeated characters (2 or more times)?',
      cb: function (val) {
        return (val.match(/(\w)\1{2,}/gi) ? false : true);
      }
    },
    {
      name: 'Homogeneity',
      //description: 'Is the password all the same kind of characters?',
      description: 'Ο Κωδικός πρέπει να περιέχει πεζά και κεφαλαία',
      cb: function (val) {
        return (val.match(/^([a-zα-ωά-ώ]+|[A-ZΑ-ΩΆ-Ώ]+)$/g) ? false : true);
      }
    },
    {
      name: 'Numbers',
      //description: 'Is the password all the same kind of characters?',
      description: 'Ο Κωδικός πρέπει να περιέχει αριθμούς',
      cb: function (val) {
        var test = (val.match(/(\D*\d){2,}/g) ? true : false);
        return test;
      }
    },
    /*  {
       name: 'Entropic',
       description: 'Might this password hard for you to remember?',
       cb: function (val) {
         return (val.match(/(\w\W)\1+/gi) ? false : true);
       }
     }, */
    {
      name: 'Special Characters',
      description: 'Ο κωδικός πρέπει να περιέχει ειδικούς χαρακτήρες',
      cd: function (val) {
        var test = (val.match(/(\W){2,}/giu) ? true : false);
        return test;
      }
    },
    {
      name: 'Dictionable',
      description: 'Is the password horrendously obvious?',
      cb: function (val) {
        return (badPasswords.indexOf(val) > -1 ? false : true);
      }
    },
    {
      name: 'Predictable',
      description: 'Does the password contain something horrendously obvious?',
      cb: function (val) {
        var i = 0,
          l = badPasswords.length;
        for (; i < l; i++) {
          if (val.indexOf(badPasswords[i]) > -1) {
            return false;
          }
        }
        return true;
      }
    }
  ];