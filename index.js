const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs');
      bodyParser = require('body-parser'),
      uuid = require('uuid');
      app = express(),

// Serve the “documentation.html” file from the public folder
app.use(express.static('public'));

// Parse incoming request (POST)
app.use(bodyParser.json());

// Users Data
let users = [
  {
    Username: "Sophie",
    Favorites: ["Soul", "Kedi"]
  },

  {
    Username: "Nerina",
    Favorites: []
  },
]

// Movies Data
let movies = [
  {   
    Title: "A Street Cat Named Bob",
    Img: "/img/a_street_cat_named_bob.jpg",
    Director: "Roger Spottiswoode",
    Cat: { 
      Name: "Bob", 
      ColorBreed: "Ginger tabby", 
      Bio: "Bob is a real-life stray cat who becomes the companion of a homeless man struggling with addiction. Their story is based on true events and shows how Bob helps his owner turn his life around." 
    },
    Genre: "Biography, Drama", 
    Year: "2016", 
    Synopsis: "Based on a true story, the film follows a homeless man struggling with addiction who befriends a stray cat, Bob, and finds a new purpose in life." 
  },

  {
    Title: "Alice in Wonderland",
    Img: "/img/alice_in_wonderland.jpg",
    Director: "Clyde Geronimi, Wilfred Jackson, Hamilton Luske",
    Cat: {
      Name: "Cheshire Cat",
      ColorBreed: "Purple stripes, can be invisible",
      Bio: "The Cheshire Cat is known for his mischievous grin and ability to disappear and reappear at will, adding to the surreal atmosphere of Wonderland."
    },
    Genre: "Animation, Adventure",
    Year: "1951",
    Synopsis: "In this classic Disney adaptation of Lewis Carroll's story, Alice follows the White Rabbit into Wonderland, where she encounters the mischievous Cheshire Cat, known for his wide grin and disappearing acts."
  },
  
  {  
    Title: "An American Tail",
    Img: "/img/an_american_tail.jpg",
    Director: "Don Bluth",
    Cat: {
      Name: "Tiger",
      ColorBreed: "Large orange tabby cat",
      Bio: "Tiger is a kind-hearted, vegetarian cat who befriends Fievel. He provides comic relief and contrasts with the villainous cats."
    },
    Genre: "Animation, Adventure",
    Year: "1986",
    Synopsis: "A young mouse named Fievel embarks on a journey to America, facing the dangers posed by cats along the way as he tries to reunite with his family."
  },

  {  
    Title: "Cats",
    Img: "/img/cats.jpg",
    Director: "Tom Hooper",
    Cat: {
      Name: "Various characters such as Rum Tum Tugger, Mr. Mistoffelees, and Grizabella.",
      ColorBreed: "Varies, the cats are anthropomorphized in the film.",
      Bio: "Based on the famous musical, Cats features a tribe of cats called the Jellicles, who gather for an annual event where they decide which cat will ascend to the Heaviside Layer and be reborn."
    },
    Genre: "Musical, Fantasy",
    Year: "2019",
    Synopsis: "Based on the famous musical, this film follows a tribe of cats called the Jellicles as they make a decision about which one will ascend to the Heaviside Layer."
  },

  {   
    Title: "Cats Don't Dance",
    Img: "/img/cats_dont_dance.jpg",
    Director: "Mark Dindal",
    Cat: {
      Name: "Danny",
      ColorBreed: "Domestic shorthair, white with orange spots",
      Bio: "Danny is a small-town cat with big dreams of becoming a star in Hollywood. He faces various challenges but remains determined to achieve his dream."
    },
    Genre: "Animation, Comedy, Family",
    Year: "1997",
    Synopsis: "A small-town cat with big dreams moves to Hollywood, where he discovers that only humans get leading roles in movies, but he refuses to give up on his dream."
  },
  
  {   
    Title: "Coraline",
    Img: "/img/coraline.jpg",
    Director: "Henry Selick",
    Cat: {
      Name: "The Black Cat",
      ColorBreed: "Black",
      Bio: "A mysterious black cat that helps Coraline navigate a parallel world and warns her of its dangers."
    },
    Genre: "Animation, Drama, Fantasy",
    Year: "2009",
    Synopsis: "A young girl discovers a parallel world where everything seems perfect, but she soon realizes there's a dark side to it. A mysterious black cat helps her navigate the dangers."
  },

  {   
    Title: "Felidae",
    Img: "/img/felidae.jpg",
    Director: "Michael Schaack",
    Cat: {
      Name: "Francis",
      ColorBreed: "Domestic gray shorthair",
      Bio: "Francis is a domestic cat who becomes involved in a series of grisly murders in his neighborhood, leading him into a dark and disturbing mystery."
    },
    Genre: "Animation, Crime, Mystery",
    Year: "1994",
    Synopsis: "In this dark animated thriller, a domestic cat named Francis uncovers a series of grisly murders in his neighborhood, leading him into a disturbing mystery."
  },

  {  
    Title: "Gay Purr-ee",
    Img: "/img/gay_purr-ee.jpg",
    Director: "Abe Levitow",
    Cat: {
      Name: "Mewsette",
      ColorBreed: "White Persian",
      Bio: "Mewsette is a country cat who travels to Paris, where she becomes involved in the city’s glamour and learns the value of home and true love."
    },
    Genre: "Animation, Adventure, Comedy",
    Year: "1962",
    Synopsis: "A country cat named Mewsette travels to Paris, where she gets caught up in the city's glamour but eventually learns the value of home and true love."
  },
  
  {   
    Title: "Harry and Tonto",
    Img: "/img/harry_and_tonto.jpg",
    Director: "Paul Mazursky",
    Cat: {
      Name: "Tonto",
      ColorBreed: "Domestic gray shorthair",
      Bio: "Tonto is an elderly cat who accompanies his owner on a cross-country road trip, offering companionship and adding to the story’s charm."
    },
    Genre: "Adventure, Comedy, Drama",
    Year: "1974",
    Synopsis: "An elderly man and his cat, Tonto, embark on a cross-country trip after they are evicted from their New York apartment, encountering various adventures along the way."
  },

  {  
    Title: "Homeward Bound: The Incredible Journey",
    Img: "/img/homeward_bound.jpg",
    Director: "Duwayne Dunham",
    Cat: {
      Name: "Sassy",
      ColorBreed: "Himalayan",
      Bio: "Sassy is a sassy and pampered Himalayan cat who, along with two dogs, embarks on a journey across the American wilderness to find her family."
    },
    Genre: "Adventure, Drama, Family",
    Year: "1993",
    Synopsis: "Three pets, including a sassy Himalayan cat named Sassy, embark on a dangerous journey across the American wilderness to find their owners."
  },

  {
    Title: "Inside Llewyn Davis",
    Img: "/img/inside_llewyn_davis.jpg",
    Director: "Joel Coen, Ethan Coen",
    Cat: {
      Name: "Ulysses",
      ColorBreed: "Ginger tabby",
      Bio: "Ulysses is a ginger cat who plays a symbolic role in the story of a struggling folk musician in 1960s New York."
    },
    Genre: "Drama, Musical",
    Year: "2013",
    Synopsis: "This Coen Brothers film follows a struggling folk musician in 1960s New York, who ends up caring for a ginger cat that plays a symbolic role in his journey."
  },
  
  {  
    Title: "Keanu",
    Img: "/img/keanu.jpg",
    Director: "Peter Atencio",
    Cat: {
      Name: "Keanu",
      ColorBreed: "Gray tabby",
      Bio: "Keanu is a kitten that two friends attempt to rescue from a street gang. The kitten becomes central to their adventure as they pose as gang members to retrieve him."
    },
    Genre: "Action, Comedy",
    Year: "2016",
    Synopsis: "Two friends pose as dangerous criminals to infiltrate a street gang and retrieve their stolen kitten, Keanu, who has been taken by a gangster."
  },

  { 
    Title: "Kedi",
    Img: "/img/kedi.jpg",
    Director: "Ceyda Torun",
    Cat: {
      Name: "Various street cats in Istanbul (e.g., Sari, Duman, Bengü).",
      ColorBreed: "Various breeds, primarily domestic short-haired.",
      Bio: "Kedi is a documentary that follows several street cats in Istanbul, exploring their daily lives, interactions with humans, and the unique bond between the city and its feline residents."
    },
    Genre: "Documentary",
    Year: "2016",
    Synopsis: "A documentary that explores the lives of the street cats of Istanbul, and their unique relationship with the city's residents."
  },

  {  
    Title: "Nine Lives",
    Img: "/img/nine_live.jpg",
    Director: "Barry Sonnenfeld",
    Cat: {
      Name:"Tom Brand",
      ColorBreed:"Gray tabby",
      Bio:"Tom Brand is a successful businessman who, after a freak accident, finds himself trapped in the body of a cat. He learns valuable life lessons while navigating his new feline existence."
    },
    Genre: "Comedy, Family, Fiction",
    Year: "2016",
    Synopsis: "A workaholic businessman finds himself trapped inside the body of his family's cat and learns valuable life lessons in the process."
  },

   {   
    Title: "Oliver & Company",
    Img: "/img/oliver_and_company.jpg",
    Director: "George Scribner",
    Cat: {
      Name:"Oliver",
      ColorBreed:"Orange tabby",
      Bio:"Oliver is a young, adventurous kitten who joins a gang of dogs in New York City. He embarks on an adventure and forms a bond with his new friends."
    },
    Genre: "Animation, Adventure, Comedy",
    Year: "1988",
    Synopsis: "A homeless kitten named Oliver joins a gang of dogs to survive in New York City, and they embark on an adventure to rescue a girl from a wealthy but dangerous man."
  },

  {   
    Title: "Paws of Fury: The Legend of Hank",
    Img: "/img/paws_of_furry.jpg",
    Director: "Rob Minkoff, Mark Koetsier",
    Cat: {
      Name: "Hank",
      ColorBreed: "Gray tabby",
      Bio: "Hank is a clumsy and well-meaning dog who is mistaken for a cat and trained to become a samurai in order to defend a village from a villain."
    },
    Genre: "Animation, Adventure, Comedy",
    Year: "2022",
    Synopsis: "Hank, a dog who aspires to be a hero, is mistakenly trained as a samurai cat to save a village from an evil villain. He learns about courage and heroism along the way."
  },

  {   
    Title: "Pet Sematary",
    Img: "/img/pet_sematary.jpg",
    Director: "Mary Lambert",
    Cat: {
      Name: "Church",
      ColorBreed: "Gray tabby",
      Bio: "Church is a sinister cat who is resurrected from the dead with terrifying consequences for the family who buried him in a mysterious cemetery."
    },
    Genre: "Horror, Thriller",
    Year: "1989",
    Synopsis: "Based on Stephen King’s novel, this horror film features a sinister cat named Church who is resurrected from the dead, with terrifying consequences for the family who buried him in a mysterious cemetery."
  },

  {  
    Title: "Puss in Boots",
    Img: "/img/puss_in_boots.jpg",
    Director: "Chris Miller",
    Cat: {
      Name:"Puss in Boots",
      ColorBreed:"Orange tabby, likely modeled after a domestic shorthair.",
      Bio:"Puss in Boots is a suave, adventurous, and skilled feline swordsman known for his charming demeanor and iconic boots and hat. He originally appeared in Shrek 2 before starring in his own film."
    },
    Genre: "Animation, Adventure, Fantasy",
    Year: "2011",
    Synopsis: "The swashbuckling cat, Puss in Boots, embarks on a quest to find the legendary magic beans and restore his honor."
  },

  { 
    Title: "Soul",
    Img: "/img/soul.jpg",
    Director: "Pete Docter, Kemp Powers",
    Cat: {
      Name:"Mr. Mittens",
      ColorBreed:"Three color",
      Bio:"Mr. Mittens is a chubby, friendly cat who briefly hosts Joe Gardner's soul."
    },
    Genre: "Animation, Family",
    Year: "2020",
    Synopsis: "A middle-school music teacher with dreams of becoming a jazz musician finds himself in a fantastical world where souls are born. Along the way, he meets a cat named Mr. Mittens, who plays a key role in his journey of self-discovery."
  },

  {
    Title: "Shrek 2",
    Img: "/img/shrek2.jpg",
    Director: "Andrew Adamson, Kelly Asbury, Conrad Vernon",
    Cat: {
      Name:"Puss in Boots",
      ColorBreed:"Orange tabby",
      Bio:"Introduced in this sequel, Puss in Boots is a charming, skilled feline who becomes one of Shrek’s closest allies."
    },
    Genre: "Animation, Adventure, Comedy, Fantasy",
    Year: "2004",
    Synopsis: "The sequel to Shrek introduces Puss in Boots, a suave and skilled feline warrior who eventually becomes one of Shrek’s closest allies."
  },

  {  
    Title: "That Darn Cat!",
    Img: "/img/that_darn_cat.jpg",
    Director: "Robert Stevenson",
    Cat: {
      Name:"D.C. (Darn Cat)",
      ColorBreed:"Siamese",
      Bio:"D.C. is a Siamese cat who helps the FBI solve a kidnapping case by bringing home a wristwatch that belonged to the victim."
    },
    Genre: "Comedy, Crime, Family",
    Year: "1965",
    Synopsis: "A Siamese cat named D.C. helps the FBI solve a kidnapping case when he brings home a wristwatch that belonged to the victim."
  },
  
  {
    Title: "The Adventures of Milo and Otis",
    Img: "/img/milo_and_otis.jpg",
    Director: "Masanori Hata",
    Cat: {
      Name:"Milo",
      ColorBreed:"Orange tabby",
      Bio:"Milo is a curious kitten who goes on an epic adventure with his best friend, a pug named Otis, after they are separated."
    },
    Genre: "Adventure, Drama, Family",
    Year: "1986",
    Synopsis: "A curious kitten named Milo and his best friend, a pug named Otis, embark on an epic adventure across the countryside after they are accidentally separated."
  },

  {
    Title: "The Aristocats",
    Img: "/img/the_aristocats.jpg",
    Director: "Wolfgang Reitherman",
    Cat: {
      Name:"Duchess (mother) and her kittens: Marie, Berlioz, and Toulouse.",
      ColorBreed: "Duchess (white Persian), Marie (white Persian), Berlioz (gray kitten), Toulouse (orange kitten).",
      Bio: "Duchess is a refined, elegant mother cat who lives in Paris with her three kittens. Marie is sweet and ladylike, Berlioz is musically inclined, and Toulouse is artistic and adventurous."
    },
    Genre: "Animation, Adventure, Family, Comedy",
    Year: "1970",
    Synopsis: "A wealthy old woman plans to leave her fortune to her cats, but her butler tries to get rid of them. The cats must find their way back home with the help of a charming alley cat."
  },
    
  {
    Title: "The Black Cat",
    Img: "/img/the_black_cat.jpg",
    Director: "Edgar G. Ulmer",
    Cat: {
      Name:"The Black Cat",
      ColorBreed:"Black",
      Bio:"This unnamed black cat symbolizes bad luck and foreshadows danger. It serves as a sinister presence in the gothic story."
    },
    Genre: "Horror, Thriller",
    Year: "1934",
    Synopsis: "This classic horror film, loosely based on Edgar Allan Poe’s story, features a mysterious black cat that seems to have a supernatural influence over the events in a creepy mansion."
  },

  {
    Title: "The Cat in the Hat",
    Img: "/img/cat_in_the_hat.jpg",
    Director: "Bo Welch",
    Cat: {
      Name: "The Cat in the Hat",
      ColorBreed: "Black and white",
      Bio: "The Cat in the Hat is a mischievous and whimsical feline who brings chaos and fun wherever he goes, much to the dismay of the children he visits."
    },
    Genre: "Comedy, Family",
    Year: "2003",
    Synopsis: "The Cat in the Hat, a playful and chaotic feline, visits two bored children and turns their dull day into an adventure filled with mischief and fun."
  },

  {  
    Title: "The Cat Returns",
    Img: "/img/the_cat_returns.jpg",
    Director: "Hiroyuki Morita",
    Cat: {
      Name:"Cat King (King of the Cat Kingdom), Baron, and Haru",
      ColorBreed:"Cat King (regal appearance), Baron (anthropomorphic cat, elegant attire), Haru (white cat with a bow)",
      Bio:"Baron is a suave, anthropomorphic cat statue who comes to life and helps Haru, a girl who saved a cat and is taken to the Cat Kingdom. Haru is a human who turns into a cat in the Cat Kingdom."
    },
    Genre: "Animation, Adventure, Family",
    Year: "2002",
    Synopsis: "A young girl saves a cat and is taken to the mysterious Kingdom of Cats, where she must figure out how to return to her normal life."
  },

  {  
    Title: "The Cat That Walked by Himself",
    Img: "/img/the_cat_that_walked.jpg",
    Director: "Aleksandr Efremov",
    Cat: {
      Name:"The Cat",
      ColorBreed:"Wild cat",
      Bio:"The story follows a wild cat who learns to live alongside humans while maintaining his independence, based on Kipling’s story."
    },
    Genre: "Animation, Adventure, Family",
    Year: "1988",
    Synopsis: "Based on Rudyard Kipling's story, this animated film explores the story of a wild cat that learns to live alongside humans while maintaining his independence."
  },

  {  
    Title: "The Garfield Movie",
    Img: "/img/the_garfield_movie.png",
    Director: "Peter Hewitt",
    Cat: {
      Name:"Garfield",
      ColorBreed:"Orange tabby",
      Bio:"Garfield is a lazy, sarcastic, and food-loving cat who enjoys lounging and making witty remarks. He dislikes Mondays and loves lasagna."
    },
    Genre: "Animation, Comedy, Family",
    Year: "2004",
    Synopsis: "Garfield, a lazy and sarcastic cat, must deal with a new dog, Odie, in his home. When Odie is kidnapped, Garfield sets out to rescue him."
  },

  {  
    Title: "The Secret Life of Pets",
    Img: "/img/the_secret_life_of_pets.jpg",
    Director: "Chris Renaud",
    Cat: {
      Name:"Chloe",
      ColorBreed:"Gray tabby",
      Bio:"Chloe is a sarcastic and slightly overweight cat who, along with other pets, has adventures while their owners are away."
    },
    Genre: "Animation, Adventure, Comedy",
    Year: "2016",
    Synopsis: "When their owners leave for the day, a group of pets, including a sarcastic cat named Chloe, embark on their own wild adventures in the city."
  },
];

// Genre Description
let genres = {
    Action: "Movies characterized by fast-paced sequences, including physical stunts, fight scenes, and high-energy sequences.",
    Adventure: "Films that focus on exciting journeys and quests, often involving exploration, danger, and new experiences.",
    Animation: "Movies created using animated techniques, including 2D, 3D, or stop-motion, often featuring imaginative visuals and storytelling.",
    Biography: "Films that dramatize the lives of real people, focusing on their achievements, struggles, and personal stories.", 
    Comedy: "Movies designed to entertain and amuse, often through humor, witty dialogue, and humorous situations.", 
    Crime: "Movies that revolve around criminal activities, including investigations, heists, and the consequences of breaking the law.",
    Documentary: "Films that present factual information or real-life events, often aiming to educate or inform the audience about a particular subject.",
    Drama: "Movies that explore serious and emotional themes, often involving complex characters and intricate plots.",
    Family: "Films designed to be suitable for all ages, often featuring themes and stories that are engaging and appropriate for children and adults alike.",
    Fantasy: "Films set in imaginary worlds with magical or supernatural elements, often featuring mythical creatures and fantastical adventures.",
    Fiction: "Films that are entirely imagined, including stories and characters created by the writers and directors, not based on real events.",
    Horror: "Movies designed to scare and unsettle, often featuring supernatural elements, monsters, or psychological terror.",
    Musical: "Movies that incorporate song and dance routines as a major element of the storytelling, often featuring elaborate performances.",
    Mystery: "Films centered around solving a puzzle or crime, involving suspenseful and intriguing plots that challenge the audience to uncover hidden truths.",
    Thriller: "Films that build suspense and tension, often involving dangerous situations, dramatic twists, and high-stakes conflicts."
};



// READ
app.get('/', (req, res) => {
  res.send('Welcome to CatFlix, an app showcasing movies featurings cats!');
});

// READ Return a list of all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ Return data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('No movie was found...');
  }
});

// READ Return data about a specific genre
app.get('/genres/:genre', (req, res) => {
  const { genre } = req.params;
  const genreDescription = genres[genre];

  if (genreDescription) {
  res.status(200).json({ genre: genre, description: genreDescription });
} else {
  res.status(400).send('This genre was not found....');
}
});

// READ Return data about the featured cat (name, color/breed, bio) by name.
app.get('/movies/cat/:catName', (req, res) => {
  const { catName } = req.params;
  const cat = movies.find( movie => movie.Cat.Name === catName ).Cat;

  if (cat) {
  res.status(200).json(cat);
} else {
  res.status(400).send('No cat was found...');
}
});

// CREATE Allow new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.email) {
    newUser.email = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
   
  } else {
    res.status(400).send(message);
    const message = 'Missing email in request';
  }
});

// UPDATE Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
  const { username } = req.params;
  const { updatedUsername } = req.body;

  let user = users.find( user => user.Username === username );

  if (user) {
    user.Username = updatedUsername;
    res.status(200).send('Your username has been updated to:' + req.params.username);
  } else {
    res.status(400).send('An error occured, please try again');
  }
});

// POST Allow users to add a movie to their favorites
app.post('/users/:username/:movieTitle', (req, res) => {
  const { username, movieTitle } = req.params;

  let user = users.find( user => user.Username === username );

  if (user) {
    user.Favorites.push(movieTitle);
    res.status(201).send('The movie ' + movieTitle + ' has been added to your favorites!');
  } else {
    res.status(404).send('Could not add this movie to your favorites...');
  }
});


// DELETE Allow users to remove a movie from their favorites
app.delete('/users/:username/:movieTitle', (req, res) => {
  const { username, movieTitle } = req.params;

  let user = users.find( user => user.Username === username );

  if (user) {
    user.Favorites = user.Favorites.filter( title => title !== movieTitle);
    res.status(201).send('The movie ' + movieTitle + ' has been removed from your favorites!');
  } else {
    res.status(404).send('Could not remove this movie to your favorites...');
  }
});

// DELETE Allow a user to deregister
app.delete('/users/:username', (req, res) => {
  const { username } = req.params;
  
  let user = users.find( user => user.Username === username );
  
  if (user) {
    users = users.filter( user => user.Username !== username );
    res.status(200).send('The user ' + username + ' has been deregistered.');
  } else {
    res.status(404).send('Could not deregister user');
  }
});

// Morgan request to log requests into the terminal
app.use(morgan('common'));

// Log errors in log.txt
app.use((req, res, next) => {
  let addr = req.protocol + '://' + req.get('host') + req.originalUrl; 
  let logDetails = 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n';

 fs.appendFile('log.txt', logDetails, (err) => {
    if (err) {
      console.log('Failed to write to log: ', err);
    }
  });

  next(); 
});

// Errors-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});