if (
  document.querySelector('.btn.btn_todown').innerText &&
  document.querySelector('.btn.btn_todown').innerText == 'Create'
) {
  document.querySelector('.btn.btn_todown').onclick = (evt) => {
    evt.preventDefault();
    let data = Array.from(document.querySelectorAll('.sm-form.form input')).reduce(
      (acc, input) => ({ ...acc, [input.name]: input.value }),
      {}
    );
    let statusId = document.querySelector('.select-base').options[
      document.querySelector('.select-base').options.selectedIndex
    ].value;

    fetch(`create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        isRequested: true,
        categoryId: statusId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        data === 23505 && alert('Email must be unique');
      });
  };
}
