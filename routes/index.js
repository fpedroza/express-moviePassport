const express = require('express');
const request = require('request');
const passport = require('passport');

const config = require('../config');

const apiKey = config.apiKey;
const apiBaseUrl = 'http://api.themoviedb.org/3';
const indexUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;

const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';  // w300 = 300px wide

const router = express.Router();

router.use((req, res, next)=> {
  res.locals.imageBaseUrl = imageBaseUrl;
  res.locals.pageHeader = "Now Playing";
  next();
});

router.get('/', (req, res, next)=> {
  console.log("User info\n", req.user);
  request.get(indexUrl, (error, response, movieData)=> {
    const parsedData = JSON.parse(movieData);
    res.render('index', {
      parsedData: parsedData.results
    });
  });
});

router.get('/login', passport.authenticate('github'));

router.get('/logout', (req, res, next)=> {
  console.log('logout');
  req.logout && req.logout();
  res.redirect('/');
});

router.get('/auth', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/loginFailed'
}));

router.get('/favorites', (req, res, next)=> {
  console.log(req.user);
  res.json(req.user.displayName);
});

router.get('/loginFailed', (req, res, next)=> {
  res.render('error', {
    message: "Login failed"
  });
});

router.get('/movie/:id', (req, res, next)=> {
  const movieId = req.params.id;
  const movieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  request.get(movieUrl, (error, response, movieData)=> {
    const parsedData = JSON.parse(movieData);
    res.render('single-movie', {
      parsedData: parsedData
    });
  });
});

router.post('/search', (req, res, next)=> {
  const cat = req.body.cat;
  const searchTerm = req.body.movieSearch;

  const searchUrl = `${apiBaseUrl}/search/${cat}?query=${encodeURI(searchTerm)}&api_key=${apiKey}`

  request.get(searchUrl, (error, response, movieData)=> {
    let parsedData = JSON.parse(movieData); 
    //res.json(parsedData);

    if (cat === 'person') {  // special handing for person search
      parsedData.results = parsedData.results[0].known_for;
    }

    res.render('index', {
      pageHeader: "Search Results: " + searchTerm,
      parsedData: parsedData.results
    })
  });
});

module.exports = router;
