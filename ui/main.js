console.log('Loaded!');

// Change the text of the main-text
var element=document.getElementById('main-text');
element.innerHTML= 'New Value';

//move the image

var img=document.getElementById('madi');
img.onclick = function () {
    img.style.marginLeft = '100px';
};