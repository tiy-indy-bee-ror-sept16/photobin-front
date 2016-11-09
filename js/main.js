$(document).ready(function(){
  function prepare_doc(){
    load_photos()
    if(logged_in() === false){
        $('#signup_form, #login_form').show()
        $('#photo_form').hide()
    } else {
      user_info()
      // Show photo form
      $('#photo_form').show()
    }
  }

  prepare_doc()

  if(window.location.hash.match(/#\d+/).length > 0) {
    id = window.location.hash.substring(1)
    $('#photo_holder').modal('show')
  }

})

function clear_alerts(){
  $('#alerts').html('')
}

function clear_form(selector){
  $(selector)[0].reset();
  toggle_submit(selector)
}

function toggle_submit(selector){
  if($(selector + ' input[type=submit]').length > 0){
    $(selector + ' input[type=submit]').replaceWith('<img src="img/ajax-loader.gif" class="loader" />')
  } else {
    $(selector + ' .loader').replaceWith('<input type="submit" name="submit" value="Go!" class="btn btn-primary" />')
  }
}

function handle_user_forms(response, selector){
  store_info(response.user)
  clear_alerts()
  clear_form(selector)
  $('#signup_form, #login_form').hide()
  user_info()
  $('#photo_form').show()
}

function user_info(){
  $('#user_info').html("<h1>Hello, " + username() + "</h1>")
  $('#user_info').append('<a href="#" id="logout" class="btn btn-danger">Logout</a>')
}

function store_info(response){
  localStorage.setItem('api_token', response.api_token)
  localStorage.setItem('username', response.email)
}

function api_token(){
  token = localStorage.getItem('api_token')
  if(token === ''){
    return false
  } else {
    return token
  }
}

function username(){
  email = localStorage.getItem('username')
  if(email === ''){
    return false
  } else {
    return email
  }
}

function logout(){
  localStorage.setItem('api_token', '')
  localStorage.setItem('username', '')
  $('#signup_form, #login_form').show()
  $('#user_info').html('')
  $('#photo_form').hide()
}

function logged_in(){
  if(api_token() != false){
    return true
  } else {
    return false
  }
}

function handle_errors(selector, response){
  response.responseJSON.forEach(function(err){
    $('#alerts').html('')
    $('#alerts').append('<div class="alert alert-danger" role="alert">' + err + '</div>')
  })
  toggle_submit(selector)
}

$('.click_me').on('click', function(ev){
  ev.preventDefault()
  // console.log(ev)
  alert(ev.target.innerText)
})

$('.click_me').on('mouseover', function(ev){
  $(ev.target).css("color", "red")
})

$('.click_me').on('mouseout', function(ev){
  $(ev.target).css("color", "inherit")
})

$('#formie').on('submit', function(ev){
  ev.preventDefault()
  // console.log(Object.keys($(ev.target)[0]))
  toggle_submit('#formie')
  // console.log($( this ).serializeArray())
  $.post(
    'https://desolate-sands-90495.herokuapp.com/users',
    $( this ).serializeArray()
  ).done(function(response){
    handle_user_forms(response, '#formie')
  }).fail(function(response){
    handle_errors('#formie', response)
  })
})

$('#login').on('submit', function(ev){
  ev.preventDefault()
  // console.log(Object.keys($(ev.target)[0]))
  toggle_submit('#login')
  // console.log($( this ).serializeArray())
  $.post(
    'https://desolate-sands-90495.herokuapp.com/log_in',
    $( this ).serializeArray()
  ).done(function(response){
    handle_user_forms(response, '#login')
  }).fail(function(response){
    handle_errors('#login', response)
  })
})

$(document).on('click', '#logout', function(ev){
  ev.preventDefault()
  logout()
})

// Photo upload shtuff

function load_photos(){
  $.getJSON('https://desolate-sands-90495.herokuapp.com/photos')
  .then(function(response){
    response.photos.forEach(function(photo){
      $('#photos').prepend('<img src="https://desolate-sands-90495.herokuapp.com/' + photo.photo + '" width=200 /><p>' + photo.caption + '</p>')
    })
  })
}

function handle_photo_submit(response) {
  $('#photos').prepend('<img src="https://desolate-sands-90495.herokuapp.com/' + response.photo.photo + '" width=200 /><p>' + response.photo.caption + '</p>')
  clear_form('#upload')
}

$('#upload').on('submit', function(ev){
  ev.preventDefault()
  toggle_submit('#upload')
  // data = $( this ).serializeArray()
  // data.push({name: 'api_token', value: api_token()})
  var formData = new FormData(document.getElementById('upload'));
  formData.append('api_token', api_token())
  $.post(
    {
      url: 'https://desolate-sands-90495.herokuapp.com/photos',
      data: formData,
      processData: false,
      dataType: 'json',
      contentType: false
    }
  ).done(function(response){
    handle_photo_submit(response)
  }).fail(function(response){
    handle_errors('#upload', response)
  })

})
