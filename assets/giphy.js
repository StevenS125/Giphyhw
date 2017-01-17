	// initial array of giphy categories
	var topics = ["Ferrari", "Ford", "Pontiac", "Lexus", "Subaru", "Chevrolet", "Porsche"];

	// fucntion to make gifs appear 
	function displayGiphys(){
		//clear all the giphs already displayed
		$("#giphDisplay").empty();
		//get the components of the queryURL
		var giphTopic = $(this).attr("data-name");  
		var giphTopicCond = giphTopic.split(" ").join("+"); //combine multiple words into "example+example"
		var Results = "&limit=" + 10;
		var apiKey = "&api_key=dc6zaTOxFJmzC"
		//compile the query components into a queryURL
		var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + giphTopicCond + Results + apiKey;
		
		// AJAX call 
		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
			console.log(response);
			//store the results array
			var results = response.data;
			//display all the results that are returned
			for (var i = 0; i < response.data.length; i++){
				//create a div to hold giphy and rating
				var newDiv = $("<div>");
				newDiv.addClass("gifWrap");
				$("#giphDisplay").append(newDiv);
				//add the giphy to the new div
				var newGiphy = $("<img>");
				newGiphy.addClass("gif");
				newGiphy.attr("data-state", "still");
				newGiphy.attr("data-animateURL", results[i].images.fixed_height.url);
				newGiphy.attr("data-stillURL", results[i].images.fixed_height_still.url);
				newGiphy.attr("src", newGiphy.attr("data-stillURL"));
				newGiphy.attr("alt", giphTopic);
				newDiv.append(newGiphy);
				//add the rating below the giphy
				var newRating = $("<p>");
				newRating.text("Rating: " + results[i].rating);
				newGiphy.after(newRating);
			};
		});
	}

	// function to create buttons thru for loop of the topics array   
	function renderTopicButtons(){ 
		// clear out all the previous topic buttons before re-displaying the topic array
		$("#buttonDisplay").empty();
		for (var i = 0; i < topics.length; i++){
		    var topicButton = $("<button>") 
		    topicButton.addClass("topic-btn");
		    topicButton.attr("data-name", topics[i]); 
		    topicButton.text(topics[i]); 
		    $("#buttonDisplay").append(topicButton); 
		};
	}

	//function to check if the topic already has a button
	function topicCheck(topicTest, topicsArray){
		//create a result boolean and set to false because we presume no duplicate will be found
		var result = false;
		//loop through the current topicsarray, and return true if a duplicate is found
		for (var i = 0; i < topicsArray.length; i++){
			if (topicTest.toLowerCase() === topicsArray[i].toLowerCase()){  //compare topics array in lower case
				result = true;
				return result;
			};
		};
		//if no duplicate is found, return the result of false
		return result;
	}

	// add a new topic button when clicked 
	$("#topic-form-btn").on("click", function(){
		// grab the input from the textbox and trim it
		var newTopic = $("#topic-form-input").val().trim();
		// as long as there is something in the input box, and it"s not already a button, create the button
		if ((newTopic !== "") && (topicCheck(newTopic, topics) === false)){
			// add the new topic to the topic array
			topics.push(newTopic);
			// make topic buttons based on the updated array
			renderTopicButtons();
		};
		return false;
	})

	// display the giphys on click 
	$(document).on("click", ".topic-btn", displayGiphys);

	// makes gifs still or animate depending on current state
	$(document).on("click", ".gif", function(){
			//store the current state in a variable
            var state = $(this).attr("data-state");
			//switch the state and corresponding image
            if (state === "still") {
                $(this).attr("src", $(this).attr("data-animateURL"));
                $(this).attr("data-state", "animate");
				//add a class for css purposes
				$(this).addClass("playing-gif");
            } else {
                $(this).attr("src", $(this).attr("data-stillURL"));
                $(this).attr("data-state", "still");
				//remove class for css purposes
				$(this).removeClass("playing-gif");
            };
        });

	// make TopicButtons
	renderTopicButtons();