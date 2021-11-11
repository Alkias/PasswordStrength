var tests = [
    {
        name: 'LengthTest',
        description: 'Is the password longer than 11 characters?',
        cb: function (val) {
            var len = val.length;
            var lenStrength = 0;
            var points = 0;

            function calculateLengthStrength() {
                if (len <= 4)
                    lenStrength = 0;
                if (len > 4 && len <= 7)
                    lenStrength = 1;
                if (len > 7)
                    lenStrength = 2;
            } calculateLengthStrength();

            function calculateStrength(val) {
                var ret = 0;
                if (val == 0) ret += 5;
                if (val == 1) ret += 10;
                if (val == 2) ret += 25;
                return ret;
            }
            points = calculateStrength(lenStrength);
            return points;
        }
    },
    {
        name: 'LetterTest',
        description: 'Is the password longer than 11 characters?',
        cb: function (val) {
            var upper = 0;
            var lower = 0;
            var letterStrength = 0;
            var points = 0;

            //latin upper
            upper += (val.match(/[A-Z]/g) || []).length;
            //greek upper
            upper += (val.match(/[Α-Ω]/g) || []).length;
            //latin lower
            lower += (val.match(/[a-z]/g) || []).length;
            //greek lower
            lower += (val.match(/[α-ω]/g) || []).length;

            function calculateLetterStrength() {
                if ((upper + lower) == 0)
                    letterStrength = 0;
                else if (lower == 0 || upper == 0)
                    letterStrength = 1;
                else
                    letterStrength = 2;
            } calculateLetterStrength();

            function calculateStrength(val) {
                var ret = 0;
                if (val == 1) ret += 10;
                if (val == 2) ret += 20;
                return ret;
            }

            points = calculateStrength(letterStrength);
            return points;
        }
    },
    {
        name: 'NumberTest',
        description: 'Is the password longer than 11 characters?',
        cb: function (val) {
            var points = 0;
            var digitsStrength = 0;
            var digits = (val.match(/\d/g) || []).length;

            function calculateNumberStrength() {
                switch (true) {
                    case (digits == 1 || digits == 2):
                        digitsStrength = 1;
                        break;
                    case (digits > 2):
                        digitsStrength = 2;
                        break;
                };
            } calculateNumberStrength();

            function calculateStrength(val) {
                var ret = 0;
                if (val == 1) ret += 10;
                if (val == 2) ret += 20;
                return ret;
            }

            points = calculateStrength(digitsStrength);

            return points;
        }
    },
    {
        name: 'SpecialTest',
        description: 'Is the password longer than 11 characters?',
        cb: function (val) {
            var other = 0;
            var specialStrength = 0;
            var points = 0;

            other = (val.match(/\W/gu) || []).length;

            function calculateSpecialStrength() {
                if (other == 0) specialStrength = 0;
                else if (other == 1) specialStrength = 1;
                else if (other > 1) specialStrength = 2;
            } calculateSpecialStrength();

            function calculateStrength(val) {
                var ret = 0;
                if (val == 1) ret += 10;
                if (val == 2) ret += 25;
                return ret;
            }

            points = calculateStrength(specialStrength);
            return points;
        }
    },
    {
        name: 'CombinationTest',
        description: 'Is the password longer than 11 characters?',
        cb: function (val) {
            var upper = 0;
            var lower = 0;
            var other = 0;
            var num = 0;
            var combinationStrength = 0;
            var points = 0;

            var latinUper = (val.match(/[A-Z]/g) || []).length;
            var greekUper = (val.match(/[Α-Ω]/g) || []).length;
            var latinLower = (val.match(/[a-z]/g) || []).length;
            var greekLower = (val.match(/[α-ω]/g) || []).length;
            var digits = (val.match(/[\d]/g) || []).length;
            other = (val.match(/\W/gu) || []).length;
            
            upper += latinUper + greekUper;
            lower += latinLower + greekLower;
            num += digits;

            if (other == 0) combinationStrength = 0;
            else if (
                other > 0 &&
                num > 0 &&
                ((upper > 0 && lower == 0) || (upper == 0 && lower > 0))
            ){
                combinationStrength = 1;
            }
            else combinationStrength = 2;

            function calculateStrength(val) {
                var ret = 0;
                if (val == 0) ret += 2;
                if (val == 1) ret += 3;
                if (val == 2) ret += 5;
                return ret;
            }

            points = calculateStrength(combinationStrength);
            return points;
        }
    },
];