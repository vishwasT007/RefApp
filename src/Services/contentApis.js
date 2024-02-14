import { homePageInfo, categories } from './tv2zApi'
import { Utils } from '@lightningjs/sdk'

export const getCategories = () => {
  return JSON.parse(JSON.stringify(categories))
}

export const getStaticPageDetails = async (type) => {
  let url
  switch (type) {
    case 'terms': {
      url = Utils.asset('locale/Terms.json')
      break
    }
    case 'faq': {
      url = Utils.asset('locale/FAQ.json')
      break
    }
    case 'privacy': {
      url = Utils.asset('locale/Privacy.json')
      break
    }
  }
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}

export const getHome = () => {
  return JSON.parse(JSON.stringify(homePageInfo))
}

export const getVideoDetails = (videoId) => {
  for (const category of homePageInfo) {
    for (const item of category.list) {
      if (item.content_id == videoId) {
        return item
      }
    }
  }
}

export const searchVideo = (keyword) => {
  const searchText = keyword.toLowerCase() // Convert search text to lowercase for case-insensitive matching
  const matchingKeys = []

  for (const category of homePageInfo) {
    for (const item of category.list) {
        const itemDescription = item.description.toLowerCase();
        const itemTitle = item.title.toLowerCase();
        if (itemTitle.includes(searchText)) {
            matchingKeys.push({ item });
            break; 
        } else if (itemDescription.includes(searchText)) {
            matchingKeys.push({ item });
            break; 
        }
    }
  }
  return matchingKeys.length > 0 ? { 'contents': [{ 'total': matchingKeys.length, 'list': matchingKeys }] } : null
}

export const getCategory = () => {
  return JSON.parse(JSON.stringify(homePageInfo))
}



