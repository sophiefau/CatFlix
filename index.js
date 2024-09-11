const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs');

const app = express();

// Morgan request to log requests into the terminal
app.use(morgan('common'));

// Serve the “documentation.html” file from the public folder
app.use(express.static('public'));

// Movies Data
let catMovies = [
  {
    title: "The Aristocats",
    director: "Wolfgang Reitherman",
    cats: {
      name:"Duchess (mother) and her kittens: Marie, Berlioz, and Toulouse.",
      colorBreed: "Duchess (white Persian), Marie (white Persian), Berlioz (gray kitten), Toulouse (orange kitten).",
      bio: "Duchess is a refined, elegant mother cat who lives in Paris with her three kittens. Marie is sweet and ladylike, Berlioz is musically inclined, and Toulouse is artistic and adventurous.",
      fictional: "Yes."
    },
    genre: "Animation, Adventure, Comedy",
    year: "1970",
    synopsis: "A wealthy old woman plans to leave her fortune to her cats, but her butler tries to get rid of them. The cats must find their way back home with the help of a charming alley cat."
  },
  {  
    title: "Garfield: The Movie",
    director: "Peter Hewitt",
    cats: {
      name:"Garfield",
      colorBreed:"Orange tabby",
      bio:"Garfield is a lazy, sarcastic, and food-loving cat who enjoys lounging and making witty remarks. He dislikes Mondays and loves lasagna.",
      fictional:"Yes"
    },
    genre: "Comedy, Family",
    year: "2004",
    synopsis: "Garfield, a lazy and sarcastic cat, must deal with a new dog, Odie, in his home. When Odie is kidnapped, Garfield sets out to rescue him."
  },
  { 
    title: "Kedi",
    director: "Ceyda Torun",
    cats: {
      name:"Various street cats in Istanbul (e.g., Sari, Duman, Bengü).",
      colorBreed:"Various breeds, primarily domestic short-haired.",
      bio:"Kedi is a documentary that follows several street cats in Istanbul, exploring their daily lives, interactions with humans, and the unique bond between the city and its feline residents.",
      fictional:"No."
    },
    genre: "Documentary",
    year: "2016",
    synopsis: "A documentary that explores the lives of the street cats of Istanbul, and their unique relationship with the city's residents."
  },
  {  
    title: "Puss in Boots",
    director: "Chris Miller",
    cats: {
      name:"Puss in Boots",
      colorBreed:"Orange tabby, likely modeled after a domestic shorthair.",
      bio:"Puss in Boots is a suave, adventurous, and skilled feline swordsman known for his charming demeanor and iconic boots and hat. He originally appeared in Shrek 2 before starring in his own film.",
      fictional:"Yes"
    },
    genre: "Animation, Adventure, Comedy",
    year: "2011",
    synopsis: "The swashbuckling cat, Puss in Boots, embarks on a quest to find the legendary magic beans and restore his honor."
  },
  {  
    Title: "Cats",
    Director: "Tom Hooper",
    cats: {
      name:"Various characters such as Rum Tum Tugger, Mr. Mistoffelees, and Grizabella.",
      colorBreed:"Varies, the cats are anthropomorphized in the film.",
      bio:"Based on the famous musical, Cats features a tribe of cats called the Jellicles, who gather for an annual event where they decide which cat will ascend to the Heaviside Layer and be reborn.",
      fictional:"Yes"
    },
    Genre: "Musical, Fantasy",
    Year: "2019",
    Synopsis: "Based on the famous musical, this film follows a tribe of cats called the Jellicles as they make a decision about which one will ascend to the Heaviside Layer."
  },
  {  
    title: "The Cat Returns",
    director: "Hiroyuki Morita",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Family",
    year: "2002",
    synopsis: "A young girl saves a cat and is taken to the mysterious Kingdom of Cats, where she must figure out how to return to her normal life."
  },
  {  
    title: "Nine Lives",
    director: "Barry Sonnenfeld",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Comedy, Family, Fantasy",
    year: "2016",
    synopsis: "A workaholic businessman finds himself trapped inside the body of his family's cat and learns valuable life lessons in the process."
  },
  {   
    title: "Oliver & Company",
    director: "George Scribner",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Comedy",
    year: "1988",
    synopsis: "A homeless kitten named Oliver joins a gang of dogs to survive in New York City, and they embark on an adventure to rescue a girl from a wealthy but dangerous man."
  },
  {  
    title: "Homeward Bound: The Incredible Journey",
    director: "Duwayne Dunham",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Adventure, Drama, Family",
    year: "1993",
    synopsis: "Three pets, including a sassy Himalayan cat named Sassy, embark on a dangerous journey across the American wilderness to find their owners."
  },
  {   
    title: "A Street Cat Named Bob",
    director: "Roger Spottiswoode",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Biography, Drama, Family",
    year: "2016",
    synopsis: "Based on a true story, the film follows a homeless man struggling with addiction who befriends a stray cat, Bob, and finds a new purpose in life."
  },
  {   
    title: "Felidae",
    director: "Michael Schaack",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Crime, Mystery",
    year: "1994",
    synopsis: "In this dark animated thriller, a domestic cat named Francis uncovers a series of grisly murders in his neighborhood, leading him into a disturbing mystery."
  },
  {   
    title: "Cats Don't Dance",
    director: "Mark Dindal",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Comedy, Family",
    year: "1997",
    synopsis: "A small-town cat with big dreams moves to Hollywood, where he discovers that only humans get leading roles in movies, but he refuses to give up on his dream."
  },
  {  
    title: "Keanu",
    director: "Peter Atencio",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Action, Comedy",
    year: "2016",
    synopsis: "Two friends pose as dangerous criminals to infiltrate a street gang and retrieve their stolen kitten, Keanu, who has been taken by a gangster."
   },
  {   
    title: "Harry and Tonto",
    director: "Paul Mazursky",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Adventure, Comedy, Drama",
    year: "1974",
    synopsis: "An elderly man and his cat, Tonto, embark on a cross-country trip after they are evicted from their New York apartment, encountering various adventures along the way."
  },
  {  
    title: "The Secret Life of Pets",
    director: "Chris Renaud",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Comedy",
    year: "2016",
    synopsis: "When their owners leave for the day, a group of pets, including a sarcastic cat named Chloe, embark on their own wild adventures in the city."
  },
  {  
    title: "That Darn Cat!",
    director: "Robert Stevenson",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Comedy, Crime, Family",
    year: "1965",
    synopsis: "A Siamese cat named D.C. helps the FBI solve a kidnapping case when he brings home a wristwatch that belonged to the victim."
  },
  {  
    title: "The Cat That Walked by Himself",
    director: "Aleksandr Efremov",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Family",
    year: "1988",
    synopsis: "Based on Rudyard Kipling's story, this animated film explores the story of a wild cat that learns to live alongside humans while maintaining his independence."
  },
  {  
    title: "Gay Purr-ee",
    director: "Abe Levitow",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Comedy",
    year: "1962",
    synopsis: "A country cat named Mewsette travels to Paris, where she gets caught up in the city's glamour but eventually learns the value of home and true love."
  },
  {   
    title: "Coraline",
    director: "Henry Selick",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Drama, Fantasy",
    year: "2009",
    synopsis: "A young girl discovers a parallel world where everything seems perfect, but she soon realizes there's a dark side to it. A mysterious black cat helps her navigate the dangers."
  },
  { 
    title: "Soul",
    director: "Pete Docter, Kemp Powers",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Comedy",
    year: "2020",
    synopsis: "A middle-school music teacher with dreams of becoming a jazz musician finds himself in a fantastical world where souls are born. Along the way, he meets a cat named Mr. Mittens, who plays a key role in his journey of self-discovery."
  },
  {  
    title: "An American Tail",
    director: "Don Bluth",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Drama",
    year: "1986",
    synopsis: "A young mouse named Fievel embarks on a journey to America, facing the dangers posed by cats along the way as he tries to reunite with his family."
  },
  {
    title: "Alice in Wonderland",
    director: "Clyde Geronimi, Wilfred Jackson, Hamilton Luske",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Family",
    year: "1951",
    synopsis: "In this classic Disney adaptation of Lewis Carroll's story, Alice follows the White Rabbit into Wonderland, where she encounters the mischievous Cheshire Cat, known for his wide grin and disappearing acts."
  },
  {
    title: "The Adventures of Milo and Otis",
    director: "Masanori Hata",
    genre: "Adventure, Drama, Family",
    year: "1986",
    synopsis: "A curious kitten named Milo and his best friend, a pug named Otis, embark on an epic adventure across the countryside after they are accidentally separated."
  },
  {
    title: "Pet Sematary",
    director: "Mary Lambert",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Horror, Thriller",
    year: "1989",
    synopsis: "Based on Stephen King’s novel, this horror film features a sinister cat named Church who is resurrected from the dead, with terrifying consequences for the family who buried him in a mysterious cemetery."
  },
  {
    title: "Shrek 2",
    director: "Andrew Adamson, Kelly Asbury, Conrad Vernon",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Animation, Adventure, Comedy",
    year: "2004",
    synopsis: "The sequel to Shrek introduces Puss in Boots, a suave and skilled feline warrior who eventually becomes one of Shrek’s closest allies."
  },
  {
    title: "Inside Llewyn Davis",
    director: "Joel Coen, Ethan Coen",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Drama, Music",
    year: "2013",
    synopsis: "This Coen Brothers film follows a struggling folk musician in 1960s New York, who ends up caring for a ginger cat that plays a symbolic role in his journey."
  },
  {
    title: "The Black Cat",
    director: "Edgar G. Ulmer",
    cats: {
      name:"",
      colorBreed:"",
      bio:"",
      fictional:""
    },
    genre: "Horror, Thriller",
    year: "1934",
    synopsis: "This classic horror film, loosely based on Edgar Allan Poe’s story, features a mysterious black cat that seems to have a supernatural influence over the events in a creepy mansion."
  }
];

// GET catMovies
app.get('/movies', (req, res) => {
  res.json(catMovies);
});

// Get default textual response
app.get('/', (req, res) => {
  res.send('Welcome to my app about Movies featuring cats!');
});

// Errors-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Log errors in log.txt
  const logMessage = `URL: ${req.url}\nTimestamp: ${new Date()}\nError Stack: ${err.stack}\n\n`;
  fs.appendFile('log.txt', logMessage, (err) => {
   if (err) {
     console.log('Failed to write to log:', err);
   } else {
     console.log('Error logged to log.txt');
   }
 });

  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});