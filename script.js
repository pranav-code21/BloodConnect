// Blood Group Button Selection

function selectBloodGroup(group) {

    document.getElementById("bloodGroup").value = group;

    const buttons =
        document.querySelectorAll(".blood-btn");

    buttons.forEach(button => {
        button.classList.remove("selected");
    });

    buttons.forEach(button => {

        if (
            button.innerText === group ||
            button.innerText === group.replace("-", "−")
        ) {
            button.classList.add("selected");
        }

    });

}


// Find Donor

async function findDonor() {

    const blood = document.getElementById("bloodGroup").value;

    const location = document.getElementById("location").value
        .trim()
        .toLowerCase();

    const results = document.getElementById("results");

    results.innerHTML = "";

    if (blood === "" || location === "") {

        results.innerHTML =
            "<p>Please select blood group and enter location.</p>";

        return;
    }

    try {

        const response =
            await fetch("http://localhost:3000/donors");

        const donors =
            await response.json();

        const matchedDonors =
            donors.filter(donor =>
                donor.blood_group === blood &&
                donor.location.toLowerCase().includes(location)
            );

        if (matchedDonors.length === 0) {

            results.innerHTML =
                "<p>No matching donors found.</p>";

            return;
        }

        matchedDonors.forEach(donor => {

            results.innerHTML += `
                <div class="donor-card">

                    <h3>${donor.name}</h3>

                    <p>
                        <strong>Blood Group:</strong>
                        ${donor.blood_group}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${donor.location}
                    </p>

                    <p>
                        <strong>Contact:</strong>
                        ${donor.phone}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span class="${
                            donor.availability === "Available"
                                ? "available"
                                : "unavailable"
                        }">

                            ${donor.availability}

                        </span>
                    </p>

                    ${
                        donor.availability === "Available"

                        ? `
                            <a
                                href="tel:${donor.phone}"
                                class="btn primary"
                            >
                                Call Donor
                            </a>
                          `

                        : `
                            <p class="unavailable">
                                Currently Unavailable - Cannot Call
                            </p>
                          `
                    }

                </div>
            `;

        });

    } catch (error) {

        console.log(error);

        results.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}



// Donor Registration

document
    .getElementById("donorForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const blood_group =
            document.getElementById("donorBlood").value;

        const location =
            document.getElementById("donorLocation").value;

        const phone =
            document.getElementById("phone").value;

        const availability =
            document.getElementById("availability").value;

        const message =
            document.getElementById("registerMessage");

        try {

            const response =
                await fetch(
                    "http://localhost:3000/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body: new URLSearchParams({
                            name: name,
                            blood_group: blood_group,
                            location: location,
                            phone: phone,
                            availability: availability
                        })
                    }
                );

            if (response.ok) {

                message.innerText =
                    "Registration successful! Thank you for becoming a donor.";

                document
                    .getElementById("donorForm")
                    .reset();

            } else {

                const errorMessage =
                    await response.text();

                message.innerText =
                    errorMessage;
            }

        } catch (error) {

            console.log(error);

            message.innerText =
                "Unable to connect to server. Please try again.";
        }

    });



// Update Donor Availability

async function updateAvailability() {

    const phone =
        document.getElementById("updatePhone").value;

    const availability =
        document.getElementById("updateAvailability").value;

    const message =
        document.getElementById("availabilityMessage");

    if (phone === "") {

        message.innerText =
            "Please enter registered phone number.";

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:3000/update-availability",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: new URLSearchParams({
                        phone: phone,
                        availability: availability
                    })
                }
            );

        const result =
            await response.text();

        message.innerText =
            result;

    } catch (error) {

        console.log(error);

        message.innerText =
            "Unable to connect to server. Please try again.";
    }

}



// Emergency Blood Request

document
    .getElementById("requestForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const patient_name =
            document.getElementById("patientName").value;

        const blood_group =
            document.getElementById("requestBlood").value;

        const location =
            document.getElementById("requestLocation").value;

        const phone =
            document.getElementById("requestPhone").value;

        const urgency =
            document.getElementById("urgency").value;

        const message =
            document.getElementById("requestMessage");

        try {

            const response =
                await fetch(
                    "http://localhost:3000/emergency-request",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body: new URLSearchParams({
                            patient_name: patient_name,
                            blood_group: blood_group,
                            location: location,
                            phone: phone,
                            urgency: urgency
                        })
                    }
                );

            const result =
                await response.text();

            message.innerText =
                result;

            if (response.ok) {

                document
                    .getElementById("requestForm")
                    .reset();

            }

        } catch (error) {

            console.log(error);

            message.innerText =
                "Unable to connect to server. Please try again.";
        }

    });



// View Emergency Blood Requests

async function viewEmergencyRequests() {

    const results =
        document.getElementById("requestResults");

    results.innerHTML =
        "<p>Loading emergency requests...</p>";

    try {

        const response =
            await fetch(
                "http://localhost:3000/emergency-requests"
            );

        if (!response.ok) {

            results.innerHTML =
                "<p>Unable to load emergency requests.</p>";

            return;
        }

        const requests =
            await response.json();

        if (requests.length === 0) {

            results.innerHTML =
                "<p>No emergency blood requests found.</p>";

            return;
        }

        results.innerHTML = "";

        requests.forEach(request => {

            results.innerHTML += `

                <div class="donor-card">

                    <h3>
                        ${request.patient_name}
                    </h3>

                    <p>
                        <strong>Blood Group:</strong>
                        ${request.blood_group}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${request.location}
                    </p>

                    <p>
                        <strong>Contact:</strong>
                        ${request.phone}
                    </p>

                    <p>
                        <strong>Urgency:</strong>
                        ${request.urgency}
                    </p>

                    <p>
                        <strong>Request Date:</strong>
                        ${new Date(
                            request.request_date
                        ).toLocaleString()}
                    </p>

                </div>

            `;

        });

    } catch (error) {

        console.log(error);

        results.innerHTML =
            "<p>Unable to connect to server.</p>";
    }

}



// Dashboard

async function loadDashboard() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/dashboard-stats"
            );

        if (!response.ok) {

            throw new Error(
                "Dashboard data could not be loaded."
            );

        }

        const data =
            await response.json();


        // Blood Group Statistics

        const bloodGroupStats =
            document.getElementById("bloodGroupStats");

        bloodGroupStats.innerHTML = "";


        data.bloodGroups.forEach(item => {

            bloodGroupStats.innerHTML += `

                <div class="blood-stat">

                    <strong>
                        ${item.count}
                    </strong>

                    <span>
                        ${item.blood_group}
                    </span>

                </div>

            `;

        });


        // Location Chart

        const locationChart =
            document.getElementById("locationChart");

        locationChart.innerHTML = "";


        const canvas =
            document.createElement("canvas");

        locationChart.appendChild(canvas);


        new Chart(canvas, {

            type: "pie",

            data: {

                labels:
                    data.locations.map(
                        item => item.location
                    ),

                datasets: [{

                    data:
                        data.locations.map(
                            item => item.count
                        )

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    } catch (error) {

        console.log(error);

        document.getElementById(
            "bloodGroupStats"
        ).innerHTML =
            "<p>Unable to load dashboard data.</p>";

        document.getElementById(
            "locationChart"
        ).innerHTML =
            "<p>Unable to load chart.</p>";
    }

}


// Load Dashboard when page opens

document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);

