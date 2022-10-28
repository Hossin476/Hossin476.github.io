const eye1 = document.querySelector(' .eye1');
const disable1 = document.querySelector('.disable1');
const eye = document.querySelector(' .eye');
const disable = document.querySelector('.disable');
const pass = document.querySelector('.password');
const conf = document.querySelector('.con');

eye1.addEventListener('click', () => {
    if (pass.getAttribute('type') === 'password') {
        pass.setAttribute('type', 'text')
    }
    eye1.style.display = 'none';
    disable1.style.display = 'block'
});


disable1.addEventListener('click', () => {
    if (pass.getAttribute('type') === 'text') {
        pass.setAttribute('type', 'password')
    }
    eye1.style.display = 'block';
    disable1.style.display = 'none'
});


eye.addEventListener('click', () => {
    if (conf.getAttribute('type') === 'password') {
        conf.setAttribute('type', 'text')
    }
    eye.style.display = 'none';
    disable.style.display = 'block'
});

disable.addEventListener('click', () => {
    if (conf.getAttribute('type') === 'text') {
        conf.setAttribute('type', 'password')
    }
    eye.style.display = 'block';
    disable.style.display = 'none'
});