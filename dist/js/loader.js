function loader(showLoader) {
    let loaderEle = document.getElementById('loader');
    console.log(loaderEle);
    if(showLoader){
        loaderEle.setAttribute('style', 'display: block');
    }
    else {
        loaderEle.setAttribute('style', 'display: none');
    }
}
