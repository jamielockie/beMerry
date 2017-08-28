let beMerryApp = {};
beMerryApp.app_id = '24e404ea';
beMerryApp.app_key = '95a80e7bc9f0d0ef9ff19b0fa772fb07';

// document ready
$(function() {
	beMerryApp.init();
});

// init function
beMerryApp.init = function() {
		beMerryApp.events();
	}

// function that handles events
beMerryApp.events = function() {
	$('.ingredientForm')
		.on('submit', function(e) {
			e.preventDefault();
			// Empty current results
			$('.winesContainer')
				.empty();
			$('.recipesContainer')
				.empty();
			// Collect Inputs
			let userChoiceOne = $(this)
				.find('.inputOne')
				.val();
			let userChoiceTwo = $(this)
				.find('.inputTwo')
				.val();
			let userChoiceThree = $(this)
				.find('.inputThree')
				.val();
			let choiceArr = [userChoiceOne, userChoiceTwo, userChoiceThree]
			beMerryApp.ingredientList = choiceArr.join();
			beMerryApp.getFood(beMerryApp.ingredientList);
		});

	let selectRecipe = $('.recipesContainer')
		.on('click', '.overlayBtn', function() {
			// empty Wine Container
			$('.winesContainer')
				.empty();
			$('.recipeCard')
				.removeClass('selected');
			$(this)
				.addClass('selected');
			// store recipe properties
			var fat = $(this)
				.data('fat');
			var salt = $(this)
				.data('salt');
			var sugar = $(this)
				.data('sugar');
			// Determine Wine Query
			if (beMerryApp.ingredientList.indexOf('chicken') != -1) {
				if (fat > 20) {
					wineQuery = 'marsanne bottle'
				} else {
					wineQuery = 'chablis france bottle'
				}
			} else if (beMerryApp.ingredientList.indexOf('beef') != -1) {
				if (fat > 20) {
					wineQuery = 'cabernet sauvignon australia bottle'
				} else {
					wineQuery = 'zinfandel california bottle'
				}
			} else if (beMerryApp.ingredientList.indexOf('fish') != -1) {
				if (fat > 20) {
					wineQuery = 'champagne france bottle '
				} else {
					wineQuery = 'roussanne france bottle'
				}
			} else if (beMerryApp.ingredientList.indexOf('vegetables') != -1) {
				if (fat > 20) {
					wineQuery = 'prosecco italy bottle '
				} else {
					wineQuery = 'pinot grigio france bottle'
				}
			} else {
				wineQuery = 'merlot bottle'
			}

			// Call getWine Function
			beMerryApp.getWine(wineQuery);
		});
};
beMerryApp.displayFood = function(recipes) {

		// For Each Recipe...
		recipes.forEach(function(recipe, index) {

					// Title Print  
					let recipeTitle = $('<div class="recipeTitleContainer">')
						.html(`<h3>${recipe.recipe.label}</h3>`);

					// Print Recipe Image with Overlay
					let recipeImg = $('<div class="container">')
						.html(`<img src='${recipe.recipe.image}'><div class='overlay'><button class='overlayBtn Btn'><i class="fa fa-glass" aria-hidden="true"></i> Get Wine </button> <button class='overlayBtn Btn'> <a href=${recipe.recipe.url} target='blank'><i class="fa fa-list" aria-hidden="true"></i> Get Recipe</a> </button></div>`);

					// retrieve recipe qualities
					let getFat = recipe.recipe.totalNutrients.FAT.quantity / recipe.recipe.yield;
					let getSalt = recipe.recipe.totalNutrients.NA.quantity / recipe.recipe.yield;
					let getSugar = recipe.recipe.totalNutrients.SUGAR.quantity / recipe.recipe.yield;
					
					// Create Card Div
					var recipeCard = $(`<div class="animated fadeInDown" data-fat= ${getFat} data-salt=${getSalt} data-sugar=${getSugar}>`)
						.addClass(`recipeCard card ${`card${index++}`}`).append(recipeImg, recipeTitle);

		// Print Card
		$('.recipesContainer').append(recipeCard);

		// scroll to Food Cards
		$('html,body').animate({
		     scrollTop: $(".recipesContainer").offset().top},
		     'slow');
	});
};

beMerryApp.displayWine = function(wines) {
	// For Each Recipe...
	wines.forEach(function(wine, index){
		// Title Print  
		let wineTitle = $('<h3>').text(wine.name);

		// Source Print
		let wineSource = `<a target='_blank' href=http://www.lcbo.com/lcbo/search?searchTerm=${wine.id}> Go To LCBO</a>`;

		// wine price
		let winePrice = `$${wine.price_in_cents / 100}`

		let wineImg = $('<div class="container">').html(`<img src='${wine.image_url}'><div class='overlay'><button class='overlayBtn Btn'><i class="fa fa-glass" aria-hidden="true"></i> ${wineSource} </button> </div>`);

		// Create Card Div
		var wineCard = $(`<div>`).addClass(`wineCard animated fadeInDown card ${`card${index++}`}`).append(wineImg, wineTitle);

		// Print Card
		$('.winesContainer').append(wineCard);

		// Scroll to Wine Cards
		$('html,body').animate({
			scrollTop: $(".winesContainer").offset().top},'slow');
	});
};



// A function that GETS food
beMerryApp.getFood = function(query1) {
	// make ajax request (food)
	$('.loadingIcon').addClass('loading');
	$.ajax({
		url: 'https://api.edamam.com/search',
		method: 'GET',
		dataType: 'json',
		data:{
			api_id: '24e404ea',
			api_key: '95a80e7bc9f0d0ef9ff19b0fa772fb07',
			q: `${query1}`,
			from: 0,
			to: 6,
		}
	}).then(function(res){
		$('.loadingIcon').removeClass('loading');
		var recipes = res.hits
		beMerryApp.displayFood(recipes);
	});
}

beMerryApp.getWine = function(wineQuery) {
	// make ajax request (wine)
	$.ajax({
		url: 'https://lcboapi.com/products',
		headers: { 
			'Authorization': 'Token MDo0ODRjZjIwOC04NzM3LTExZTctOWEyYS01ZmRmMTVhNDU3MjQ6MnJZTnNhYzJ1bkZXajY4SEkzNkRobFVtOHV1S1J6ck9PMGFD' 
		},
		method: 'GET',
		dataType: 'json',
		data:{
			access_key: 'MDpiNTU2MjAyMi04NzY0LTExZTctOGRhZC1jMzJlZDAzZDlkYjQ6RFpCT3lBOTdOaVY0QlpCYWNoWGw0NVhVRXlGcVVvRU02VGNK',
			q: wineQuery,
			where_not: 'is_dead',
			page: 1,
			per_page: 6
		}
	}).then(function(res){
		console.log(res);
		var wines = res.result
		console.log(res.result)
		beMerryApp.displayWine(wines);
	});
};