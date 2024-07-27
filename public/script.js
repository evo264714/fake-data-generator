document.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("region");
  const seedValueInput = document.getElementById("seedValue");
  const errorSlider = document.getElementById("errorSlider");
  const errorNumber = document.getElementById("errorNumber");
  const randomSeedButton = document.getElementById("randomSeed");
  const restoreSeedButton = document.getElementById("restoreSeed");
  const exportCSVButton = document.getElementById("exportCSV");
  const dataTableBody = document.querySelector("#dataTable tbody");
  const loader = document.getElementById("loader");

  let seed = Math.floor(Math.random() * 1000000);
  let region = "usa";
  let errors = 0;
  let page = 1;
  let fetching = false;
  const seedHistory = [];

  function fetchData() {
    if (fetching) return;
    fetching = true;
    loader.style.display = "block";
    fetch(
      `/generate?seed=${seed}&region=${region}&errors=${errors}&page=${page}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        loader.style.display = "none";
        fetching = false;
        data.forEach((record) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${record.index}</td>
                        <td>${record.id}</td>
                        <td>${record.name}</td>
                        <td>${record.address}</td>
                        <td>${record.phone}</td>
                    `;
          dataTableBody.appendChild(row);
        });
        page++;
      })
      .catch((error) => {
        loader.style.display = "none";
        fetching = false;
        console.error("Fetch error:", error);
      });
  }

  function updateData() {
    dataTableBody.innerHTML = "";
    page = 1;
    fetchData();
  }

  regionSelect.addEventListener("change", (e) => {
    region = e.target.value;
    updateData();
  });

  seedValueInput.addEventListener("input", (e) => {
    seed = parseInt(e.target.value, 10) || Math.floor(Math.random() * 1000000);
    updateData();
  });

  randomSeedButton.addEventListener("click", () => {
    seedHistory.push(seed); 
    seed = Math.floor(Math.random() * 1000000);
    seedValueInput.value = seed;
    updateData();
  });

  restoreSeedButton.addEventListener("click", () => {
    if (seedHistory.length > 0) {
      seed = seedHistory.pop(); 
      seedValueInput.value = seed;
      updateData();
    } else {
      alert("No previous seed to restore.");
    }
  });

  errorSlider.addEventListener("input", (e) => {
    errors = parseInt(e.target.value, 10);
    errorNumber.value = errors;
    updateData();
  });

  errorNumber.addEventListener("input", (e) => {
    errors = parseInt(e.target.value, 10);
    errorSlider.value = errors;
    updateData();
  });

  exportCSVButton.addEventListener("click", () => {
    fetch(
      `/export?seed=${seed}&region=${region}&errors=${errors}&pages=${page - 1}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "data.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Export error:", error);
      });
  });

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !fetching
    ) {
      fetchData();
    }
  });

  updateData();
});
