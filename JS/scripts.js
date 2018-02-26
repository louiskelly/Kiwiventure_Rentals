$(document).ready(function(){

  //Global Variables
  var currentslidecount = 0;
  var seatnumber = 1;
  var routedist = 0;
  var routehours = 0;
  var chosencarfueleff = 0;
  var fuelcost = 0;
  var rentcost = 0;
  var totalcost = 0;
  var pickupdate;
  var returndate;
  var days = 0;

  //slick slider functions and settings
  function sliderfunc(){
    $('.inputdiv').slick({
      accessibility: false,
      draggable: false,
      infinite: false,
      arrows: false
    });

    $('.mapslider').slick({
      accessibility: false,
      draggable: false,
      infinite: false,
      arrows: false,
      fade: true
    });
  }
  sliderfunc();
  //**********

  // //Map init and settings
  function mapfunc(){
  	mapboxgl.accessToken = 'pk.eyJ1Ijoic2xhdHdvYiIsImEiOiJjamFzc3g5YzYxZmkzMndwaDlvd2M1N2ptIn0.grXwe6HOt8FdKKlumqIi3w';
  	var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/slatwob/cjabpcdvg3l6j2sqi1xcpuecp',
      center: [174.8860, -40.9006],
      zoom: 5
    });

    var directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric'
    });
      map.addControl(directions, 'top-left');

  //Direction Grabber
    directions.on('route', function(directions){
      routedist = directions.route['0'].distance / 100000;
      routehours = directions.route['0'].duration / 3600;
    });
  //**********

  }
  mapfunc();
  //**********

  //Button functions related to slick sliders, contains validation and modal interactions
  function buttonfunc(){
    $('.nextbtn').click(function(){
      topslidernext();
        switch (currentslidecount){
          case 0:
            $('.inputdiv').slick('slickNext');
            break;
          case 1:
            if (routedist > 0){
            $('.inputdiv').slick('slickNext');
            $('.daysrec').text((Math.floor((routehours / 8)))+2);
            }
            break;
          case 2:
            if (days > 0 && days < 16){
            $('.inputdiv').slick('slickNext');
            }
        }
  });

    $('.prevbtn').click(function(){
      $('.inputdiv').slick('slickPrev');
      topsliderprev();
    });
  }

  buttonfunc();

  function topslidernext(){
    switch (currentslidecount){
      case 0:
        $('.mapslider').slick('slickNext');
        break;
      case 3:
        $('#carmodal').modal({
          escapeClose: false,
          clickClose: false,
          showClose: false
        });
        errorpreventioncar();
    }
  }

  function topsliderprev(){
    switch (currentslidecount){
      case 1:
        $('.mapslider').slick('slickPrev');
        break;
      case 4:
        $('.mapslider').slick('slickPrev');
    }
  }
  //**********

  //Detect currently active slide
  function currentslidecountfunction(){
    $('.inputdiv').on('afterChange', function(event, slick, currentSlide, nextSlide){
      currentslidecount = currentSlide;
    });
  }
  currentslidecountfunction();
  //**********

  //Places information gathered from data.js file into a template
  function carinfo(carpick){
    $('.cargrid-subheader').text(data[carpick].smalltext);
    $('.cargrid-title').text(data[carpick].title);
    $('.cargrid-img').attr('src',data[carpick].imgsrc);
    $('.cargrid-seating').text((data[carpick].seats)+ ' Seat');
    $('.cargrid-fueleff').text(data[carpick].fueleff);
    $('.cargrid-desc').text(data[carpick].desc);
    chosencarfueleff = data[carpick].fuelmult;

    //Calculates fuel cost
    fuelcost = Math.floor((chosencarfueleff * routedist) * 2.14);
    $('.cargrid-gasprice').text(('$' + fuelcost));

    //Calculates rent cost
    rentcost = days * data[carpick].rentcost;
    $('.cargrid-rentprice').text(('$' + rentcost));

    //Calculates total cost
    totalcost = fuelcost + rentcost;
    $('.cargrid-totalprice').text(('$' + totalcost));

  }
  //**********

  //Selects a chosen vehicle to be displayed, closes modal and moves slider.
  function carchoice(){
    $('#motorbike').click(function(){
      var chosencar = 0;
      carinfo(chosencar);
      $('.inputdiv').slick('slickNext');
      $.modal.close();
      $('.mapslider').slick('slickNext');
    });

    $('#smallcar').click(function(){
      var chosencar = 1;
      carinfo(chosencar);
      $('.inputdiv').slick('slickNext');
      $.modal.close();
      $('.mapslider').slick('slickNext');
    });

    $('#largecar').click(function(){
      var chosencar = 2;
      carinfo(chosencar);
      $('.inputdiv').slick('slickNext');
      $.modal.close();
      $('.mapslider').slick('slickNext');
    });

    $('#motorhome').click(function(){
      var chosencar = 3;
      carinfo(chosencar);
      $('.inputdiv').slick('slickNext');
      $.modal.close();
      $('.mapslider').slick('slickNext');
    });
  }
  carchoice();
  //**********

  //Makes the seat number picker work, and adds error prevention
  function seatfunction(){
    $('#seatincrease').click(function(){
      if (seatnumber <= 5){ 
        seatnumber++;
      $('#seath1').text(seatnumber);
        validcarfunction();}
    });
    $('#seatdecrease').click(function(){
      if (seatnumber >= 2){ 
        seatnumber--;
      $('#seath1').text(seatnumber);
        validcarfunction();}
    });
  }
  seatfunction();
  //**********

  //Filters avaliable vehicles based on the input data
  function validcarfunction(){
    switch (seatnumber){
      case 1:
        $('#motorbike').show();
        $('#smallcar').show();
        $('#largecar').show();
        $('#motorhome').hide();
        break;
      case 2:
        $('#motorbike').hide();
        $('#smallcar').show();
        $('#largecar').show();
        $('#motorhome').show();
        break;
      case 3,4,5:
        $('#motorbike').hide();
        $('#smallcar').hide();
        $('#largecar').show();
        $('#motorhome').show();
        break;
      case 6:
        $('#motorbike').hide();
        $('#smallcar').hide();
        $('#largecar').hide();
        $('#motorhome').show();
        break;     
    }

    switch (days){
      case 1:
        $('#largecar').hide();
        $('#motorhome').hide();
        break;
      case 2:
        $('#largecar').hide();
        break;
      case 6,7,8,9,10:
        $('#motorbike').hide();
        break;
      case 11,12,13,14,15:
        $('#motorbike').hide();
        $('#smallcar').hide();
        $('#largecar').hide();
        break;     
    }
  }
  //**********

  //Turns the difference between two date inputs into a number
  function dateselectfunction(){
    pickupdate = new Date(document.getElementById('pickupdate').value);
    returndate = new Date(document.getElementById('returndate').value);
    days = parseInt((returndate - pickupdate) / (24 * 3600 * 1000));

  }

  $('#pickupdate').change(function(){
    dateselectfunction();
  });
  $('#returndate').change(function(){
    dateselectfunction();
  });
  //**********

  //Allows use of modals on the final slide, adds a functioning back button to the modals
  function modalbuttonfunc(){
    $('#carbrowserbtn').click(function(){
      $('#carmodal').modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
    });

    $('#contactbutton').click(function(){
      $('#contactmodal').modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
    });

    $('#backbutton, #backbutton2').click(function(){
      $.modal.close();
    });
  }
  modalbuttonfunc();
  //**********

  //Displays a message if there are no valid cars
  function errorpreventioncar(){
    if (($('#largecar').is(':hidden')) &&($('#smallcar').is(':hidden')) && ($('#motorbike').is(':hidden')) && ($('#motorhome').is(':hidden'))){
      $('.errorcar').show();
    } else{
      $('.errorcar').hide();
    }
  }
  //**********

});