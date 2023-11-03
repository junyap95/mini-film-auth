fetch("http://localhost:3000/api/user/login", {
  method: "POST",
  body: JSON.stringify({
    email: "baboon02@student.bbk.ac.uk",
    password: "223456",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
