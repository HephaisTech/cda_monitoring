
function createImage(src, name) {
    var img = document.createElement('img');
    img.src = src;
    var container = document.createElement('div');
    container.classList.add('image-container');
    var caption = document.createElement('h2');
    caption.textContent = name;
    container.appendChild(caption);
    container.appendChild(img);
    return container;
}

function fetchAndDisplayImages() {
    var column1 = document.getElementById('column1');
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    fetch('/target/screenshot', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            column1.innerHTML = '';
            if (data.result) {
                data.data.forEach(function (imageUrl, index) {
                    var image = createImage(imageUrl, imageUrl.split('/').pop());
                    column1.appendChild(image);
                });
            }
            loader.style.display = 'none';
        })
        .catch(function (error) {
            console.log('Error:', error);
            loader.style.display = 'none';
        });
}

fetchAndDisplayImages();

setInterval(fetchAndDisplayImages, 10 * 60 * 1000);

function toggleTargetFormat() {
    $('#TargetModal').modal('show');
}

$('#AddTargetForm').submit(async function (event) {
    event.preventDefault();
    var formData = {
        name: $("#tgName").val(),
        url: $("#targetURL").val(),
    };
    await fetch("/target/new", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(result => {
            if (result.result) {
                swal({
                    content: {
                        element: "p",
                        attributes: {
                            innerText: "Added with sucess",
                            style: "color: black;",
                            className: "p",
                        },

                    },
                });
            } else {
                alert(result.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    this.reset();
});