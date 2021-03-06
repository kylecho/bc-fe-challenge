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

    this.handleSearchChange = this.debounce(
      this.handleSearchChange.bind(this),
      1000
    )
    this.handleLimitChange = this.debounce(
      this.handleLimitChange.bind(this),
      1000
    )
    this.handleStartChange = this.debounce(
      this.handleStartChange.bind(this),
      1000
    )
    this.handleCompanyClick = this.handleCompanyClick.bind(this)
    this.fetch = this.fetch.bind(this)
  }

  handleSearchChange (e) {
    const name = e.target.value
    const start = 0
    const { limit } = this.state.params
    this.state.params.name = name
    this.state.params.start = start
    this.fetchCompanies(name, limit, start)
  }

  handleLimitChange (e) {
    const limit = e.target.value
    const start = 0
    const { name } = this.state.params
    this.state.params.limit = parseInt(limit)
    this.fetchCompanies(name, limit, start)
  }

  handleStartChange (e) {
    const start = e.target.value
    const { name, limit } = this.state.params
    this.state.params.start = parseInt(start)
    this.fetchCompanies(name, limit, start)
  }

  handleCompanyClick (e) {
    const name = e.target.textContent
    this.state.selected = name
    this.fetchCompany(this.state.selected, 1, 0)
  }

  fetch (
    q,
    limit = this.state.params.limit,
    start = this.state.params.start
  ) {
    return window.fetch(
      `${this.state.apiUrl}/?q=${q}&limit=${limit}&start=${start}`,
      {method: 'get'}
    )
  }

  fetchMore () {
    const start = this.state.params.start + this.state.params.limit
    this.state.params.start = start
    const { name, limit } = this.state.params
    this.fetchCompanies(name, limit, start, true)
  }

  fetchCompanies (q, limit, start, more = false) {
    this.fetch(q, limit, start)
    .then((res) => {
      res.json().then((data) => {
        const results = data.results
        const ul = document.getElementById('company-list')
        this.renderList(ul, results, more)
      })
    })
    .catch((err) => console.error(err))
  }

  fetchCompany (q, limit, start) {
    this.fetch(q, limit, start)
    .then((res) => {
      res.json().then((data) => {
        const company = data.results.length > 0 && data.results[0]
        const companyDetail = document.getElementById('company-detail')
        this.renderDetail(companyDetail, company)
      })
    })
    .catch((err) => console.error(err))
  }

  renderList (ul, array, more) {
    if (!more) {
      ul.innerHTML = ''
    }
    for (let i = 0; i < array.length; i++) {
      const item = document.createElement('li')
      item.appendChild(document.createTextNode(array[i].name))
      ul.appendChild(item)
    }
  }

  renderDetail (detail, company) {
    this.renderAvatar(detail.children[0], company)
    this.renderDesctiption(detail.children[1], company)
  }

  renderAvatar (avatar, company) {
    avatar.innerHTML = ''
    const avatarEl = document.createElement('div')
    this.addClass(avatarEl, 'company-avatar-img')
    avatarEl.setAttribute('style', `background-image: url(${company.avatarUrl})`)
    avatar.appendChild(avatarEl)
  }

  renderDesctiption (desc, company) {
    desc.innerHTML = ''
    const name = document.createElement('p')
    name.appendChild(document.createTextNode(company.name))
    const phone = document.createElement('p')
    phone.appendChild(document.createTextNode(company.phone))
    const website = document.createElement('p')
    this.addClass(website, 'p-last')
    const websiteLink = document.createElement('a')
    websiteLink.setAttribute('href', company.website)
    websiteLink.setAttribute('target', '_blank')
    websiteLink.appendChild(document.createTextNode(company.website))
    website.appendChild(websiteLink)
    desc.appendChild(name)
    desc.appendChild(phone)
    desc.appendChild(website)
  }

  addClass (el, className) {
    el.classList.add(className)
  }

  debounce (callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => callback.apply(context, callbackArgs)

    return function () {
      callbackArgs = arguments
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

const app = new App()
const elById = (el) => document.getElementById(el)

window.onload = () => {
  const searchBar = elById('search-text')
  const searchLimit = elById('search-limit')
  const searchStart = elById('search-start')
  const companyList = elById('company-list')
  searchBar.onkeyup = app.handleSearchChange
  searchLimit.onkeyup = app.handleLimitChange
  searchStart.onkeyup = app.handleStartChange
  companyList.onclick = app.handleCompanyClick

  window.onscroll = () => {
    if ((window.innerHeight + window.scrollY >= document.body.offsetHeight)) {
      app.fetchMore()
    }
  }
}
