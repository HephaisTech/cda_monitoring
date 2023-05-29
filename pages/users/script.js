function toggleTargetFormat() {
    $('#TargetModal').modal('show');
}
async function deleteUser(userid) {
    loader.style.display = 'block';
    let formdata = { id: userid };
    fetch('/users/delete', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata)
    })
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            alert(data.message);
            location.reload();
            loader.style.display = 'none';
        }).catch(function (error) {
            console.log('Error:', error);
            loader.style.display = 'none';
        });
}
function fetchAndDisplayUsers() {
    loader.style.display = 'block';
    fetch('/users/list', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.result) {
                var tableBody = document.querySelector('#usertable tbody');
                tableBody.innerHTML = '';
                //
                data.data.forEach(user => {
                    var row = tableBody.insertRow();

                    var emailCell = row.insertCell();
                    emailCell.textContent = user.email;


                    var activatedCell = row.insertCell();
                    activatedCell.textContent = user.role;

                    var button2 = document.createElement('button');
                    button2.classList.add('btn', 'btn-danger', 'btn-block');
                    button2.textContent = 'Delete';

                    button2.addEventListener('click', function () {
                        deleteUser(user._id);
                    });

                    var toggleCell = row.insertCell();
                    toggleCell.appendChild(button2)
                });
            }
            loader.style.display = 'none';
        })
        .catch(function (error) {
            console.log('Error:', error);
            loader.style.display = 'none';
        });
}

$('#AddTargetForm').submit(async function (event) {
    event.preventDefault();
    var formData = {
        email: $("#temail").val(),
        password: $("#tpassword").val(),
        username: $("#usernamer").val(),
    };
    await fetch("/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(result => {
            alert(result.error);
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    this.reset();
});


fetchAndDisplayUsers();