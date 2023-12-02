const placeIdInput = document.getElementById('placeIdInput');
const thumbnailImage = document.getElementById('thumbnailImage');
const mostTrackedGamesList = document.getElementById('mostTrackedGames');

// Function to update dropdown text for description
function updateDescriptionDropdown(resultId, description) {
  const dropdownContent = document.getElementById(`${resultId}Dropdown`);
  dropdownContent.textContent = description;
}

// Function to fetch game name by Universe ID
async function fetchGameName(universeId) {
  try {
    const response = await fetch(`https://corsproxy.io/?https://games.roblox.com/v1/games?universeIds=${universeId}`);
    const gameInfo = await response.json();

    if (gameInfo.data && gameInfo.data.length > 0) {
      return gameInfo.data[0].name || 'Name not found';
    } else {
      return 'Game name not found';
    }
  } catch (error) {
    console.error(`Error fetching game name for Universe ID ${universeId}:`, error);
    return 'Error fetching game name';
  }
}

// Function to fetch game info by Universe ID
async function fetchGameInfo(universeId) {
  try {
    const response = await fetch(`https://corsproxy.io/?https://games.roblox.com/v1/games?universeIds=${universeId}`);
    const gameInfo = await response.json();

    if (gameInfo.data && gameInfo.data.length > 0) {
      return gameInfo.data[0];
    } else {
      console.error('Game info not found');
      return null;
    }
  } catch (error) {
    console.error(`Error fetching game info for Universe ID ${universeId}:`, error);
    return null;
  }
}

// Function to fetch all most tracked games with names and track count
async function fetchMostTrackedGamesWithNames() {
  try {
    const response = await fetch('https://robloxgameinfo.000webhostapp.com/getMostTracked.php');
    const mostTrackedGames = await response.json();

    if (mostTrackedGames && mostTrackedGames.length > 0) {
      let gamesHTML = '';
      for (const game of mostTrackedGames) {
        const universeId = await convertPlaceIdToUniverseId(game.gameId);
        
        if (universeId) {
          const gameInfo = await fetchGameInfo(universeId);
          if (gameInfo) {
            gamesHTML += `
              <li>
                <strong>${gameInfo.name}</strong> - Track Count: ${game.trackNumber}
              </li>`;
          } else {
            gamesHTML += `<li>Game info not found for ID ${game.gameId}</li>`;
          }
        } else {
          gamesHTML += `<li>Game name not found for ID ${game.gameId}</li>`;
        }
      }
      mostTrackedGamesList.innerHTML = gamesHTML;
    } else {
      mostTrackedGamesList.innerHTML = '<li>No most tracked games available</li>';
    }
  } catch (error) {
    console.error('Error fetching most tracked games:', error);
    mostTrackedGamesList.innerHTML = '<li>Error fetching most tracked games</li>';
  }
}

// Function to convert Place ID to Universe ID
async function convertPlaceIdToUniverseId(placeId) {
  try {
    const response = await fetch(`https://corsproxy.io/?https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    const data = await response.json();
    return data.universeId || null;
  } catch (error) {
    console.error('Error converting Place ID to Universe ID:', error);
    return null;
  }
}

// Function to create a closed dropdown for specific game details
function createGameDetailDropdown(property, value) {
  const dropdownContainer = document.createElement('div');
  dropdownContainer.classList.add('game-detail-dropdown');

  const dropdownButton = document.createElement('button');
  dropdownButton.classList.add('dropbtn');

  const dropdownText = document.createElement('span');
  dropdownText.classList.add('dropdown-text');
  dropdownText.textContent = property;
  dropdownText.style.color = 'white'; // Set text color to white
  dropdownText.style.fontFamily = 'Poppins, sans-serif'; // Set font to Poppins
  dropdownButton.appendChild(dropdownText);

  // Create an SVG element for the dropdown icon
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgIcon.setAttribute("width", "32");
  svgIcon.setAttribute("height", "32");
  svgIcon.setAttribute("viewBox", "0 0 24 24");
  svgIcon.setAttribute("style", "fill: rgba(118, 118, 118, 1); background-color: transparent; transition: transform 0.3s ease");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z");

  svgIcon.appendChild(path);
  dropdownButton.appendChild(svgIcon);

  const dropdownContent = document.createElement('div');
  dropdownContent.classList.add('game-detail-content');
  dropdownContent.style.height = '0'; // Initially collapsed height
  dropdownContent.style.overflow = 'hidden';
  dropdownContent.style.transition = 'height 0.3s ease'; // Height animation
  dropdownContent.textContent = `${property}: ${value}`;
  dropdownContent.style.color = 'white'; // Set text color to white
  dropdownContent.style.fontFamily = 'Poppins, sans-serif'; // Set font to Poppins

  let isOpen = false;

  dropdownButton.onclick = function () {
    isOpen = !isOpen;
    if (isOpen) {
      dropdownContent.style.height = 'auto'; // Expand height
      svgIcon.style.transform = 'rotate(180deg)'; // Rotate icon
    } else {
      dropdownContent.style.height = '0'; // Collapse height
      svgIcon.style.transform = 'rotate(0deg)'; // Rotate icon back to initial position
    }
  };

  dropdownContainer.appendChild(dropdownButton);
  dropdownContainer.appendChild(dropdownContent);

  placeIdResult.appendChild(dropdownContainer);  
  dropdownText.style.lineHeight = '1.2'; // Adjust line height for dropdown text
  dropdownButton.classList.add('dropdown-button');

}

// Function to remove all elements with the class 'game-detail-dropdown'
function removeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.game-detail-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.remove();
  });
}

// Fetching game details by Universe ID
async function fetchGameDetails(universeId) {
  try {
    const response = await fetch(`https://corsproxy.io/?https://games.roblox.com/v1/games?universeIds=${universeId}`);
    const gameInfo = await response.json();

    if (gameInfo.data && gameInfo.data.length > 0) {
      const gameData = gameInfo.data[0];

      createGameDetailDropdown("Name", gameData.sourceName);
      createGameDetailDropdown("Description", gameData.sourceDescription);
      createGameDetailDropdown("Playing", gameData.playing);
      createGameDetailDropdown("Max players", gameData.maxPlayers);
      createGameDetailDropdown("Visits", gameData.visits);
      createGameDetailDropdown("Favourited", gameData.favoritedCount);
      createGameDetailDropdown("Creator Name", gameData.creator.name);
      createGameDetailDropdown("Creator Type", gameData.creator.type);
      createGameDetailDropdown("Creator ID", gameData.creator.id);
      createGameDetailDropdown("Genre", gameData.genre);
      createGameDetailDropdown("Created", gameData.created);
      createGameDetailDropdown("Updated", gameData.updated);
      createGameDetailDropdown("Is all genre", gameData.isAllGenre);
      createGameDetailDropdown("Can copy", gameData.copyingAllowed);
      createGameDetailDropdown("Price", gameData.price);
      createGameDetailDropdown("Allowed gears genre", gameData.allowedGearGenres);
      createGameDetailDropdown("Can create VIP Servers", gameData.createVipServersAllowed);
      createGameDetailDropdown("Universe avatar type", gameData.universeAvatarType);
      createGameDetailDropdown("Is genre enforced", gameData.isGenreEnforced);
      // Add more game details as needed...
    } else {
      placeIdResult.innerHTML = '<p>No data found for this Place ID.</p>';
    }
  } catch (error) {
    console.error('Error fetching game details:', error);
    placeIdResult.innerHTML = '<p>Error fetching game details.</p>';
  }
}

// Function to create the dropdown for description
function createDescriptionDropdown(description, resultId) {
  const dropdownContainer = document.createElement('div');
  dropdownContainer.classList.add('dropdown');

  const dropdownButton = document.createElement('button');
  dropdownButton.classList.add('dropbtn');

  // Create an SVG element for the dropdown icon
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgIcon.setAttribute("width", "32");
  svgIcon.setAttribute("height", "32");
  svgIcon.setAttribute("viewBox", "0 0 24 24");
  svgIcon.setAttribute("style", "fill: rgba(118, 118, 118, 1); background-color: transparent;");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z");

  svgIcon.appendChild(path);
  dropdownButton.appendChild(svgIcon);

  const dropdownContent = document.createElement('div');
  dropdownContent.classList.add('dropdown-content');
  dropdownContent.textContent = description;
  dropdownContent.id = `${resultId}Dropdown`; // Set a unique ID for the dropdown content

  dropdownButton.onclick = function () {
    const content = dropdownContent.style.display;
    dropdownContent.style.display = content === 'block' ? 'none' : 'block';
  };

  dropdownContainer.appendChild(dropdownButton);
  dropdownContainer.appendChild(dropdownContent);

  placeIdResult.appendChild(dropdownContainer);
}

// Function to display thumbnail
async function displayThumbnail(universeId) {
  try {
    const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
    const thumbnailData = await thumbnailResponse.json();

    if (thumbnailData.data && thumbnailData.data.length > 0) {
      const imageUrl = thumbnailData.data[0].imageUrl;
      thumbnailImage.src = imageUrl;
    } else {
      console.error('Thumbnail not found');
    }
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
  }
}

// Function to display game info for the entered ID
async function displayGameInfo(enteredPlaceId) {
  try {
    const response1 = await fetch(`https://corsproxy.io/?https://apis.roblox.com/universes/v1/places/${enteredPlaceId}/universe`);
    const data1 = await response1.json();

    console.log('First Request Result:', data1);

    if (!response1.ok) {
      console.error('Invalid ID');
      return; // Stop further execution if the ID is invalid
    }

    const universeId = data1.universeId; // Extracting universeId from the response

    const gameDetails = await fetchGameDetails(universeId);

    console.log('Game Details:', gameDetails);

    const gameInfoList = document.createElement('ul');

    for (const key in gameDetails) {
      const gameDetailItem = document.createElement('li');
      gameDetailItem.textContent = `${key}: ${gameDetails[key]}`;
      gameInfoList.appendChild(gameDetailItem);
    }

    mostTrackedGamesList.appendChild(gameInfoList);

    // Display Thumbnail
    try {
      const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
      const thumbnailData = await thumbnailResponse.json();

      console.log('Thumbnail Response:', thumbnailData);

      if (thumbnailData.data && thumbnailData.data.length > 0) {
        const imageUrl = thumbnailData.data[0].imageUrl;
        thumbnailImage.src = imageUrl;
      } else {
        console.error('Thumbnail not found');
      }
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
    }

      createDescriptionDropdown(description, universeId); // Call function to create dropdown for description with universeId

    // Update RobloxGameInfo as text
    try {
      const response = await fetch(`https://robloxgameinfo.000webhostapp.com/updateMostTrackedGame.php/?gameId=${enteredPlaceId}`);
      const data = await response.text(); // Get response as text

      console.log('Update RobloxGameInfo Result:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

placeIdInput.addEventListener('focus', function() {
  this.style.transition = 'width 0.3s, height 0.3s';
  this.style.width = '370px';
  this.style.height = '40px';
  console.log("Focus")
  removeAllDropdowns();
});

placeIdInput.addEventListener('blur', async function() {
  this.style.width = '350px';
  this.style.height = '30px';

  const enteredPlaceId = this.value.trim();

  if (enteredPlaceId !== '') {
    try {
      const response1 = await fetch(`https://corsproxy.io/?https://apis.roblox.com/universes/v1/places/${enteredPlaceId}/universe`);
      const data1 = await response1.json();

      console.log('First Request Result:', data1);

      if (!response1.ok) {
        console.error('Invalid ID');
        return; // Stop further execution if the ID is invalid
      }

      const universeId = data1.universeId; // Extracting universeId from the response

      const response2 = await fetch(`https://corsproxy.io/?https://games.roblox.com/v1/games?universeIds=${universeId}`);
      const responseData2 = await response2.json(); // Get response as JSON

      console.log('Second Request Result:', responseData2);

      // Make a request to the thumbnails endpoint
      const thumbnailResponse = await fetch(`https://corsproxy.io/?https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
      const thumbnailData = await thumbnailResponse.json();

      console.log('Thumbnail Response:', thumbnailData);

      if (thumbnailData.data && thumbnailData.data.length > 0) {
        const imageUrl = thumbnailData.data[0].imageUrl; // Get the imageUrl from the response
        thumbnailImage.src = imageUrl; // Display the image in the HTML
      } else {
        console.error('Thumbnail not found');
      }

      // Fetch game details by Universe ID
      await fetchGameDetails(universeId);

      const enteredGameId = enteredPlaceId;

      if (enteredGameId !== '') {
        try {
          // Update RobloxGameInfo as text
          const response = await fetch(`https://robloxgameinfo.000webhostapp.com/updateMostTrackedGame.php/?gameId=${enteredGameId}`);
          const data = await response.text(); // Get response as text

          console.log('Update RobloxGameInfo Result:', data);
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        console.error('Please enter a valid Game ID');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.error('Please enter a valid Roblox Universe ID');
  }
});

// Fetch most tracked games with names on page load
window.addEventListener('load', fetchMostTrackedGamesWithNames);