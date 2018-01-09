import axios from 'axios';

export const battle = (players) => {
  return axios.all(players.map(getUserData))
              .then(sortPlayers)
              .catch(handleError);
}

export const fetchPopularRepos = (language) => {
  var encodedURI = window.encodeURI(
    'https://api.github.com/search/repositories?q=stars:>1+language:' +
      language +
      '&sort=stars&order=desc&type=Repositories'
  );

  return axios.get(encodedURI).then((response) => {
    return response.data.items;
  });
}

const id = 'CLIENT_ID';
const sec = 'Secret_ID';
const params = `?client_id=${id}&client_secret=${sec}`;
const gitUrl = 'https://api.github.com/users/';


const getProfile = (username) => {
  const url = `${ gitUrl + username + params}`
  return axios.get(url).then((user) => {
    return user.data;
  });
}

const getRepos = (username) => {
  const url = `${ gitUrl + username + '/repos' + params + '&per_page=100'}`;
  return axios.get(url)
}

const getStartCount = (repos) => {
  return repos.data.reduce((count, repo) => {
    return count + repos.stargazers_count;
  }, 0);
}

const calculateScore = (profile, repos) => {
  var followers = profile.followers;
  var totalStarts = getStartCount(repos);

  return (followers * 3) + totalStarts;
}

const handleError = ( error ) => {
  console.warn(error);
  return null;
}

const getUserData = (player) => {
  return axios.all([getProfile(player), getRepos(player)])
              .then((data) => {

                var profile = data[0];
                var repos = data[1];

                return {
                  profile: profile,
                  score: calculateScore(profile, repos)
                }

              });
}

const sortPlayers = (players) => {
  return players.sort((a,b) => {
    return b.score - a.score;
  } );
}

