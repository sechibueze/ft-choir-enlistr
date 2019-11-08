const toggleShowClass = (e) => {
  const contentDiv = document.querySelector('.content');
  // if (adminSideBar.classList.contains('show')) {
  contentDiv.classList.toggle('show');
  // }
};
const collapseSidebar = (e) => {
  const contentDiv = document.querySelector('.content');
  if (contentDiv.classList.contains('show')) {
    contentDiv.classList.remove('show');
  }
};
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', collapseSidebar);

const dashHamburger = document.querySelector('.dash-hamburger');
dashHamburger.addEventListener('click', toggleShowClass);