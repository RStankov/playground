function createUser(firstName, lastName, email, age) {
  app.postTo('/users', {
    data: {
      firstName: firstName,
      lastName:  lastName,
      email:     email,
      age:       age
    }
  });
}
