class App {
  constructor () {
    this.state = {
      apiUrl: 'http://localhost:3000/api/companies',
      selected: '',
      params: {
        name: '',
        start: 0,
        limit: 20,
        laborTypes: []
      }
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleCompanyClick = this.handleCompanyClick.bind(this)
    this.fetch = this.fetch.bind(this)
  }

  handleSearchChange (e) {
    const name = e.target.value
    this.state.params.name = name
    this.fetchCompanies(name)
  }

  handleCompanyClick (e) {
    const name = e.target.textContent
    this.state.selected = name
    // document.getElementById('search').value = this.state.selected
    this.fetchCompany(this.state.selected)
  }

  fetch (q) {
    return window.fetch(
      `${this.state.apiUrl}/?q=${q}`,
      {method: 'get'}
    )
  }

  fetchCompanies (q) {
    this.fetch(q)
    .then((res) => {
      res.json().then((data) => {
        console.log(data)
        const results = data.results
        const ul = document.getElementById('company-list')
        this.renderList(ul, results)
      })
    })
    .catch((err) => console.error(err))
  }

  fetchCompany (q) {
    this.fetch(q)
    .then((res) => {
      res.json().then((data) => {
        console.log(data)
        const company = data.results.length > 0 && data.results[0]
        const companyDetail = document.getElementById('company-detail')
        this.renderDetail(companyDetail, company)
      })
    })
    .catch((err) => console.error(err))
  }

  renderList (ul, array) {
    ul.innerHTML = ''
    for (let i = 0; i < array.length; i++) {
      const item = document.createElement('li')
      item.appendChild(document.createTextNode(array[i].name))
      ul.appendChild(item)
    }
  }

  renderDetail (detail, company) {
    detail.innerHTML = ''
    const name = document.createElement('p')
    name.appendChild(document.createTextNode(company.name))
    const phone = document.createElement('p')
    phone.appendChild(document.createTextNode(company.phone))
    detail.appendChild(name)
    detail.appendChild(phone)
  }
}

const app = new App()
const elById = (el) => document.getElementById(el)

window.onload = () => {
  console.log('loaded!')
  const searchBar = elById('search')
  const companyList = elById('company-list')
  searchBar.onkeyup = app.handleSearchChange
  companyList.onclick = app.handleCompanyClick
}
