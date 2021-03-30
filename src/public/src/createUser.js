if (
  document.querySelector('.btn.btn_todown').innerText &&
  document.querySelector('.btn.btn_todown').innerText == 'Create'
) {
  document.querySelector('.btn.btn_todown').onclick = (evt) => {
    evt.preventDefault();
    let inputs = Array.from(document.querySelectorAll('.sm-form.form input'));

    let inputsData = inputs.reduce((acc, input) => ({ ...acc, [input.name]: input.value }), {});
    let statusId = document.querySelector('.select-base').options[
      document.querySelector('.select-base').options.selectedIndex
    ].value;

    fetch(`create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fname: inputsData.fname,
        lname: inputsData.lname,
        email: inputsData.email,
        isRequested: true,
        categoryId: statusId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        data === 23505 ? alert('Email must be unique') : clearInput();
      });

    function clearInput() {
      inputs.forEach((input) => (input.value = ''));
      console.log('user was send for add');
    }
  };
}
