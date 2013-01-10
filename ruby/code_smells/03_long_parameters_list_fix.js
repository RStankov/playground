function createUser(userData) {
  app.postTo('/users', {
    data: {
      firstName: userData.firstName,
      lastName:  userData.lastName,
      email:     userData.email,
      age:       userData.age
    }
  });
}

// - or even -

function createUser(userData) {
  app.postTo('/users', {
    data: userData
  });
}
