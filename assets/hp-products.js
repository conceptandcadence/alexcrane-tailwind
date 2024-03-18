let hpProducts = document.querySelector('.carousel-enabled.hp-products__products'); 
let hpProductsDesktopCount = hpProducts.dataset.cellCount;
let hpProductsCarousel;

$(document).ready(function(){
    if (hpProducts) {

        document.querySelectorAll('.hp-products__colorway:first-of-type').forEach((product, i) => {
            product.classList.add('active');
        });

        document.querySelectorAll('.carousel-enabled.hp-products__products').forEach((carousel, i) => {
            console.log(carousel, i);
        });
        
        if (window.innerWidth >= 700) {
            hpProductsCarousel = new Flickity( hpProducts, {
                cellSelector: '.hp-products__product',
                wrapAround: $('.hp-products').hasClass('wrap-around'), 
                cellAlign: 'left',
                imagesLoaded: true,
                pageDots: false,
                groupCells: false,
                prevNextButtons: false,
                arrowShape: { 
                    x0: 10,
                    x1: 60, y1: 50,
                    x2: 65, y2: 45,
                    x3: 20
                }
            });
        } else {
            hpProductsCarousel = new Flickity( hpProducts, {
                cellSelector: '.hp-products__product',
                wrapAround: true,
                imagesLoaded: true,
                pageDots: false,
                groupCells: false,
                prevNextButtons: false,
                arrowShape: { 
                    x0: 10,
                    x1: 60, y1: 50,
                    x2: 65, y2: 45,
                    x3: 20
                }
            });
        }
        
        hpProductsCarousel.resize();
        $('.hp-products__variant').on('click', function (evt) {
            $(this).closest('.hp-products__product').attr('data-active-handle', $(this).data('handle') );
            $(this).closest('.hp-products__colorway').removeClass('active');
            $('.hp-products__colorway[data-product="' + $(this).data('handle') + '"]').addClass('active');
        });
    }
});

$(window).load(function(){
  hpProductsCarousel.resize();
});

console.log(`Product slides: ${ document.querySelectorAll('.hp-products__product').length}`);