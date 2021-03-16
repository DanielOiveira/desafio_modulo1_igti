let allUsers = [];
let users = [];

let tabProfiles = null;
let userQuantity = 0;
let userStatic = null
let tabStatistics = null;

let search = null;
let btnSearch = null;

window.addEventListener('load', () => {

  tabProfiles = document.querySelector('#tabProfiles');
  userQuantity = document.querySelector('#userQuantity');
  userStatic = document.querySelector('#userStatic');
  tabStatistics = document.querySelector('#tabStatistics');

  search = document.querySelector('#search');
  search.addEventListener('keyup', (event) => searchUser(event));

  btnSearch = document.querySelector('#btnSearch');
  btnSearch.addEventListener('click', (event) => searchUser(event));

  fetchUsers();
});




async function fetchUsers() {
  const res = await fetch('http://localhost:3001/users');
  const json = await res.json();

  allUsers = json.map(user => {

    const { name, picture, dob, gender } = user;

    return {
      name: name.first + " " + name.last,
      picture: picture.thumbnail,
      age: dob.age,
      gender: gender
    }


  });
  console.log(allUsers);
  render();
}

function render() {
  createList();
  searchUser();
}

function createList() {

  userQuantity = users.length;
  let totalMales = 0;
  let totalFemales = 0;
  let ageSum = 0;
  let ageMedia = 0;

  users.sort((a, b) => a.name.localeCompare(b.name));

  let usersList = null;
  let statsList = null;

  if (userQuantity === 0) {
    usersList = `<h5>Nenhum usuário filtrado</h5>`;
    statsList = `<h5>Nada encontrado</h5`;
  } else {
    usersList = `
    <h5 class="section-title">${userQuantity} usuário(s) encontrados</h5>
    <ul class="users-list">
    `;

    statsList = `
    <h5 class="section-title">Estatisticas</h5>
    <ul class="stats-list">
  `;
  }

  users.forEach((user) => {
    const { age, gender, name, picture } = user;

    if (gender.toLowerCase() === 'male') {
      totalMales += 1;
    }
    if (gender.toLowerCase() === 'female') {
      totalFemales += 1;
    }

    ageSum += age;

    let profileHTML = `
      <li class="user-item">
        <img src="${picture}">
        <span>${name},</span>
        <span>${age} anos</span>
      </li>
    `;

    usersList += profileHTML;
  });

  if (users.length > 0) {
    ageMedia = ageSum / users.length;
  }

  let statsItem = `
    <li><strong>Sexo Masculino:</strong>${totalMales}</li>
    <li><strong>Sexo Feminino:</strong> ${totalFemales}</li>
    <li><strong>Soma das idades:</strong> ${ageSum}</li>
    <li><strong>Média das idades:</strong> ${Math.floor(
    ageMedia
  )}</li>
  `;

  statsList += statsItem;

  tabProfiles.innerHTML = usersList;
  tabStatistics.innerHTML = statsList;

}

function searchUser(event) {
  if (event.target.id === 'btnSearch') {
    const data = event.target.previousElementSibling.value;
    if (data) {
      filterUsers(data);
    }
  }

  if (event.target.id === 'btnSearch') {
    const data = event.target.value;
    if (event.key === 'Enter' && data) {
      filterUsers(data);
    }
  }

}

function filterUsers(data) {

  users = [];
  allUsers.forEach((user) => {
    const { age, gender, name, picture } = user;
    if (name.toLowerCase().includes(data.toLowerCase())) {
      let userSearch = user;
      users = [...users, userSearch];
    }
  });

  createList();
}


