module.exports = class AuthModel {
  constructor(databaseMapper) {
    console.log('model constructed')
    this.databaseMapper = databaseMapper
  }

  async find(username = null) {
    const user = (await this.databaseMapper.fetchUserByName(username))[0]
    return user
  }
}
