var minPassLength = 2;
var maxPassLen = 254;
var MaxIdenticalChars = 3;
var PasswordLenthStrength = 25;
var PasswordTotalStrength = 78;
var PasswordLetterStrength = 20;
var PasswordNumberStrength = 20;
var PasswordCharacterStrength = 10;
var PasswordBonuStrength = 3;
var PasswordRule_Characters_Warning_1 = 'Χρησιμοποίηστε σύμβολα';
var PasswordRule_Characters_Warning_2 = 'Χρησιμοποίηστε περισσότερα σύμβολα';
var PasswordRule_Length_Fatal = 'Ο κωδικός πρέπει να είναι μεγαλύτερος απο {0} και μικρότερος από {1} χαρακτήρες';
var PasswordRule_Length_Warning = ' Χρησιμοποίηστε μεγαλύτερο κωδικό';
var PasswordRule_Letters_Warning_1 = 'Χρησιμοποίηστε γράμματα';
var PasswordRule_Letters_Warning_2 = 'Χρησιμοποίηστε πεζά και κεφαλαία γράμματα';
var PasswordRule_Numbers_Warning_1 = 'Χρησιμοποίηστε αριθμούς';
var PasswordRule_Numbers_Warning_2 = 'Χρησιμοποίηστε περισσότερους αριθμούς';

function calculateStrength() {
    LowerCaseCharsCount = (password.match(/[a-zα-ωά-ώ]/g) || []).length;
    UpperCaseCharsCount = (password.match(/[A-ZΑ-ΩΆ-Ώ]/g) || []).length;
    DigitsCount = (password.match(/[0-9]/g) || []).length;
    SpecialCharsCount = (password.match(/[!,\@,#,$,%,^,&,*,?,_,~,(,),+,\-,/,\\,=,\|,\,,.,<,>,\[,\],{,},;,',:,",`]/g) || []).length;

    lengthStrength = password.length == 0 ? 0 : password.length < 5 ? 5 : password.length < 8 ? 10 : 25;

    lettersStrength = LowerCaseCharsCount == 0 && UpperCaseCharsCount == 0 ? 0 : LowerCaseCharsCount > 0 && UpperCaseCharsCount == 0 ? 10 : 20;

    numbersStrength = DigitsCount == 0 ? 0 : DigitsCount < 2 ? 10 : 20;

    specialCharStrength = SpecialCharsCount == 0 ? 0 : SpecialCharsCount < 2 ? 10 : 25;

    strengthCombination = LowerCaseCharsCount > 0 && UpperCaseCharsCount > 0 && SpecialCharsCount > 0 && DigitsCount > 0
        ? 5
        : (LowerCaseCharsCount > 0 || UpperCaseCharsCount > 0) && DigitsCount > 0 && SpecialCharsCount > 0
            ? 3
            : (LowerCaseCharsCount > 0 || UpperCaseCharsCount > 0) && DigitsCount > 0
                ? 2
                : 0;

    totalStrength = lengthStrength + lettersStrength + numbersStrength + specialCharStrength + strengthCombination;

    totalStrengthPercent = Math.ceil(totalStrength * 94 / PasswordTotalStrength);
}

function displayStrength() {

    $('#strength-bar').width(totalStrengthPercent + '%');

    if (totalStrength < 50) {
        if ($('#strength-bar').hasClass('bg-warning')) {
            $('#strength-bar').removeClass('bg-warning');
        }
        if ($('#strength-bar').hasClass('bg-success')) {
            $('#strength-bar').removeClass('bg-success')
        }
        if (!$('#strength-bar').hasClass('bg-danger')) {
            $('#strength-bar').addClass('bg-danger')
        }
    }
    else if (totalStrength < 100) {
        if ($('#strength-bar').hasClass('bg-danger')) {
            $('#strength-bar').removeClass('bg-danger');
        }
        if ($('#strength-bar').hasClass('bg-success')) {
            $('#strength-bar').removeClass('bg-success')
        }
        if (!$('#strength-bar').hasClass('bg-warning')) {
            $('#strength-bar').addClass('bg-warning')
        }
    }
    else {
        if ($('#strength-bar').hasClass('bg-danger')) {
            $('#strength-bar').removeClass('bg-danger');
        }
        if ($('#strength-bar').hasClass('bg-warning')) {
            $('#strength-bar').removeClass('bg-warning')
        }
        if (!$('#strength-bar').hasClass('bg-success')) {
            $('#strength-bar').addClass('bg-success')
        }
    }

    var label = '';

    if (totalStrength < 25) label = 'Very Weak'
    else if (totalStrength < 50) label = 'Weak'
    else if (totalStrength < 60) label = 'Good'
    else if (totalStrength < 70) label = 'Strong'
    else if (totalStrength < 80) label = 'Very Strong'
    else if (totalStrength < 90) label = 'Secure'
    else label = 'Very Secure';

    $('#strength-bar').text(label);
}

function setButtonState() {
    if (password.length >= minPassLength && password.length <= maxPassLen && totalStrength >= PasswordTotalStrength) {
        $('button[type = "submit"]').removeAttr('disabled');

        if (!$('button[type = "submit"]').hasClass('btn-primary')) {
            $('button[type = "submit"]').addClass('btn-primary');
        }
    } else {
        $('button[type = "submit"]').attr('disabled', 'disabled');

        if ($('button[type = "submit"]').hasClass('btn-primary')) {
            $('button[type = "submit"]').removeClass('btn-primary');
        }
    }
}

function passwordStrength(Password) {
    password = Password;
    calculateStrength();
    displayStrength();
    setButtonState();
}

function addMessagesToDialog(item, index) {
    $('#message-container').append('<li>' + item + '</li>');
}

jQuery(document).ready(function () {
    var totalStrength = 0;

    $('button[type = "submit"]').attr('disabled', 'disabled');
    $('button[type = "submit"]').removeClass('btn-primary');

    jQuery("#NewPassword").keyup(function () {
        passwordStrength(jQuery(this).val());
    });

    $('#NewPassword').focusout(function () {
        var password = $(this).val();

        calculateStrength();

        var messages = [];

        if (password.length == 0) {
            return;
        }

        if (totalStrength < PasswordTotalStrength || password.length < minPassLength || pass.length > maxPassLen) {
            if (password.length < minPassLength || password.length > maxPassLen) {
                messages.push(PasswordRule_Length_Fatal.replace('{0}', minPassLength).replace('{1}', maxPassLen));
            }

            //PasswordCharactersRule
            if (SpecialCharsCount == 0) {
                messages.push(PasswordRule_Characters_Warning_1);
            } else if (SpecialCharsCount == 1) {
                messages.push(PasswordRule_Characters_Warning_2);
            }

            //PasswordLengthRule
            if (lengthStrength <= 5) {
                messages.push(PasswordRule_Length_Warning);
            } else if (lengthStrength <= 10) {
                messages.push(PasswordRule_Length_Warning);
            }

            //PasswordLettersRule
            if (UpperCaseCharsCount + LowerCaseCharsCount == 0) {
                messages.push(PasswordRule_Letters_Warning_1);
            } else if (UpperCaseCharsCount == 0 || LowerCaseCharsCount == 0) {
                messages.push(PasswordRule_Letters_Warning_2);
            }

            //PasswordNumbersRule
            if (DigitsCount == 0) {
                messages.push(PasswordRule_Numbers_Warning_1);
            } else if (UpperCaseCharsCount <= 2) {
                messages.push(PasswordRule_Numbers_Warning_2);
            }
        }

        if (messages.length > 0) {
            showDialog = true;

            $('.dlg-content').html('');
            $('.dlg-content').append('<p></p><h3 class="fa fa-exclamation-circle"></h3><ul id="message-container"></ul>');

            messages.forEach(addMessagesToDialog);
            $('.dlg-content').append('<p></p>');

            $("#MsgSticky").modal();
        }
    });

    setTimeout(function () { passwordStrength($("#NewPassword").val()); }, 500);
});