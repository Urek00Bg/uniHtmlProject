const topBtn = document.getElementById("backToTop");


window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};


topBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});