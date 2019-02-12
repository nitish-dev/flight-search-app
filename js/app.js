//console.log("I am working");
class From {
    constructor(origin, destination, departureDate, returnDate, passengers) {
        this.origin = origin;
        this.destination = destination;
        this.departureDate = departureDate;
        this.returnDate = returnDate;
        this.passengers = passengers;
    }
}

//function to show trip type
const showtripType = (el) => {
    if (document.getElementById('twoWays').checked) {
        document.getElementById(el).style.display = "block";

    }
}

//function to hide trip type
const hidetripType = (el) => {
    if (document.getElementById('oneWays').checked) {
        document.getElementById(el).style.display = "none";
    }
}

//show alerts
const showAlerts = (msg, className) => {
    const div = document.createElement("div");
    div.classList = `col-12 mt-4 alert alert-${className}`;
    const text = document.createTextNode(msg);
    div.appendChild(text);
    const container = document.getElementById("error");
    container.appendChild(div);
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
}

//clear fields
const clearFields = () => {
    document.getElementById("originCity").value = '';
    document.getElementById("destinationCity").value = '';
    document.getElementById("departureDate").value = '';
    document.getElementById("returnDate").value = '';
    document.getElementById("passengers").value = '';
}

//fetch data
function fetchJson(form) {
    fetch('js/data.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.log(data);
            renderHTML(data, form);
        })
        .catch(err => {
            console.log(err);
        });
}

//render html
function renderHTML(data, form) {
    // console.log(data.length);

    const container = document.querySelector("#result");

    //loop though data
    data.forEach(el => {
        if (el.from.toLowerCase().indexOf(form.origin.toLowerCase()) > -1 && el.to.toLowerCase().indexOf(form.destination.toLowerCase()) > -1) {

            const div = document.createElement("div");
            div.classList = "card mt-2";

            //check if two way option visible
        if (form.returnDate === '') {
            div.innerHTML =
                `
            <div class="card-body">
            <h3>Rs. ${el.price}</h3>
            <div class="row">
                <div class="col-8">
                <small>${el.number}</small>
                <h5>${el.from_code} > ${el.to_code}</h5>
                <p class="mb-0"><strong>Depart</strong>: ${el.depart_time}</p>
                <p class="mb-0"><strong>Arrive</strong>: ${el.arrive_time}</p>
                </div>
                <div class="col-4 text-right">
                    <a href="" class="btn btn-block btn-primary">Book this flight</a>
                </div>
            </div>
            </div>
            `;
        }else{
            div.innerHTML =
                `
            <div class="card-body">
            <h3>Rs. ${el.price + el.return_trip.price} </h3>
            <div class="row">
                <div class="col-8">
                <div class="row">
                <div class="col-6">
                <small>${el.number}</small>
                <h5>${el.from_code} > ${el.to_code}</h5>
                <p class="mb-0"><strong>Depart</strong>: ${el.depart_time}</p>
                <p class="mb-0"><strong>Arrive</strong>: ${el.arrive_time}</p>
                </div>
                <div class="col-6">
                <small>${el.return_trip.number}</small>
                <h5>${el.return_trip.from_code} > ${el.return_trip.to_code}</h5>
                <p class="mb-0"><strong>Depart</strong>: ${el.return_trip.depart_time}</p>
                <p class="mb-0"><strong>Arrive</strong>: ${el.return_trip.arrive_time}</p>
                </div>
                </div>
                </div>
                <div class="col-4 text-right">
                    <a href="" class="btn btn-block btn-primary">Book this flight</a>
                </div>
            </div>
            </div>
            `;
        }
            container.appendChild(div);
        }
    });

    //no found
    if (container.innerHTML == '') {
        const alert = document.createElement("div");
        alert.classList = "col-12 mt-4 alert alert-warning";
        const msg = document.createTextNode("No flight found");
        alert.appendChild(msg);
        container.appendChild(alert);
    }
}

//render header
function renderHeader(form) {
    const div = document.createElement("div");
    const container = document.querySelector("#header");
    div.classList = "col bg-light pt-3 pb-1";
    

    //check if two way option visible
    if (form.returnDate === '') {
        div.innerHTML =
            `
    <div class="row">
    <div class="col-6"><h5><span class="capitalize">${form.origin}</span> > <span class="capitalize">${form.destination}</span></h5></div>
    <div class="col-6 text-right"><span><strong>Depart:</strong> ${form.departureDate}</span></div>
    </div>`;

    } else {

        div.innerHTML =
            `
<div class="row">
<div class="col-6"><h5><span class="capitalize">${form.origin}</span> > <span class="capitalize">${form.destination}</span> > <span class="capitalize">${form.origin}</span></h5></div>
<div class="col-6 text-right"><span><strong>Depart:</strong> ${form.departureDate}</span>||<span><strong>Return:</strong> ${form.returnDate}</span></div>
</div>`;
    }

    container.appendChild(div);
}

//Event: 
const form = document.getElementById("flightSearch");
form.addEventListener("submit", (e) => {

    //prevent actual submit
    e.preventDefault();

    //get form value
    const origin = document.getElementById("originCity").value;
    const destination = document.getElementById("destinationCity").value;
    const departureDate = document.getElementById("departureDate").value;
    const returnDate = document.getElementById("returnDate").value;
    const passengers = document.getElementById("passengers").value;
    const result = document.querySelector("#result").innerHTML = '';
    const header = document.querySelector("#header").innerHTML = '';
    
    //validate form
    if (origin === "" || destination === "") {
        //show alerts
        showAlerts("Please enter Origin city and destination city.", "danger")
    } else {

        //Instatiate FORM
        const form = new From(origin, destination, departureDate, returnDate, passengers);

        //renderHeader
        renderHeader(form);


        //fetch data
        fetchJson(form);

        //clear fields
        clearFields();
    }

});
