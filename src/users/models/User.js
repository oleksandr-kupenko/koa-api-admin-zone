class User {
  #password;
  constructor(user) {
    this._id = user.id;
    this._fname = user.fname;
    this._lname = user.lname;
    this._username = user.username;
    this._email = user.email;
    this._country = user.country;
    this._isAdmin = user.isAdmin;
    this._categoryId = user.categoryId;
    this._categoryName = user.name;
    this._photo = user.photo;
    this._phone = user.phone;
    this._gender = user.gender;
    this.#password = user.password;
    this._rate = user.rate;
    this._rating = user.rating;
    this._stack = user.stack;
    this._tokens = user.tokens;
  }

  getInfo(idflag = false) {
    const responseData = {
      email: this._email,
      fname: this._fname,
      lname: this._lname,
      username: this._username,
      country: this._country,
      isAdmin: this._isAdmin,
      categoryId: this._categoryId,
      categoryName: this._categoryName,
      photo: this._photo,
      phone: this._phone,
      gender: this._gender,
      rate: this._rate,
      rating: this._rating,
      stack: this._stack,
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
