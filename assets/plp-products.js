$('body').on('click', '.plp-item:not(.no-variants) .plp-item__button', function(){
    if ( $(this).closest('.plp-item').attr('data-state') === 'display-variants' ) {
        $(this).closest('.plp-item').attr('data-state', 'default');
    } else {
        $('.plp-item').attr('data-state', 'default');
        $(this).closest('.plp-item').attr('data-state', 'display-variants');
    }
});

$('body').on('click', '.plp-item .variant', function(e){
    e.stopPropagation();
    let variant = $(this).data('variant-id');
    let cartCounter = $('span.cart-count');
    let itemTile = $(this).closest('.plp-item');

    itemTile.attr('data-state', 'adding');

    CartJS.addItem(variant, 1, {}, {
        'success': function(data, textStatus, jqXHR) {

        itemTile.attr('data-state', 'success');
        cartCounter.show();
        cartCounter.html(CartJS.cart.item_count + 1);
        setTimeout(function() {
            itemTile.attr('data-state', 'default');
        }, 2000);

    },
    'error': function(jqXHR, textStatus, errorThrown) {
        var error = parseInt(jqXHR.status);
        if (error === 404 || error === 400) {
        itemTile.attr('data-state', 'error');
        setTimeout(function() {
            itemTile.attr('data-state', 'default');
        }, 1500);
        }
    }
    });

});

$('body').on('click', '.plp-item.no-variants .plp-item__button', function (e) {
  e.stopPropagation();
  let itemTile = $(this).closest('.plp-item');
  let variant = $(this).closest('.plp-item').data('default-variant');
  let cartCounter = $('span.cart-count');
  console.log('CCC', variant);
  itemTile.attr('data-state', 'adding');

  CartJS.addItem(variant, 1, {}, {
    'success': function (data, textStatus, jqXHR) {

      itemTile.attr('data-state', 'success');
      cartCounter.show();
      cartCounter.html(CartJS.cart.item_count + 1);
      setTimeout(function () {
        itemTile.attr('data-state', 'default');
      }, 2000);

    },
    'error': function (jqXHR, textStatus, errorThrown) {
      var error = parseInt(jqXHR.status);
      if (error === 404 || error === 400) {
        itemTile.attr('data-state', 'error');
        setTimeout(function () {
          itemTile.attr('data-state', 'default');
        }, 1500);
      }
    }
  });

});

let filterableSizes = [];

function updateSizes() {
  document.querySelectorAll('.plp-products .plp-item').forEach((product) => {
    let data = $(product).data();
    data = Object.keys(data)
    data.forEach((size) => {
      if (size.includes("size")) {
        let formattedSize = size.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        formattedSize = size.replace('_','-');
        if (filterableSizes.indexOf(formattedSize) === -1) {
          filterableSizes.push(formattedSize);
        }
      }
    });
  });
  console.log(filterableSizes);
  updateSizeFilters();
}
updateSizes();

function updateSizeFilters() {

  document.querySelectorAll('.shop-filter-toggle.size').forEach((filter) => {
    let size = filter.dataset?.filter;
    let active = false;

    filterableSizes.forEach((filterableSize) => {
      let formattedFilterableSize = `[data-${filterableSize}]`;
      if (formattedFilterableSize === size) {
        active = true;
      }
    });

    if (active) {
      filter.parentElement.classList.remove('disabled');
    } else {
      filter.parentElement.classList.add('disabled');
    }

  });
}

$(".active-filter.size").on('click', function (e) {
  e.preventDefault();
  console.log('xxxxx');
  $(this).remove();
  updateDisplayedSizes();
});

$(".shop-filter-toggle.size").on('click', function (e) {
  e.preventDefault();
  let $filters = $('.active-filters');
  let activeFilterLabel = $(this).data('filter');
  activeFilterLabel = activeFilterLabel.substring(1, activeFilterLabel.length - 1);
  let activeFilterId = activeFilterLabel.replace('data-', '');
  activeFilterLabel = activeFilterId.replace('size-', '').toUpperCase();
  let activeFilterButton = `<a class="active-filter size" data-id="${activeFilterId}" href="${window.location.href}">Size: ${activeFilterLabel}<span class="close">×</span></a>`;
  $('.active-filters .active-filter.size').remove();
  $filters.append(activeFilterButton);
  updateDisplayedSizes(activeFilterId);
});


function updateDisplayedSizes(id) {
  if (!id) {
    $('.plp-products .plp-item').removeClass('filtered-out');
    $('.plp-products .shoppable-look').removeClass('filtered-out');
    return;
  }
  window.activeSizeFilter = id;

  document.querySelectorAll('.plp-products .plp-item').forEach((product) => {
    let data = $(product).data();
    let filter = `${id}`;
    let active = false;
    data = Object.keys(data);
    let formattedFilter = filter.replace('-', '_');
    data.forEach((size) => {
      if (size === formattedFilter) {
        active = true;
      }
    });

    if (active) {
      product.classList.remove('filtered-out');
      $('.plp-products .shoppable-look').addClass('filtered-out');
    } else {
      product.classList.add('filtered-out');
    }
  });

  $infiniteScrollingContainer.infiniteScroll('loadNextPage');

}

window.displayedProducts = []

$('.plp-products .plp-item').each(function(){
  if ($(this).data('handle') && !window.displayedProducts.includes($(this).data('handle') )) {
    window.displayedProducts.push($(this).data('handle') )
  }
}); 

let $infiniteScrollingContainer, $infiniteScrollingItems;
function infiniteScrolling() {
  var infiniteScrollingInter = setInterval(function () {
    if (typeof undefined !== typeof InfiniteScroll) {

      $infiniteScrollingContainer = $('.plp-products').infiniteScroll({
        append: false, 
        history: false,
        path: ".plp-products__pagination .next a"
      });

      $infiniteScrollingContainer.on('load.infiniteScroll', function (event, response) {
        $infiniteScrollingItems = $(response).find('.plp-item');
        console.log('Displayed Before', window.displayedProducts);
        for (var key of Object.keys($infiniteScrollingItems)) {
          //console.log($infiniteScrollingItems[key]?.dataset?.handle, `Already Displayed: ${window.displayedProducts.includes($infiniteScrollingItems[key]?.dataset?.handle)} (${window.displayedProducts.length })`);
          if ($infiniteScrollingItems[key]?.dataset?.handle && !window.displayedProducts.includes($infiniteScrollingItems[key]?.dataset?.handle)) {
            window.displayedProducts.push($infiniteScrollingItems[key]?.dataset?.handle)
          } else {
            if ($infiniteScrollingItems[key] && $infiniteScrollingItems[key]?.classList) {
              $infiniteScrollingItems[key]?.classList.add('plp-duplicate'); 
            }
          }
        }

        //console.log('After', $infiniteScrollingItems);
        //console.log('Displayed After', window.displayedProducts);

        $infiniteScrollingContainer.infiniteScroll('appendItems', $infiniteScrollingItems);
        updateSizes();
        if (window.activeSizeFilter) {
          updateDisplayedSizes(window.activeSizeFilter)
        }

      });

      clearInterval(infiniteScrollingInter);
    } else {
      setTimeout(function () {
        clearInterval(infiniteScrollingInter);
      }, 5000);
    }
  }, 10);
}

infiniteScrolling();