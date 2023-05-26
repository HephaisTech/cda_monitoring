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
                button1.classList.add('btn', 'btn-primary', 'btn-block');
                button1.textContent = 'Scan this';
                button2.classList.add('btn', 'btn-warning', 'btn-block');
                button2.textContent = 'Set as safe';


                var cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = item.url;

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardButtons.appendChild(button1);

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
