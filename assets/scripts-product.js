////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// Product Template Scripts                                                       //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////

window.app = window.app || {};
window.app.utils = window.app.utils || {};

app.utils.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let $productMainImages; 

app.product = {
    variantSelection: function () {
        let variantTitle = $('ul.variant-selector li.selected').data('variant');
        let productTitle = $('.product-info h1').text();

        if ( $('ul.variant-selector li.selected').length > 0 ) {
            if ( $('ul.variant-selector li.selected').hasClass('soldout') ) {
                if ( $('#single-product').hasClass('waitlist-enabled') ) {
                    if ( $('#single-product').hasClass('waitlist-enabled') ) {
                        $('#ProductSubmitForm button[type="submit"]').addClass('waitlist');
                        $('#single-product .waitlist').addClass('enabled');
                        $('#single-product .waitlist input[aria-label="Waitlist Product"]').val( productTitle + ' | ' + variantTitle  );
                        $('.waitlist-form input[aria-label="Waitlist Signup Date"]').val( $('.waitlist-form').data('date') );
                        $('.status-overlay div').removeClass('active');
                        $('.status-overlay div.status-waitlist').addClass('active');
                        $('.klaviyo-bis-trigger').addClass('active');
                        
                    } else {
                        $('#ProductSubmitForm button[type="submit"]').addClass('unavailable');
                        $('.status-overlay div.status-outofstock').addClass('active');
                        $('.klaviyo-bis-trigger').removeClass('active');
                    }
                } else {
                    $('#ProductSubmitForm button[type="submit"]').removeClass('unavailable').removeClass('waitlist');
                    $('#single-product .waitlist').removeClass('enabled');
                    $('.status-overlay div').removeClass('active');
                    $('.klaviyo-bis-trigger').removeClass('active');
                }
            } else {
                $('.klaviyo-bis-trigger').removeClass('active');
            }
            if ( $('ul.variant-selector li.selected').hasClass('preorder') ) {
                $('#ProductSubmitForm button[type="submit"]').removeClass('waitlist');
                $('#ProductSubmitForm button[type="submit"]').addClass('preorder');
                $('#single-product .preorder').addClass('enabled');
                $('#single-product .preorder input[aria-label="Waitlist Product"]').val( productTitle + ' | ' + variantTitle  );
                $('.waitlist-form input[aria-label="Waitlist Signup Date"]').val( $('.waitlist-form').data('date') );
                $('.status-overlay div').removeClass('active');
                $('.status-overlay div.status-preorder').addClass('active');
                $('ul.preorder-info li[data-id="' + variantID + '"]').addClass('active');
                $('.klaviyo-bis-trigger').removeClass('active');
                if ( $('#single-product').hasClass('waitlist-enabled #AddToCart') ) {
                    $('#single-product .waitlist').addClass('enabled');
                    $('#single-product .waitlist input[aria-label="Waitlist Product"]').val( productTitle + ' | ' + variantTitle  );
                }
            }
        }
    },
    imageSlider: function () {
        var setInter = setInterval(function() {
            if (document.querySelectorAll('.main-image-wrapper').length > 0) {
                $productMainImages = $('.product-images .images').flickity({
                    cellSelector: '.main-image-wrapper',
                    wrapAround: true,
                    watchCSS: true,
                    imagesLoaded: true, 
                    pageDots: true, 
                    prevNextButtons: false,
                    adaptiveHeight: false,
                    dragThreshold: 10,
                    touchVerticalScroll: true,
                    cellAlign: 'left'
                });
                $productMainImages.flickity('resize');
                productMainImagesData = $productMainImages.data('flickity');
                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 10000);
            }
        }, 10);
    },



		productNotes: function () {
        var setInter = setInterval(function() {
            if (document.querySelectorAll('#colorset-wrapper').length > 0) {
                $( ".variant-selector li" ).on( "click", function() {
										updateVariantSizeHelper();
                    if ($(this).hasClass('soldout')) {
												$('body').addClass('waitlist-enabled');
                        $('.product-purchase-wrapper').addClass('waitlist-enabled');
                        $('.stickyPurchase__button').addClass('waitlist-enabled');
                    } else {
												$('body').removeClass('waitlist-enabled');
                        $('.product-purchase-wrapper').removeClass('waitlist-enabled');
                        $('.stickyPurchase__button').removeClass('waitlist-enabled');
                    }
                    if ( $(this).data('size-note') !== '' ) {
                      let sizeNote = $(this).data('size-note');
                      sizeNote = sizeNote.replaceAll('&nbsp;', ' ');
                        $('.stickyPurchase__notes .size-note').text( sizeNote );
                        $('.stickyPurchase__notes').addClass('active');
												$('body').addClass('sticky-purchase-active');
                    } else {
                        $('.stickyPurchase__notes').removeClass('active');
                        $('.stickyPurchase__notes .size-note').text( '' );
												$('body').removeClass('sticky-purchase-active');
                    }
                });
                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 5000);
            }
        }, 10);
    },
    sizingChart: function () {
        if (document.querySelectorAll('.sizing-chart').length > 0) {
            $('body').on('click', '.display-size-chart', function (e) {
                e.preventDefault();
                $('html').addClass('search--hidden');
                $('.sizing-chart').removeClass('inactive');
                $('.sizing-chart__close').focus();

                disableSearchVisibility();
                disableBodyScroll('mobile');
            });
            $('.toggle-sizing-unit').on('click', function (e) {
                e.preventDefault();
                $('.sizing-chart').attr('data-view', $(this).data('unit') );
            });
            $('.sizing-chart__close').on('click', function (e) {
                e.preventDefault();  
                $('html').removeClass('search--hidden');
                $('.sizing-chart').addClass('inactive');
                enableBodyScroll('mobile');
                enableSearchVisibility();
            });
            $(document).on('keydown', function(e){
                if (e.which === 27 && e.type === "keydown") {
                  e.preventDefault();
                  $('.sizing-chart').addClass('inactive');
                }
            });
        }
    },
    loadColors: function () {
      var setInter = setInterval(function() {
          if (document.querySelectorAll('#colorset-wrapper').length > 0) {
            let colorset = window.colorSets[$('#colorset').data('colorset')];

            if ($('#colorset').length > 0) {
                var currentColor = $('#colorset').data('color');
                currentColor = currentColor.replace('-',' ');
                if (colorset !== undefined) {
                    for (var i = 0; i < colorset.length; i++) {
                        if ( colorset[i].title !== '' ) {
                            var colorOrder = '24'; // Force all colors with unassigned order values to the end
                            if (colorset[i].order !== '') {
                                colorOrder = colorset[i].order; 
                            }

                          let collections = colorset[i]?.collections;
                          let excluded = false;
                          if (collections) {
                            collections.forEach((collection) => {
                              console.log(collection.handle);
                              if (collection.handle === 'sale') {
                                excluded = true;
                              }
                            });
                          }

                          if (colorset[i].url && !excluded) {
                              if (colorset[i].title.toLowerCase() === currentColor) {
                                  $( "#colorset" ).append( '<li class="selected" style="background-image: url(' + colorset[i].image + '); order:' + colorOrder + ';"><a href="' + colorset[i].url + '"><span class="visually-hidden">' + colorset[i].title + '</span></a></li>' );
                              } else {
                                  $( "#colorset" ).append( '<li style="background-image: url(' + colorset[i].image + '); order:' + colorOrder + ';"><a href="' + colorset[i].url + '"><span class="visually-hidden">' + colorset[i].title + '</span></a></li>' );
                              }
                          }
                        }
                    } 
                    var colorsetWidth = ($("ul#colorset li").outerWidth() + 8) * $("ul#colorset li").length;
                    if ( $("ul#colorset li").length > 7 ) {
                        $("#colorset").width(colorsetWidth);
                    } else {
                        $("#colorset-wrapper").css('overflow','hidden');
                    }
                    $("#colorset").removeClass('init');
                } 
                let selectedColor = jQuery('#colorset-wrapper li.selected a').text();
                $('[data-selected-color]').text(selectedColor);
                if ( $("ul#colorset li").length < 9 ) {
                    $('.colorset-instructions').hide();
                } else {
                    $("ul#colorset").addClass( 'display', 'flex' ); 
                }
            } 
            clearInterval(setInter);
          } else {
            setTimeout(function() {
                clearInterval(setInter);
            }, 5000);
          }
      }, 10);
  },
  recommendedProducts: function () {
    var setInter = setInterval(function() {
        if (document.querySelectorAll('.rebuy-recommended-products.pdp .primary-title').length > 0) {
            $('.rebuy-recommended-products .primary-title').text('Complete the Look');
            clearInterval(setInter);
        } else { 
            setTimeout(function() {
                clearInterval(setInter);
            }, 10000);
        }
    }, 10);
  },
  productReviews__snippet: function () {
    var setInter = setInterval(function() {
        if (document.querySelectorAll('.product-rating a.text-m').length > 0) {
            let reviewStarText = $('.product-rating a.text-m').text();
            reviewStarText = reviewStarText.replace(' Reviews', '');
            $('.product-rating a.text-m').text(reviewStarText);
            clearInterval(setInter);
        } else {
            setTimeout(function() {
                clearInterval(setInter);
            }, 5000);
        }
    }, 10);
  },
  productReviews__section: function () {
    var setInter = setInterval(function() {
        if (document.querySelectorAll('.yotpo-reviews.yotpo-active').length > 0) {
            let reviewScore = $('.avg-score').text();
            let reviewCount = $('.reviews-amount').text();
            reviewCount = reviewCount.replace(' Reviews', '');
            $('.reviews-overview__average').text(reviewScore);
            $('.reviews-overview__count').text(reviewCount);
            let reviewNumber = parseFloat(document.querySelector('.avg-score')?.innerHTML);
            let reviewStars = document.querySelectorAll('.reviews-overview__star');
            for (let i = 0; i < reviewStars.length; i++) {
                let starFill = '0%';
                if (reviewNumber > 0) {
                    starFill = `${app.utils.clamp(reviewNumber, 0, 1) * 100}%`;
                    reviewStars[i].style.width = starFill;
                    reviewNumber = reviewNumber - 1;
                }
            }
            if ( document.querySelectorAll('.yotpo-no-reviews').length == 0 ) {
                $('.product-reviews').removeClass('no-yotpo-reviews');
            }
            clearInterval(setInter);
        } else {
            setTimeout(function() {
                clearInterval(setInter);
            }, 5000);
        }
    }, 10);
  },
  productMaterialHeadline: function () {
    if (document.querySelectorAll('.product-material-headline li').length) {
        $('.product-material-headline li').first().addClass('active');
    }
    var setInter = setInterval(function() {
        if (document.querySelectorAll('.product-material-headline').length > 0) {
            if ( $('.product-material-headline .active').next('li').length > 0 ) {
                $('.product-material-headline .active').addClass('exiting-active').removeClass('active').next().addClass('active').removeClass('exiting-active');
            } else {
                $('.product-material-headline .active').addClass('exiting-active').removeClass('active')
                $('.product-material-headline li').first().addClass('active').removeClass('exiting-active');
            }
        } 
    }, 5000);
  },
    relatedProducts: function () {
        var setInter = setInterval(function() {
            if (document.querySelectorAll('.rebuy-recommended-products.pdp .rebuy-product-grid.flickity-enabled').length > 0) {
                $( ".rebuy-recommended-products.pdp .rebuy-product-grid .rebuy-product-block" ).each(function() {
                    let variantSelector = $(this).find('.rebuy-select');
                    let purchaseVariants = ``;

                    $(variantSelector).find('option').each(function(){
                        let variant = {
                            id: $(this).val(),
                            title: $(this).text(),
                            price: $(this).closest('.rebuy-product-block').find('.rebuy-product-title').text(),
                            productTitle: $(this).closest('.rebuy-product-block').find('.rebuy-product-price .rebuy-money').text(),
                        };
                        let variantTemplate = `
                            <li class="variant" 
                                data-variant="${variant.title}"
                                data-variant-id="${variant.id}"
                                data-product="${variant.productTitle}"
                                data-price="${variant.price}">                         
                                <span class="label">${variant.title}</span>
                            </li> 
                        `;
                        purchaseVariants += variantTemplate;
                    });

                    let purchaseTemplate = `
                          <div class="plp-item__purchase">
                                <div class="plp-item__sizes">
                                    <ul class="plp-item__size-list">
                                        ${purchaseVariants}
                                    </ul>
                                </div>
                                <div class="plp-item__button">
                                    <span class="default">Quick Add</span>
                                    <span class="select-size">Select a size</span>
                                    <span class="adding">Adding to cart...</span>
                                    <span class="success">Added to cart!</span>
                                    <span class="error">Sorry there was a problem</span>
                                </div>
                            </div>
                    `;
                    $(this).append(purchaseTemplate);
                    $(this).addClass('plp-item')
                    $(this).attr('data-state', 'default')

                });
                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 5000);
            }
        }, 10);
    },
  stickyPurchase: function () {
    if (typeof jQuery == 'function' && document.querySelectorAll('.product-purchase-cta').length) {
        var setInter = setInterval(function() {
            if (!document.querySelectorAll('.stickyPurchase').length && document.querySelectorAll('.product-purchase-cta button').length) {
                let mustSelectSize = '';
                let stickyPurchaseNotes = 'stickyPurchase__notes';
                if ($('.product-purchase-wrapper').data('must-select-size')) {
                   mustSelectSize = 'must-select-size';
                } else {
                   stickyPurchaseNotes = 'stickyPurchase__notes visually-hidden';
                }

                var initialLoadPrice = jQuery('.product-info .product-price').text().trim().replace('$', '');
                var stickyContainer = `
                <div class="stickyPurchase ${mustSelectSize} purchase-container">
                    <div class="${stickyPurchaseNotes}">
                        <span class="size-note">Sits snug. Recommended for a 29-30 inch waist</span>
                        <a class="display-size-chart" href="#"><span>Size Chart</span></a>
                    </div>
                    <div class="stickyPurchase__sizes"></div>
                    <div class="stickyPurchase__buttons">
                        <div class="stickyPurchase__button"></div>
                        <div class="stickyPurchase__select-size">
                            <span class="select-size">Please select a size</span>
                            <a class="display-size-chart" href="#"><span>Size Chart</span></a>
                        </div>
                    </div>
                </div>
                `;
                jQuery(stickyContainer).appendTo('body').addClass("stickyPurchase--visible");
                app.product.product__updatePrice('product');

                // Button
                jQuery('.product-purchase-cta button').clone().appendTo('.stickyPurchase .stickyPurchase__button');
                jQuery('.stickyPurchase__button .available').append('<span class="seperator">&mdash;</span><span class="display-price"></span>');

                // Sizes
                jQuery('.variant-selector').clone().appendTo('.stickyPurchase .stickyPurchase__sizes');
                jQuery('.stickyPurchase__sizes .variant-selector');
                jQuery('.stickyPurchase__sizes .variant-selector li').css('height','');
                jQuery('.stickyPurchase__sizes .variant-selector label').css('lineHeight','').css('fontSize','');
    
                jQuery('.variant-selector label').on('click', function() {
                    jQuery('.variant-selector li').removeClass('selected');
                    jQuery(this).closest('li').addClass('selected');
                    jQuery('.purchase-container').removeClass('must-select-size');
                    app.product.product__updatePrice();
                })
                jQuery(document).on('click', '.stickyPurchase button', function() {
                    app.product.product__updatePrice();
                    jQuery("#ProductSubmitForm button").click();
                })
                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 4000);
            }
        }, 10);
    }
  },
  stickyPurchaseBIS: function () {
    var setInter = setInterval(function() {
        if (document.querySelectorAll('.klaviyo-bis-trigger').length > 0 && document.querySelectorAll('.stickyPurchase__button').length > 0) {
            jQuery('.klaviyo-bis-trigger').clone().appendTo('.stickyPurchase__button');
            clearInterval(setInter);
        } else {
            setTimeout(function() {
                clearInterval(setInter);
            }, 10000);
        }
    }, 10);
},
productLightbox: function () {
    var setInter = setInterval(function() {
        if (document.querySelectorAll('.swipebox').length > 0) { 
          if ($(window).width() <= 699) {
            $( '.swipebox' ).swipebox( {
                useSVG : true, 
                removeBarsOnMobile : false,
                hideBarsDelay : 10000,
                beforeOpen: disableSearchVisibility(),
                afterOpen: function() {
									$('.swipebox.main-video-wrapper').each(function() {
										let slideIndex = $(this).data('index');
										let slideVideo = $(this).find('video').clone();
										window.slideIndex = slideIndex;
										window.slideVideo = slideVideo;
										console.log('--------------------------------');
										console.log(slideIndex);
										console.log(slideVideo);
										$(`#swipebox-slider .slide:nth-child(${slideIndex})`).addClass('video-slide');
										setTimeout(function () {
											$(`#swipebox-slider .slide:nth-child(${slideIndex}) img`).remove();
											$(`#swipebox-slider .slide:nth-child(${slideIndex})`).append(slideVideo);
										}, 5000);
									});
								}, 
                afterClose: enableSearchVisibility(),
                loopAtEnd: true
            });
            clearInterval(setInter);
          } else {
            $( '.swipebox' ).on('click', function(e){
              e.preventDefault();
              if ( $(this).hasClass('zoom-active') ) {
                $(this).removeClass('zoom-active');
              } else {
                $('.zoom-active').removeClass('zoom-active');
                $(this).addClass('zoom-active');
              }
            });
            $('.img-zoom-wrapper').each(function() {
                $(this).zoom({
                    url: $(this).parent().attr('href')
                }); 
            });
            clearInterval(setInter);
          }
        } else {
            setTimeout(function() {
            clearInterval(setInter);
            }, 5000);
        }
    }, 10);
},
product__updatePrice: function (mode = 'variants') {
  if (mode === 'variants') {
    var price = jQuery('.variant-selector li.selected').attr('data-price-formatted');
  } else {
    var price = jQuery('#single-product .product-price').text();
  }
  setTimeout(function() {
    jQuery('.stickyPurchase__button .available .display-price').html(price);
  }, 100);
}
}

app.tests = {
    product__PaymentOptions: function () {
        var setInter = setInterval(function() {
            if (document.querySelectorAll('catch-callout').length > 0 && document.querySelectorAll('afterpay-placement').length > 0) {
                $('<div class="payment-options"></div>').appendTo("#ProductSubmitForm");
                $('catch-callout').prependTo('.payment-options');
                $('afterpay-placement').appendTo('.payment-options');
                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 5000);
            }
        }, 10);
    },

    product__Colors: function () {
        var setInter = setInterval(function() {
            if (document.querySelectorAll('#colorset-wrapper').length > 0) {
                let variant = jQuery('#colorset-wrapper li.selected a').text();
                $('#colorset-wrapper').before(`<div class="color-label-wrapper"><div class="color-label"><span class="label">Color:</span><span class="color">${variant}</span></div></div>`);
                $('.colorset-instructions').clone().appendTo('.color-label-wrapper');
                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 5000);
            }
        }, 10);
    },
    product__Details: function () {
        var setInter = setInterval(function() {
            if (document.querySelectorAll('.product-description').length > 0) {
                $('.product-description').insertBefore( $('.product-details') );

                clearInterval(setInter);
            } else {
                setTimeout(function() {
                    clearInterval(setInter);
                }, 5000);
            }
        }, 10);
    }
}

$('.toggle-expand-images').on('click', function(e){
  e.preventDefault();
  $('.images').addClass('images-expanded');
  $('.toggle-expand-images').remove();
});

$('.expand-details-toggle').on('click', function(e){
  e.preventDefault();
  $('.product-details').addClass('details-expanded');
});

function enableSearchVisibility() {
    document.querySelector('body').classList.remove('search--hidden');
}
function disableSearchVisibility() {
    document.querySelector('body').classList.add('search--hidden');
}
function enableBodyScroll(mode) {
    let modifier = '';
    if (mode === 'mobile') {
        modifer = '--mobile';
    }
    document.querySelector('body').classList.remove(`scroll-lock${modifer}`);
}
function disableBodyScroll(mode) {
    let modifier = '';
    if (mode === 'mobile') {
        modifer = '--mobile';
    }
    document.querySelector('body').classList.add(`scroll-lock${modifer}`);
}

app.product.variantSelection();
app.product.imageSlider();
app.product.sizingChart();
app.product.stickyPurchase();
app.product.recommendedProducts();
app.product.productReviews__snippet();
app.product.productReviews__section();
app.product.productMaterialHeadline();
app.product.loadColors();
app.product.relatedProducts();
app.product.productNotes();
app.product.stickyPurchaseBIS();
app.product.productLightbox();

let sizingHelperText;
let currentSelectedSize;
let recommendedSizing;

function updateVariantSizeHelper() { 
	currentSelectedSize = $('.variant-selector li.selected').data('variant');
	if (window.productSizingHelper != undefined) { 
		sizingHelperText = window.productSizingHelperText;
		recommendedSizing = window.productSizingHelper?.[currentSelectedSize];
		if (window.productSizingHelperRange) {
				recommendedSizing = recommendedSizing.replace('-','/');
		}
		sizingHelperText = sizingHelperText.replace('[size]', recommendedSizing );
		console.log(currentSelectedSize);
		console.log(window.productSizingHelper);
		console.log(window.productSizingHelper[currentSelectedSize]);
		console.log(sizingHelperText);
		console.log('--------------------------------------------------------');

		document.documentElement.style.setProperty('--sizing-note', "'Size " + currentSelectedSize +  " typically fits a " + sizingHelperText + ". '");
		document.documentElement.style.setProperty('--sizing-note-desktop', "'Typically fits a " + sizingHelperText + "'");
		$('[data-selected-size]').text(currentSelectedSize).addClass('show-size-note');
		$('.size-note').addClass('show-size-note')
	} else {
		$('[data-selected-size]').text(currentSelectedSize);
	} 
}

function adjustMobileColorSwatches() {
	$('#colorset').removeClass('colorset-flex');
	$('#colorset').width('')
	setTimeout(function(){
		$('#colorset').removeClass('colorset-flex');
		var colorsetWidth = ($("ul#colorset li").outerWidth() + 8) * $("ul#colorset li").length;
		$('#colorset').width( colorsetWidth );
		setTimeout(function(){
			$('#colorset').addClass('colorset-flex');
		}, 100);  	
	}, 100);
}

window.windowSize = $(window).width();
$(document).on('ready', function () {
	adjustMobileColorSwatches();
});
$(window).on('resize', function () {
	if (window.windowSize !== $(window).width()) {
		adjustMobileColorSwatches();
	}
});