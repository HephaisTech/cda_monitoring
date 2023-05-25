function checkCookie() {
    fetch("/auth/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(result => {
            if (!result.result) {
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });


    if (document.cookie == false) {
        $('#x').text("No Cookie.");
        window.location.href = "http://www.totallytotallyamazing.com/jsFiddle/cookie/indexNoAlert.html";
    } else if (document.cookie.indexOf("expires") >= 0) {
        $('#x').text("You have Cookie.");
    }
}