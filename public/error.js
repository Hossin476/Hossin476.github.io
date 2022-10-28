//password confirmation
const password = document.querySelector('.password');
const confirmPass = document.querySelector('.con');

function confirmation(e) {
    if (confirmPass.value === '') {
        confirmPass.style.border = "1px solid black";
    } else if (password.value === confirmPass.value) {
        confirmPass.style.border = "1.5px solid green";
    } else if (password.value !== confirmPass.value) {
        confirmPass.style.border = "1.5px solid red";
    }
};
//password length
function Length() {
    if (password.value === '') {
        password.style.border = "1px solid black";
    } else if (password.value.length < 8) {
        password.style.border = "1px solid red";
    } else if (password.value.length >= 8) {
        password.style.border = "1px solid green";
    }
};