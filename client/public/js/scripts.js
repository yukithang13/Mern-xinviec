/*!
 * Start Bootstrap - Freelancer v6.0.4 (https://startbootstrap.com/themes/freelancer)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
 */
(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 71,
          },
          1000,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });

  // // Scroll to top button appear
  // $(document).scroll(function() {
  //   var scrollDistance = $(this).scrollTop();
  //   if (scrollDistance > 100) {
  //     $('.scroll-to-top').fadeIn();
  //   } else {
  //     $('.scroll-to-top').fadeOut();
  //   }
  // });

  // // Closes responsive menu when a scroll trigger link is clicked
  // $('.js-scroll-trigger').click(function() {
  //   $('.navbar-collapse').collapse('hide');
  // });

  // // Activate scrollspy to add active class to navbar items on scroll
  // $('body').scrollspy({
  //   target: '#mainNav',
  //   offset: 80
  // });

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };

  // // Collapse now if page is not at top
  // navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // // Floating label headings for the contact form
  // $(function() {
  //   $("body").on("input propertychange", ".floating-label-form-group", function(e) {
  //     $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  //   }).on("focus", ".floating-label-form-group", function() {
  //     $(this).addClass("floating-label-form-group-with-focus");
  //   }).on("blur", ".floating-label-form-group", function() {
  //     $(this).removeClass("floating-label-form-group-with-focus");
  //   });
  // });
  var x, i, j, l, ll, selElmnt, a, b, c;
  /*look for any elements with the class "custom-select":*/
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
  except the current select box:*/
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  /*if the user clicks anywhere outside the select box,
then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);
})(jQuery); // End of use strict
