var hidden = false;
function uploadFile() {
  $('#file').trigger('click');
}


function toggleMenu() {
  var x = document.getElementById("mobile-menu");
  var footer = document.getElementById('mobile-footer');
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    footer.style.display = "block";
    x.style.display = "block";
  }
}




function setMaterial() {

  material = $('#material-select').val();
  if (material == '') {
    alert('Select Material First!')
  }
  else {
    $('#form_material').append("<input type='hidden' name='material' value='" + material + "' />");
    $('#form_material').submit();
  }


  // active_id = window.active_material_id
  // if (active_id == 'new') {
  //   var option = $("#new-material-select option:selected").text();
  //   console.log(option)
  //   $('#material').val(option);
  // }
  // else if (active_id == 'norton') {
  //   var option = $("#norton-material-select option:selected").text();
  //   $('#material').val(option);
  // }

  // else if (active_id == 'sketch') {
  //   var option = $("#sketch-material-select option:selected").text();
  //   $('#material').val(option);
  // }
  // else if (active_id == 'raw') {
  //   var option = $("#raw-material-select option:selected").text();
  //   $('#material').val(option);
  // }
  // else {
  //   var option = $("#material-select option:selected").text();
  //   $('#material').val(option);
  // }

  // console.log(active_id)
  //$('#form').submit();
}
function reloadSrc() {
  var timestamp = new Date().getTime();
  brightness = document.getElementById("brightness");
  contrast = document.getElementById("contrast");
  mirror = document.getElementsByClassName('mirror')[0];
  invert = document.getElementsByClassName('invert')[0];
  brightness = document.getElementById("brightness");
  contrast = document.getElementById("contrast");
  brightnessInput = document.getElementById("brightnessInput");
  contrastInput = document.getElementById("contrastInput");

  brightness.value = 0;
  contrast.value = 0;
  brightnessInput.value = brightness.value;
  contrastInput.value = contrast.value;
  invert.checked = false;
  mirror.checked = false;

  /*  mirror.checked = false;
    invert.checked = false;*/


  //Get the previous source for mod_img
  mod_img = document.getElementById('mod-img');
  mod_src = mod_img.src;
  mod_img.style.transform = '';
  mod_img.style.filter = '';
  //Force page to reload
  mod_img.src = active_src + timestamp


  mod_img.onload = () => {
    preloaderOff()
  }

}
function restartProcess() {
  request = new XMLHttpRequest
  request.open('GET', '/clear_files')
  request.send()
  //Reload the page
  location.reload()
}

function toggle_div() {
  if (hidden == false) {
    $("#mod-img").hide();
    hidden = true;
  }
  else {
    $("#mod-img").show();
    hidden = false;
  }
}

function download_image(url) {
  var url = link.getAttribute("data-href");
  var fileName = link.getAttribute("download");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
    link.innerText = "Download Image";
  }
  xhr.send();
}
//Invert the image colors

function setSliderValue(e) {

  if (e.id == 'contrastInput') {
    document.getElementById("contrast").value = e.value;
    const event = new Event('input');
    document.getElementById("contrast").dispatchEvent(event);
  }
  else if (e.id == 'brightnessInput') {
    document.getElementById("brightness").value = e.value;
    const event = new Event('input');
    document.getElementById("brightness").dispatchEvent(event);
  }
}

function convertImgtoBase64(img) {
  if (typeof base64_img == "undefined") {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    var base64_img = canvas.toDataURL()
  }

  return base64_img;

}

function setMaterialonImage() {

  img = document.getElementById('drag-img');
  mod_img = document.getElementById('mod-img');
  brightness_value = document.getElementById("brightness").value;
  contrast_value = document.getElementById("contrast").value;
  var brightness_value = parseInt(brightness_value) + 100;
  var contrast_value = parseInt(contrast_value) + 100;
  invert = document.getElementsByClassName('invert')[0].checked;//A bool value
  mirror = document.getElementsByClassName('mirror')[0].checked;

  request = new XMLHttpRequest();
  request.open('POST', '/getMaterialImage')
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  data = { 'contrast': contrast_value, 'brightness': brightness_value, 'invert': invert, 'mirror': mirror }

  request.send(JSON.stringify(data))
  request.onload = () => {
    response = request.response;
    mod_img.style.transform = '';
    mod_img.src = response;
  }
}


function filter_image() {
  //It seems better for the user to see a negative for a decreasing contrast and positive for increasing, that's why
  //sliders range from -100 to 100;
  invert = document.getElementsByClassName('invert')[0];
  brightness_value = document.getElementById("brightness").value;
  contrast_value = document.getElementById("contrast").value;
  brightnessInput = document.getElementById("brightnessInput");
  contrastInput = document.getElementById("contrastInput");
  norm_image = document.getElementById("drag-img");
  mod_image = document.getElementById("mod-img");

  //If checkbox is checked, invert the colors of the image
  brightnessInput.value = brightness_value;
  contrastInput.value = contrast_value;

  //Add 100 to the slider values, because brightness and contrast values best range from 0 - 200;
  var brightness_value = parseInt(brightness_value) + 100;
  var contrast_value = parseInt(contrast_value) + 100;


  if (invert.checked == true) {


    if (mod_image != null) {
      if (has_material != 'None') {
        setMaterialonImage()
      }
      else {
        mod_image.style.filter = `invert(100%) contrast(${contrast_value}%) brightness(${brightness_value}%)`;
      }
    }
    else {
      norm_image.style.filter = `invert(100%) contrast(${contrast_value}%) brightness(${brightness_value}%)`;
    }
  }

  else {

    if (mod_image != null) {
      if (has_material != 'None') {
        setMaterialonImage()
      }
      else {
        mod_image.style.filter = `invert(0%) contrast(${contrast_value}%) brightness(${brightness_value}%)`;
      }
    }
    else {
      norm_image.style.filter = `invert(0%) contrast(${contrast_value}%) brightness(${brightness_value}%)`;
    }
  }

}

//Mirror the image or rather flip the image from left to right and vice versa
function transform_image() {
  mirror = document.getElementsByClassName('mirror')[0];
  zoom = document.getElementById('zoom').value;
  norm_image = document.getElementById("drag-img");
  mod_image = document.getElementById("mod-img");

  //If checkbox is checked, mirror the image
  if (mirror.checked == true) {
    if (mod_image != null) {
      mod_image.style.transform = 'scaleX(-1)'
    }
    else {
      norm_image.style.transform = 'scaleX(-1)';
    }
  }
  else {
    if (mod_image != null) {
      mod_image.style.transform = 'scaleX(1)'
    }
    else {
      norm_image.style.transform = 'scaleX(1)';
    }
  }


}

function zoom_image() {
  mirror = document.getElementsByClassName('mirror')[0];
  zoom = document.getElementById('zoom').value;
  norm_image = document.getElementById("drag-img");
  mod_image = document.getElementById("mod-img");

  if (mirror.checked == true) {

    mod_image.style.transform = `scaleX(-${zoom})scaleY(${zoom})  `;

    norm_image.style.transform = `scaleX(-${zoom})scaleY(${zoom}) `;
  }
  else {

    mod_image.style.transform = `scale(${zoom})`;

    norm_image.style.transform = `scale(${zoom})`;
  }
}

//function for displaying sliders when advanced button clicked
function displaySliders() {



  sliders = document.getElementsByClassName('sliders')[0];
  advanced_button = document.getElementsByClassName('advanced')[0];
  reset = document.getElementsByClassName('reset_default')[0];
  save_effect = document.getElementsByClassName('save_effect')[0];

  sliders.classList.toggle('show_sliders');
  advanced_button.classList.toggle('show_advanced');
  reset.classList.toggle('show_save');
  save_effect.classList.toggle('show_save');


}
function preloaderOff() {
  loaderDiv = document.getElementsByClassName('loaderDiv')[0];
  loaderDiv.style.display = 'none'
}
function preloaderOn() {
  loaderDiv = document.getElementsByClassName('loaderDiv')[0];
  loaderDiv.style.display = 'block'
}
comic_applied = false
function applyComic() {
  if (comic_applied == false) {
    request = new XMLHttpRequest
    request.open('POST', '/comic')
    data = { 'data': 'true' }
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(data))
    comic_applied = true
    comicall = document.querySelector('.comicall')
    //comicall.innerHTML += '<small style = "color:red; position:relative; margin-top:30px;"> This might take some seconds...</small>'

    request.onload = () => {
      if (request.response == 'success') {
        reloadSrc()
      }
    }
    preloaderOn()
  }
}

function removeComic() {
  request = new XMLHttpRequest
  request.open('POST', '/comic')
  data = { 'data': 'false' }
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data))
  comic_applied = false



  request.onload = () => {

    if (request.response == 'success') {
      reloadSrc()
    }
  }
  preloaderOn()
}

function applySharpen() {
  radius = document.getElementById('unsharp_radius').value
  threshold = 0
  percentage = document.getElementById('unsharp_percent').value

  //Change values to 0 after request sent


  data = { 'radius': radius, 'threshold': threshold, 'percentage': percentage }
  request = new XMLHttpRequest
  request.open('POST', 'sharpen')
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data))

  request.onload = () => {
    if (request.response == 'success') {
      document.getElementById('unsharp_radius').value = 0
      document.getElementById('unsharp_percent').value = 0
      reloadSrc()

    }
  }
  preloaderOn()
}

/*function applyComic(){
  request = new XMLHttpRequest
  request.open('POST', '')
}
*/
function resetEffect() {

  brightness = document.getElementById("brightness");
  contrast = document.getElementById("contrast");
  norm_image = document.getElementById("drag-img");
  mod_image = document.getElementById("mod-img");
  mirror = document.getElementsByClassName('mirror')[0];
  invert = document.getElementsByClassName('invert')[0];
  brightnessInput = document.getElementById("brightnessInput");
  contrastInput = document.getElementById("contrastInput");

  brightness.value = 0;
  contrast.value = 0;
  invert.checked = false;
  mirror.checked = false;
  brightnessInput.value = brightness.value;
  contrastInput.value = contrast.value;
  if (mod_image != null) {
    mod_image.style.transform = 'scaleX(1)';
    mod_image.style.filter = "contrast(100%) brightness(100%) invert(0%)"
  }
  norm_image.style.transform = 'scaleX(1)';
  norm_image.style.filter = "contrast(100%) brightness(100%) invert(0%)"


  //Send ajax request to reset the image
  request = new XMLHttpRequest
  request.open('POST', 'reset_effect')
  request.send()
  request.onload = () => {
    if (request.response == 'success') {
      reloadSrc()
      return false;
    }
  }

  preloaderOn()
}

function submitEffect() {
  reset = document.getElementsByClassName('reset_default')[0];
  reset.classList.toggle('show_save', false)
  request = new XMLHttpRequest;
  brightness = parseInt(document.getElementById("brightness").value) + 100;
  contrast = parseInt(document.getElementById("contrast").value) + 100;
  mirror = document.getElementsByClassName('mirror')[0].checked;//A bool value
  invert = document.getElementsByClassName('invert')[0].checked;//A bool value


  data = { 'brightness': brightness, 'contrast': contrast, 'mirror': mirror, 'invert': invert }

  request.open('POST', '/enhance')
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  //Send a json data
  request.send(JSON.stringify(data))

  //Flash alert message when data has been sent
  request.onload = () => {
    reloadSrc()
    //adding a 'x' button if the user wants to close manually
    $(".result").html('<div class="alert alert-warning"><button type="button" class="close">×</button><strong>Advanced changes saved</strong></div>');

    //timing the alert box to close after 5 seconds
    window.setTimeout(function () {
      $(".alert").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
      });
    }, 5000);

    //Adding a click event to the 'x' button to close immediately
    $('.alert .close').on("click", function (e) {
      $(this).parent().fadeTo(500, 0).slideUp(500);
    });
    return false;
  }
  preloaderOn()


}
function setInitialValues() {

  initial_width = parseInt($('#initialwidth').val())
  initial_height = parseInt($('#initialheight').val())

  $('#width').val(initial_width);
  $('#widthp').val(100);

  $('#height').val(initial_height);
  $('#heightp').val(100);

  $('#dpi').val(dpix);



}

function widthChanged() {
  aspectRatio = document.getElementById('aspect_ratio_box').checked;
  format = document.getElementById('format').value;

  initial_width = parseInt($('#initialwidth').val())
  initial_height = parseInt($('#initialheight').val())

  if (aspectRatio) {
    var x0 = $('#width').val();
    var y0 = $('#height').val();
    var asp = initial_width / initial_height;
    var x = x0;

    if (format == 'in') {
      var y = (x / asp).toFixed(2);
    }
    else {
      var y = Math.round(x / asp)
    }
    $('#height').val(y);
  }

}

function heightChanged() {
  aspectRatio = document.getElementById('aspect_ratio_box').checked;
  if (aspectRatio) {
    format = document.getElementById('format').value;
    var x0 = $('#width').val();
    var y0 = $('#height').val();
    var asp = initial_width / initial_height;
    var x = y0 * asp;
    if (format == 'in') {
      var x = (x).toFixed(2);
    }
    else {
      var x = Math.round(x)
    }
    var y = y0;
    $('#width').val(x);
  }

}

function onAspectRatioTick() {
  aspectRatio = document.getElementById('aspect_ratio_box').checked;
  if (aspectRatio) {
    var x0 = $('#width').val();
    var y0 = $('#height').val();

    initial_width = parseInt($('#initialwidth').val())
    initial_height = parseInt($('#initialheight').val())

    var asp = initial_width / initial_height;
    if (x0 > y0) {
      y = x0 / asp;
      if (format == 'in') {
        var y = (y).toFixed(2);
      }
      else {
        var y = Math.round(y)
      }
      $('#height').val(y);
    }
    else {
      x = y0 * asp;
      if (format == 'in') {
        var x = (x).toFixed(2);
      }
      else {
        var x = Math.round(x)
      }
      $('#width').val(x);
    }
  }
}

function widthpChanged() {
  format = document.getElementById('format').value;
  var x0 = $('#width').val();
  var y0 = $('#height').val();
  var k0 = $('#widthp').val();

  var x = x0 * k0 * 0.01;
  var y = y0 * k0 * 0.01;
  if (format == 'in') {
    var x = (x).toFixed(2);
    var y = (y).toFixed(2)
  }
  else {
    var x = Math.round(x)
    var y = Math.round(y)
  }
  $('#width').val(x);
  $('#height').val(y);
  $('#heightp').val(k0);
}

function heightpChanged() {
  format = document.getElementById('format').value;
  var x0 = $('#width').val();
  var y0 = $('#height').val();
  var k0 = $('#heightp').val();
  var x = x0 * k0 * 0.01;
  var y = y0 * k0 * 0.01;
  if (format == 'in') {
    var x = (x).toFixed(2);
    var y = (y).toFixed(2)
  }
  else {
    var x = Math.round(x)
    var y = Math.round(y)
  }
  $('#width').val(x);
  $('#height').val(y);
  $('#widthp').val(k0);
}

function formatChanged() {
  var option = $("#format option:selected").text();
  $('#pformat-type').text(option);

  initial_width = parseInt($('#initialwidth').val())
  initial_height = parseInt($('#initialheight').val())

  dpix = parseInt($('#dpi').val())
  dpiy = parseInt($('#dpi').val())

  if (option == "px") {
    $('#width').val(initial_width);
    $('#height').val(initial_height);
  }
  else if (option == "mm") {
    var x = Math.round((initial_width / dpix) * 25.4);
    var y = Math.round((initial_height / dpiy) * 25.4);
    $('#width').val(x);
    $('#height').val(y);
  }
  else if (option == "in") {
    document.getElementById('width').step = '0.01';
    document.getElementById('height').step = '0.01';

    var x = (initial_width / dpix).toFixed(2);;
    var y = (initial_height / dpiy).toFixed(2);;
    $('#width').val(x);
    $('#height').val(y);
  }
}

function send_resize() {
  var width = $('#width').val();
  var height = $('#height').val();
  var format = $("#format option:selected").text();
  var dpi = $('#dpi').val();

  // alert(width)
  // alert(height)
  // alert(format)
  // alert(dpi)

  $('#form_resize').append("<input type='hidden' name='width' value='" + width + "' />");
  $('#form_resize').append("<input type='hidden' name='height' value='" + height + "' />");
  $('#form_resize').append("<input type='hidden' name='format' value='" + format + "' />");
  $('#form_resize').append("<input type='hidden' name='dpi' value='" + dpi + "' />");

  $('#form_resize').submit();
  // $('#form-width').val(width.toString());
  // $('#form-height').val(height.toString());
  //$('#form-format').val(format.toString());
  //$('#form-dpi').val(dpi.toString());
  //$('#form').submit();
}

$(document).ready(function () {
  $(document).bind("contextmenu", function (e) {
    return false;
  });
  /* var scale = 1;*/
  // ...............................................................This is for zooming...................................................................................................................................................
  // $(".img").bind("wheel mousewheel", function (e) {
  //   var delta;

  //   if (e.originalEvent.wheelDelta !== undefined)
  //     delta = e.originalEvent.wheelDelta;
  //   else delta = e.originalEvent.deltaY * -1;

  //   if (delta > 0) {
  //     scale = scale + 0.15;
  //     var width1 = $(".img").width;

  //
  //     // if (scale < 1.75) {
  //     //   scale = 1.75;
  //     // }
  //     $(".img").css({
  //       transform: "scale(" + scale + ")",
  //     });
  //   } else {
  //     scale = scale - 0.15;

  //     if (scale < 0.25) {
  //       scale = 0.25;
  //     }

  //     $(".img").css({
  //       transform: "scale(" + scale + ")",
  //     });
  //   }
  // });
  /*    $(".img").mousedown(function (event) {
        switch (event.which) {
          case 1:
            scale = scale + 0.20;
            img2 = document.getElementById("mod-img");
  
            // if (scale > 1.75) {
            //   scale = 1.75;
            // }
            $(".img").css({
              transform: $(".img").css('transform') + "scale(" + scale + ")",
            });
  
            break;
          case 2:
            break;
          case 3:
            scale = scale - 0.20;
  
            if (scale < 0.25) {
              scale = 0.25;
            }
            $(".img").css({
              transform: $(".img").css('transform') + "scale(" + scale + ")",
            });
            break;
          default:
        }
      });*/
  //...........................................................................This is for Draging the second image ......................................................................................................................................
  var img_ele1 = null,
    x_cursor1 = 0,
    y_cursor1 = 0,
    x_img_ele1 = 0,
    y_img_ele1 = 0;
  var img_ele = null,
    x_cursor = 0,
    y_cursor = 0,
    x_img_ele = 0,
    y_img_ele = 0;

  function start_drag() {
    img_ele = document.getElementById("drag-img");
    x_img_ele =
      window.event.clientX -
      document.getElementById("drag-img").offsetLeft;//............. .............Use the first photo ID.................................................................................
    y_img_ele =
      window.event.clientY -
      document.getElementById("drag-img").offsetTop;//..............Same......................................

    img_ele1 = document.getElementById("mod-img");
    x_img_ele1 =
      window.event.clientX -
      document.getElementById("mod-img").offsetLeft;
    y_img_ele1 =
      window.event.clientY -
      document.getElementById("mod-img").offsetTop;
  }

  function stop_drag() {
    img_ele = null;
    img_ele1 = null;
  }

  function while_drag() {
    var x_cursor = window.event.clientX;
    var y_cursor = window.event.clientY;
    if (img_ele !== null) {
      img_ele.style.left = x_cursor - x_img_ele + "px";
      img_ele.style.top = window.event.clientY - y_img_ele + "px";
    }
    var x_cursor1 = window.event.clientX;
    var y_cursor1 = window.event.clientY;
    if (img_ele1 !== null) {
      img_ele1.style.left = x_cursor1 - x_img_ele1 + "px";
      img_ele1.style.top = event.clientY - y_img_ele1 + "px";
    }
  }

  // document
  //   .getElementById("drag-img")//..........First photo ID................
  //   .addEventListener("mousedown", start_drag);
  // document
  //   .getElementById("canvas")//...........First photo div ID................
  //   .addEventListener("mousemove", while_drag);
  // document
  //   .getElementById("canvas") // ............................First photo div ID...............
  //   .addEventListener("mouseup", stop_drag);



  //..................................................................This is for Draging the second image ......................................................................................................................................
  //return THERE


  // function start_drag1() {

  // }

  // function stop_drag1() {
  // }

  // function while_drag1() {
  // //   var x_cursor1 = window.event.clientX - $("#canvas").width();

  // }

  // document
  //   .getElementById("mod-img")
  //   .addEventListener("mousedown", start_drag);
  // document
  //   .getElementById("canvas-1")
  //   .addEventListener("mousemove", while_drag);
  // document
  //   .getElementById("canvas-1")
  //   .addEventListener("mouseup", stop_drag);
});




function handleSVGDownload(png_file) {
  var file = png_file;
  // Any option can be omitted which will be set to the default
  var options = { ltres: 2, qtres: 1, pathomit: 8 };
  // Adding custom palette. This will override numberofcolors.
  options.pal = [{ r: 0, g: 0, b: 0, a: 255 }, { r: 0, g: 0, b: 255, a: 255 }, { r: 255, g: 255, b: 0, a: 255 }];
  /* Using these options and appending the SVG to an
    element with id="svgcontainer"*/
  let _info = "Processing. Please wait. Will redirect to the download page.. Don't reload or exit page.";
  document.getElementById("downloadModalContentInfo").innerHTML = _info;

  ImageTracer.imageToSVG(
    file,
    function (svgstr) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/save/svg', true);

      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded;charset=UTF-8');
      xhr.send(`svgstr=${svgstr}&save_dir=${png_file}`);
      xhr.onload = function () {

        // Request finished. Do processing here
        var _next = "/" + xhr.response;
        alert("Converted!! Click ok to start downloading...")
        // redirect to download
        var svg_link = document.getElementById("downloadtag_svg");
        svg_link.href = _next;
        document.getElementById("downloadModalContentInfo").innerHTML = "Converted!!";
        svg_link.click();
      }
    },
    options
  );
}




function handleCropImage() {

  //Crop input tag
  crop = document.getElementById('crop')
  cropR = document.getElementById('cropR')

  let _x = document.getElementById('crop_x').value;
  let _y = document.getElementById('crop_y').value;
  let _height = document.getElementById('crop_height').value;
  let _width = document.getElementById('crop_width').value;
  let radius = document.getElementById('roundedges')
  img_height = radius.dataset.height
  img_width = radius.dataset.width

  let rx = (radius.value * _width) / 100;
  let ry = (radius.value * _height) / 100;


  radius_values = { 'rx': rx, 'ry': ry }
  crop_data = { 'x': _x, 'y': _y, 'height': _height, 'width': _width }

  if (rx != 0) {
    crop_data['rx'] = rx
    crop_data['ry'] = ry
  }

  crop.value = JSON.stringify(crop_data);
  console.log(crop.value);

  $('#form_crop').append("<input type='hidden' name='crop' value='" + crop.value + "' />");
  $('#form_crop').append("<input type='hidden' name='radius' value='" + JSON.stringify(radius_values) + "' />");

  document.getElementById('form_crop').submit()
}

//Disable the apply radius button unless value is inputed in it
function setActive() {
  if (document.querySelector('#roundedges').value.length > 0)
    document.querySelector('.roundedgesbtn').disabled = false;
  else
    document.querySelector('.roundedgesbtn').disabled = true;
};


function setCropRadius() {
  radius = document.querySelector('#roundedges').value
  cropper_crop_box = document.getElementsByClassName('cropper-crop-box')[0]
  cropper_view_box = document.getElementsByClassName('cropper-view-box')[0]
  var image = document.getElementById('crop_image');

  cropper_crop_box.style.cssText += `border-radius: ${radius}%;`
  cropper_view_box.style.cssText += `border-radius:${radius}% ;box-shadow: 0 0 0 1px #39f; outline: 0;`
}



