
document.getElementById('buttonSearch').addEventListener('click', function() {
    const url = "https://en.wikipedia.org/w/api.php"; 

    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: document.getElementById("word").value,
        format: "json"
    });
    console.log(document.getElementById("word").value);
    
    fetch(`${url}?${params}`)
        .then(function(response){
            return response.json();
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        });
});