module.exports = class AuthModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  async find(username = null) {
    const user = (await this.databaseMapper.fetchUserByName(username))[0]
    return user
  }
}
