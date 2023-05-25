$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
    label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if ($this.val() === '') {
      label.removeClass('highlight');
    }
    else if ($this.val() !== '') {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

function login(data) {
  e.preventDefault();
  alert("success");
  // $.ajax({
  //   type: "POST",
  //   url: "localhost:3000/auth/login",
  //   data: JSON.stringify(data), 
  //   contentType: "application/json; charset=utf-8",
  //   crossDomain: true,
  //   dataType: "json",
  //   success: function (data, status, jqXHR) {

  //     alert("success"); 
  //   },

  //   error: function (jqXHR, status) {
  //     // error handler
  //     console.log(jqXHR);
  //     alert('fail' + status.code);
  //   }
  // });
}
$('#fm').submit(function (event) {
  event.preventDefault();
  var formData = {
    email: $("#email").val(),
    password: $("#password").val(),
  };
  console.log(formData);

  fetch("/auth/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(result => {
      if (result.result) {
        window.location.href = result.url;
      } else {
        alert(result.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // $.ajax({
  //   url: "/auth/login",
  //   type: "POST",
  //   processData: false,
  //   contentType: false,
  //   data: formData,
  //   crossOriginIsolated: false,
  //   crossDomain: true,
  //   dataType: "json",
  //   success: function (data) {
  //     // if (data.result) {
  //     //   console.log(data);
  //     // } else {
  //     //   alert(data.message);
  //     // }
  //     console.log('data');
  //   },
  //   error: function (data) {
  //     alert(data);
  //   }
  // });
});

function getFormData($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}