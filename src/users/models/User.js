class User {
  #password;
  constructor(user) {
    this._id = user.id;
    this._fname = user.fname;
    this._lname = user.lname;
    this._email = user.email;
    this._country = user.country;
    this._isRequested = user.isRequested;
    this._categoryId = user.categoryId;
    this.#password = user.password;
    this._tokens = user.tokens;
  }
  getAuthInfo() {
    return {
      id: this._id,
      email: this._email,
      fname: this._fname,
      lastname: this._lastname,
      country: this._country,
      isRequested: this._isRequested,
      categoryId: this._categoryId,
      tokens: this._tokens,
    };
  }
}

module.exports = User;
