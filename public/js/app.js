console.log('Client Side up and running');

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    if(document.querySelector('.covid-holder').style.display !== 'none'){
        document.querySelector('.covid-holder').style.display = 'none'
    }

    const country = document.querySelector('input').value;

    document.querySelector('.country-name').style.display = 'block';
    document.querySelector('.country-name').textContent = 'Loading for ' + country + '.....';
    document.querySelector('.spinner-border').style.display = 'flex';

    fetch('http://localhost:3000/covid?country=' + country).then((response) => {
        response.json().then((data) => {

            document.querySelector('.spinner-border').style.display = 'none';

            if(data.error) {
                document.querySelector('.country-name').textContent = data.error;
            } else {

                if(data.confirmed == 0 && data.deaths == 0 && data.recovered == 0){
                    document.querySelector('.country-name').textContent = 'Today\'s cases haven\'t been reported yet!';
                } else {
                    document.querySelector('.covid-holder').style.display = 'flex';
                    document.querySelector('.country-name').textContent = 'Data for ' + data.country;
                    document.querySelector("#confirmed").textContent = data.confirmed + ' confirmed';
                    document.querySelector("#deaths").textContent = data.deaths + ' deaths';
                    document.querySelector("#recovered").textContent = data.recovered + ' recovered';
                    document.querySelector("#active").textContent = data.active + ' active';
                    document.querySelectorAll("h6").forEach((h) => h.textContent = 'As of ' + new Date().toLocaleDateString() );
                }

                
                
            }
            
        });
    })
})