const responseDiv = document.getElementById("response");
const historialDiv = document.getElementById("historial");
const searchInput = document.getElementById('word');
const searchButton = document.getElementById('btnSearch');
let hide = false;

function checkInput() {
    if (searchInput.value.trim() === '') {
        searchButton.disabled = true;
    } else {
        searchButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    checkInput();
    searchInput.addEventListener('input', checkInput);
});

document.getElementById('btnSearch').addEventListener('click', function() {
    const url = "https://en.wikipedia.org/w/api.php";
    const searchWord = searchInput.value;

    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: searchWord,
        format: "json",
        origin: "*"
    });
    
    fetch(`${url}?${params}`)
        .then(function(response){
            return response.json();
        })
        .then(function(response) {
            const responseList = response.query.search;

            responseDiv.innerHTML = "";
            
            if (responseList.length > 0) {
                const ul = document.createElement('ul');
                ul.style.listStyle = 'none';

                responseList.forEach(res => {
                    const li = document.createElement('li');
                    li.style.borderStyle = 'solid';
                    li.style.padding = '10px';
                    li.style.borderRadius = '10px';
                    li.style.marginBottom = '10px';
                    
                    const title = document.createElement('h3');
                    title.innerHTML = `<a href="https://en.wikipedia.org/?curid=${res.pageid}" target="_blank">${res.title}</a>`;
                    li.appendChild(title);

                    const text = document.createElement('p');
                    text.innerHTML = res.snippet;
                    li.appendChild(text);

                    ul.appendChild(li);
                });
                responseDiv.appendChild(ul);
            } else {
                responseDiv.innerHTML = '<p>No se han encontrado resultados</p>';
            }
            saveHistorical(searchWord, responseList.length);

        })
        .catch(function(error){
            console.log(error);
            responseDiv.innerText = "Ha habido un error: " + error;
        });
});

function saveHistorical(search, numResults) {
    data = { search: search, num: numResults };

    fetch('./php/addToDB.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        return response.json();
      })
      .then(response => {
        //console.log(response);
      })
      .catch(error => {
        console.log("Ha habido un error: " + error);
      })
}

document.getElementById('btnHistorial').addEventListener('click', function() {

    if(!hide) {
        hide = true;

        fetch('./php/getDB.php')
        .then(response => {
            return response.json();
        })
        .then(response => {
            historialDiv.innerHTML = "";
                
            if (response.length > 0) {
                const ul = document.createElement('ul');
                ul.style.listStyle = 'none';
                ul.style.width = '40%';

                response.forEach(res => {
                    const li = document.createElement('li');
                    li.style.borderStyle = 'solid';
                    li.style.padding = '10px';
                    li.style.borderRadius = '10px';
                    li.style.marginBottom = '10px';
                        
                    const search = document.createElement('h4');
                    search.innerHTML = res.search + ': ' + res.timestamp;
                    li.appendChild(search);

                    const num = document.createElement('p');
                    num.innerHTML = 'Número de resultados: ' + res.numResults;
                    li.appendChild(num);

                    ul.appendChild(li);
                });
                historialDiv.appendChild(ul);
            } else {
                historialDiv.innerHTML = '<p>Historial vacío</p>';
            }
        }) 
        .catch(error => {
            historialDiv.innerHTML = 'Ha habido un error: ' + error;
        });
    } else {
        historialDiv.innerHTML = "";
        hide = false;
    }
});