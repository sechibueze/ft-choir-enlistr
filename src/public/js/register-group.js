const team = document.querySelector('select[name="team"]');
const teamSize = 52;
for (let ii = 1; ii < teamSize; ii++) {
  let option = document.createElement('option');
  option.setAttribute('value', ii);
  option.innerText = `Group ${ii}`;
  team.appendChild(option);

}