
class User {
    #password;
    constructor(id, fname, lname, email, country, isRequested, categoryId, password) {
        this._id = id;
        this._fname = fname;
        this._lname = lname;
        this._email = email;
        this._country = country;
        this._isRequested = isRequested;
        this._categoryId = categoryId;
        this.#password = password;
    }
    getAuthInfo() {
        return {
            id: this._id,
            email: this._email,
            fname: this._fname,
            lastname: this._lastname,
            isRequested: this._isRequested,
            categoryId: this._categoryId,
        }
    }
}

module.exports = User;