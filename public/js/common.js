const url = 'http://localhost:3000';

$(document).ready(function() {
  if (localStorage.getItem('userId')) {
    $('#login').hide();
    $('#logout').show();
  } else {
    $('#logout').hide();
    $('#login').show();
  }
})

function onInputFieldChange(event) {
  if (event.target.value) {
    $(event.target).next().removeClass('toggle');
  } else {
    $(event.target).next().addClass('toggle');
  }
}

function logout() {
  localStorage.removeItem('userId');
  window.location.href = '/';
}




function validateEmail(event) {
  const email = event.target.value;
  const regexExp = /\S+@\S+\.\S+/;
  if (regexExp.test(email)) {
    $(event.target).next().removeClass('toggle');
  } else {
    $(event.target).next().addClass('toggle');
  }
}



function updateProfile(event) {
  event.preventDefault();

  const Name = $('#name_field').val();
  const Address = $('#address_field').val();
  const DL_N = $('#DL_field').val();
  const PhoneNumber = $('#phonenumber_field').val();
  const Email = $('#Email_field').val();

  if (!Name || !Address || !DL_N || !PhoneNumber || !Email) {
    alert('Please fill the fields properly');

    return;
  }

  if (!/\S+@\S+\.\S+/.test(Email)) {
    alert('Please enter proper email');

    return
  }

  const userId = localStorage.getItem('userId')
  const user = {userId, Name, Address, DL_N, PhoneNumber, Email};

  $.post(`${url}/update_profile`, user, (res) => {
    if (res?.code === 'ER_DUP_ENTRY') {
      alert('User with these details already exists. Please enter proper details');

      return
    }

    $.get(`${url}/`, (res) => {
      alert('Profile updated successfully');
      const role = localStorage.getItem('userRole')
      if (role === 'employee') {
        const userId = localStorage.getItem('userId');
        window.location.href = `/admin?userId=${userId}`;
      } else {
        window.location.href = '/';
      }
    })
  });
}



class User {
  constructor(user_id, Name, Address,  PhoneNumber, Email, Password, role) {
    this.user_id = user_id;
    this.Name = Name;
    this.Address = Address;
    this.PhoneNumber = PhoneNumber;
    this.Email = Email;
    this.Password = Password;
  }
}



function onConfirmPasswordChange(event) {
  const password = $('#password_field').val();
  const confirmPassword = event.target.value;

  if (password !== confirmPassword) {
    $(event.target).next().addClass('toggle');
  } else {
    $(event.target).next().removeClass('toggle');
  }
}






function signUp(event) {
  event.preventDefault();

  const Name = $('#name_field').val();
  const Address = $('#address_field').val();
  const PhoneNumber = $('#phonenumber_field').val();
  const Email = $('#Email_field').val();
  const Password = $('#password_field').val();
  const confirmPassword = $('#confirm_password_field').val();

  if (!Name && !Address && !PhoneNumber && !Email && !Password) {
    alert('Please fill the fields properly');

    return;
  }

  if (!/\S+@\S+\.\S+/.test(Email)) {
    alert('Please enter proper email');

    return
  }

  if (Password !== confirmPassword) {
    alert('Password and Confirm Password are not same');

    return
  }

  const user = new User ('', Name, Address,  PhoneNumber, Email, Password);

  $.post(`${url}/register`, user, (res) => {
    if (res?.code === 'ER_DUP_ENTRY') {
      alert('User with these details already exists. Please enter proper details');

      return
    }

    localStorage.setItem('userId', res.insertId);
    window.location.href = '/';
  });
}





function login(event) {
  event.preventDefault();

  const email = $('#email_field').val();
  const password = $('#password_field').val();

  if (!email && !password) {
    alert('Please fill the fields properly');

    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert('Please enter proper email');

    return
  }

  const loginParams = {email, password};

  $.post(`${url}/loginUser`, loginParams, (res) => {
    if (res?.length > 0) {
      const loggedInUser = res[0];

      if (loggedInUser.password === password) {
        localStorage.setItem('userId', loggedInUser.id);

        console.log('loggedInUser.role', loggedInUser.role);

        if (loggedInUser.role === 'employee') {
          localStorage.setItem('userRole', 'employee');
          window.location.href = `/admin?userId=${loggedInUser.id}`;
        } else {
          localStorage.setItem('userRole', 'customer');
          window.location.href = '/';
        }
      } else {
        alert('Invalid login credentials');
      }
    } else {
      alert('Invalid login credentials');
    }
  });
}

