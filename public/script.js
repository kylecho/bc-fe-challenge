class App {
  constructor () {
    this.state = {
      selected: null,
      companies: [],
      inputText: ''
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleCompanyClick = this.handleCompanyClick.bind(this)
  }

  handleSearchChange (e) {
    const inputText = e.target.value
    this.state.inputText = inputText
    console.log(this.state)
  }

  handleCompanyClick () {

  }
}

const app = new App()
const elById = (el) => document.getElementById(el)

window.onload = () => {
  console.log('loaded!')
  const searchBar = elById('search')
  searchBar.onkeyup = app.handleSearchChange
}
