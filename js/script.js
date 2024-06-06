
document.getElementById('btnSearch').addEventListener('click', function() {
    const url = "https://en.wikipedia.org/w/api.php";
    const responseDiv = document.getElementById("response");
    const searchWord = document.getElementById("word").value;

    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: searchWord,
        format: "json",
        origin: "*"
    });
    console.log(document.getElementById("word").value);
    
    fetch(`${url}?${params}`)
        .then(function(response){
            return response.json();
        })
        .then(function(response) {
            const responseList = response.query.search;

            responseDiv.innerHTML = "";
            
            if (responseList.length > 0) {
                const ul = document.createElement('ul');
                responseList.forEach(res => {
                    const li = document.createElement('li');
                    
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
      .then(response => response.text())
      .then(response => console.log(response))
      .catch(error => console.error('Ha habido un error:', error));
}