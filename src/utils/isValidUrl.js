// utils -> isValidUrl

export default (url = '') => {
  try {
    return new URL(url) !== null
  } catch (err) {
    return null
  }
}
