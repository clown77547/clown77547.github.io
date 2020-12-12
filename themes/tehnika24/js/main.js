"use strict";

$(document).ready(function () {
    $.getJSON("/ajax/get-cities-link")
        .done(function (data) {
            $("#inputCity").removeAttr("disabled");

            viewCity(data);

            $("#inputCity").on("input", function () {
                viewCity(data, this.value);
            });
        })
        .fail(function (jqXHR, textStatus) {
            console.log('[Cities] Error: ' + textStatus);
        });

    Inputmask({
        "mask": "+7 (\\999) 999-99-99",
        "onBeforePaste": function (pastedValue, opts) {
            return false;
        }
    }).mask($("input[type='tel']"));

    if (!isMobileDevice()) {
        $('body').addClass('desktop');
    }

    $('.request-form').submit(function (event) {
        event.preventDefault();

        let $form = $(this);
        let $tel = $form.find('input[type="tel"]');

        if (validatePhone($tel, $form)) {
            send(event.target);
            viewResponse($form);
        }
    });

    $('.openModalRequest').click(function (event) {
        $('#modalRequest').addClass('open');
        event.preventDefault();
    });

    $('.closeModalRequest').click(function (event) {
        $('#modalRequest').removeClass('open');
        event.preventDefault();
    });

    [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.onload = function() {
            img.removeAttribute('data-src');
        };
    });

    //fix
    $('#navbarCollapse')
        .on('show.bs.collapse', function () {
            $('.navbar').addClass('navbarPaddingFix');
        })
        .on('hidden.bs.collapse', function () {
            $('.navbar').removeClass('navbarPaddingFix');
        });

    $('#modalCity').on('shown.bs.modal', function () {
        $('#inputCity').trigger('focus');
    });

    //navbar-collapse
    $("#navbarCollapse ul li a").click(function() {
        if($(window).width() <= '767') {
            $('.navbar-toggler').trigger('click');
        }
      })
});

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function validatePhone($tel, $form) {
    let $error = $form.find('.alert-danger');
    let valid = /^[+][7][ ][(][0-9]{3}[)][ ][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/.test($tel.val());

    if (valid) {
        $error.html('');
        $error.slideUp(250);
        $tel.removeClass('invalid');

        return true;
    }

    $tel.addClass('invalid');
    $error.html('<div>Неверно введен номер телефона</div>');
    $error.slideDown(250);

    return false;
}

function viewResponse($form) {
    $form.find('.alert-success').slideDown(250);
    $form.find('input[type="submit"]').attr('disabled', true);
}

function viewCity(citiesLink, filter = null) {
    let html = '';

    $('.modal__city-body--search-chosen').width($('#inputCity').innerWidth());
    $(".modal__city-body--search-chosen").hide();

    if (filter) {
        for (let cityName in citiesLink) {
            let _cityName = cityName.toLowerCase();
            if (filter && _cityName.indexOf(filter.toLowerCase()) != 0) {
                continue;
            }
            html += '<li class="py-1"><a href="' + citiesLink[cityName] + '">' + cityName + '</a></li>'
        }

        if (!html) {
            html = '<li class="py-1">Ничего не найдено</li>';
        }

        $("#cityList").html(html);
        $(".modal__city-body--search-chosen").show();
    }
}

$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
};

var files;

function send(form) {
    $('#request-top-form').submit(function() { // проверка на пустоту заполненных полей. Атрибут html5 — required не подходит (не поддерживается Safari)
        $.ajax({
            type: "POST",
            url: "contacts.php",
            data: $(this).serialize()
        }).done(function() {
            $(this).find('input').val('');
            $('#form').trigger('reset');
        });
        return false;
    });
};