import axios from 'axios';

export const battle = async (players) => {
  const results = await axios.all(players.map(getUserData))
                             .catch(handleError);
  return results === null ? results : sortPlayers(results);
}

export const fetchPopularRepos = async (language) => {
  var encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:
     ${language}&sort=stars&order=desc&type=Repositories`);
  const repos = await axios.get(encodedURI).catch(handleError);
  return repos.data.items
}

const id = 'CLIENT_ID';
const sec = 'Secret_ID';
const params = `?client_id=${id}&client_secret=${sec}`;
const gitUrl = 'https://api.github.com/users/';


const getProfile = async (username) => {
  const url = `${ gitUrl + username + params}`
  // return axios.get(url).then((user) => user.data); // impicit return
  // return axios.get(url).then(({data}) => data); // destructure with the data property on the user object
  const profile = await axios.get(url)
  return profile.data
}

const getRepos = (username) => {
  const url = `${ gitUrl + username + '/repos' + params + '&per_page=100'}`;
  return axios.get(url)
}

const getStartCount = (repos) => {
  // return repos.data.reduce((count, repo) => {
  //   return count + repo.stargazers_count
  // }, 0);

  /* 1. Implicit return statement */
  // since there is only one return statement
  // we can omit the return make it implicit
  // return repos.data.reduce((count, repo) => count + repo.stargazers_count,0);

  /* 2. object destructing of the repo  */
  // since there is only one property stargazers_count 
  // lets destructure and pass in only the property being used
  return repos.data.reduce((count, {stargazers_count}) => count + stargazers_count,0);
}

/* destructing mostly */
// const calculateScore = (profile, repos) => {
//   var followers = profile.followers;
//   var totalStarts = getStartCount(repos);

//   return (followers * 3) + totalStarts;
// }

const calculateScore = ({followers}, repos) => {
  return (followers * 3) + getStartCount(repos);
}
const handleError = ( error ) => {
  console.warn(error);
  return null;
}

const getUserData = async (player) => {
  const [profile, repos ] = await axios.all([getProfile(player), getRepos(player)])
  return  ({
    profile: profile,
    score: calculateScore(profile, repos)
  })
}

const sortPlayers = (players) => {
  return players.sort((a,b) => b.score - a.score);
}

