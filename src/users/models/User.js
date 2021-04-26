class User {
  #password;
  constructor(user) {
    this._id = user.id;
    this._fname = user.fname;
    this._lname = user.lname;
    this.username = user.username;
    this._email = user.email;
    this._country = user.country;
    this._isRequested = user.isRequested;
    this._categoryId = user.categoryId;
    this._photo = user.photo;
    this.#password = user.password;
    this._tokens = user.tokens;
  }

  getInfo(idflag = false) {
    const responseData = {
      email: this._email,
      fname: this._fname,
      lname: this._lname,
      username: this._username,
      country: this._country,
      isRequested: this._isRequested,
      categoryId: this._categoryId,
      photo: this._photo,
    };

    if (idflag) {
      responseData.id = this._id;
    }

    if (this._tokens) {
      responseData.tokens = this._tokens;
    }

    return responseData;
  }

  getId() {
    return this._id;
  }

  getEmail() {
    return this._email;
  }
}

module.exports = User;
