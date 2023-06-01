document.addEventListener('DOMContentLoaded', function () {
    var cardContainer = document.getElementById('card-container');
    var loader = document.getElementById('loader');
    var ttargets = document.getElementById('totalTargets');
    var ttscan = document.getElementById('totalScan');
    var ttchange = document.getElementById('totalchange');
    var ttAlert = document.getElementById('totalalert');

    // Show the loader
    loader.style.display = 'block';
    fetch("/target/allscan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then(function (data) {
            console.log(data.message);
            loader.style.display = 'none';
            ttargets.textContent = data.data.targetCount;
            ttscan.textContent = data.data.result.length;
            ttchange.textContent = data.data.changeCount;
            ttAlert.textContent = data.data.changeCount;
            data.data.result.forEach(function (item) {
                var card = document.createElement('div');
                card.classList.add('col-md-12', 'card', 'card-wrapper');

                card.onclick = function () {
                    console.log(item);
                };

                var cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                var cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = item.name;

                ttargets.classList.add('font-weight-bold');
                ttscan.classList.add('font-weight-bold');
                ttchange.classList.add('font-weight-bold');
                ttAlert.classList.add('font-weight-bold');
                //
                var cardButtons = document.createElement('div');
                cardButtons.classList.add('card-buttons');
                //




                var button1 = document.createElement('button');
                var button2 = document.createElement('button');
                var button3 = document.createElement('button');
                button1.classList.add('btn', 'btn-primary', 'btn-block', 'scrn');
                button1.textContent = 'Screenshot';
                button2.classList.add('btn', 'btn-warning', 'btn-block');
                button2.textContent = 'Set as safe';
                button3.classList.add('btn', 'btn-danger', 'btn-block');
                button3.textContent = 'Delete';


                var cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = item.url;

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);

                button3.addEventListener('click', async function () {
                    let formData = { id: item._id };
                    fetch('/target/destroy', {
                        method: "POST",
                        body: JSON.stringify(formData),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            if (data.result) {
                                card.remove();
                            }
                            else {
                                alert(data.message)
                            }
                        })
                        .catch(function (error) {
                            alert('Error:', error);
                        });
                });

                button2.addEventListener('click', async function () {
                    loader.style.display = 'block';
                    let formData = { id: item._id, url: item.url };
                    fetch('/target/safe', {
                        method: "POST",
                        body: JSON.stringify(formData),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            if (data.result) {
                                card.classList.remove('isSafe-false');
                                window.location.reload();
                            }
                            else {
                                alert(data.message)
                            }
                        })
                        .catch(function (error) {
                            alert('Error:', error);
                        });
                    loader.style.display = 'none';
                });

                button1.addEventListener('click', async function () {
                    var modalImage = document.getElementById('modalImage');
                    var card = button1.closest('.card');
                    var cardLoader = document.createElement('div');
                    cardLoader.classList.add('loader');
                    cardLoader.classList.add('card-loader');
                    button1.style.display = 'none';
                    cardLoader.style.display = 'block';
                    card.appendChild(cardLoader);
                    $('#imageModal').modal('show');
                    let formData = { id: item._id, url: item.url };
                    fetch('/target/onescreen', {
                        method: "POST",
                        body: JSON.stringify(formData),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            if (data.result) {
                                modalImage.src = data.data;
                                button1.style.display = 'inline-block';
                                cardLoader.remove();
                            }
                            else {
                                alert('Not Screenshoted yet')
                                button1.style.display = 'inline-block';
                                cardLoader.remove();
                            }
                        })
                        .catch(function (error) {
                            alert('Error:', error);
                            button1.style.display = 'inline-block';
                            cardLoader.remove();
                        });
                    //
                });

                cardButtons.appendChild(button1);
                cardButtons.appendChild(button3);

                card.appendChild(cardBody);
                cardContainer.appendChild(card);

                var cardFooter = document.createElement('div');
                cardFooter.classList.add('card-header', 'mb-5');

                if (!item.isSafe) {
                    card.classList.add('isSafe-false');
                    cardButtons.appendChild(button2);
                }
                cardFooter.appendChild(cardButtons);
                card.appendChild(cardFooter);
            });
        })
        .catch(function (error) {
            console.log("Error:", error);
            loader.style.display = 'none';
        });

});

