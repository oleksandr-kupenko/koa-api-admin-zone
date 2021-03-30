document.querySelector('.wrap-table-admin').addEventListener('click', function (e) {
  if (e.target.attributes.data) {
    fetch(`delete-user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: e.target.attributes.data.value }),
    })
      .then(() => {
        console.log('removed');
        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
