const cohortName = "2402-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohortName}/events`;

const state = { parties: [] };

const submit = document.getElementById("submit");
const partyList = document.getElementById("partyList");
const addPartyForm = document.getElementById("newPartyForm");
addPartyForm.addEventListener("submit", addParties);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  // event.preventDefault();
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.parties = data.data;
    console.log(data.data);
  } catch (error) {
    console.log(error);
  }
}

const renderParties = () => {
  // Clear the existing list content
  partyList.innerHTML = "";
  // Check if there are no parties and display a message
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Parties Listed</li>";
    return;
  }
  // Iterate over each party and create the list items
  state.parties.forEach((party) => {
    const createLi = document.createElement("li");
    createLi.innerHTML = `
          <h3>${party.name}</h3>
          <p>${party.description}</p>
          <p>${party.date}</p>
          <p>${party.location}</p>
          <button class="delete" id="${party.id}">Delete</button>
        `;
    // Add event listener for the delete button created above
    const deleteButton = createLi.querySelector(".delete");
    deleteButton.addEventListener("click", () => {
      const partyId = party.id;
      deleteParties(partyId);
      console.log(party.id);
    });
    partyList.appendChild(createLi);
  });
};

async function addParties(event) {
  event.preventDefault();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: addPartyForm.date.value,
        location: addPartyForm.location.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create party");
    }
    addPartyForm.name.value = '';
    addPartyForm.description.value = '';
    addPartyForm.date.value = '';
    addPartyForm.location.value = '';

    render();
  } catch (error) {
    console.log(error);
  }
}

async function deleteParties(partyId) {
  event.preventDefault();
  try {
    const response = await fetch(`${API_URL}/${partyId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to delete party");
    }
    render();
  } catch (error) {
    console.log(error);
  }
}
