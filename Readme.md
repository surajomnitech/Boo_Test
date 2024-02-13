# Code repo
download code from https://github.com/surajomnitech/Boo_Test.git
```
git clone https://github.com/surajomnitech/Boo_Test.git
```

# How to Install
`npm install`
# How to Start
`npm run start`
# How to access profile page
http://localhost:3000/profiles/
There will be one profile and one user already created by dafault. You can delete it or you can clean the code of adding these dafault data.
# How to test
## Test Profiles
`npm run profile-test`
## Test Users
`npm run user-test`
## Test Comments
`npm run comment-test`

# Curl Commands to End Points
## Get All Profiles
```
curl -X GET -H "Accept: application/json" http://localhost:3000/profiles
```
## Create Profile
```
curl -X POST -H "Content-Type: application/json" -d '{
  "id": 2,
  "name": "Elon Musk",
  "description": "A mysterious person",
  "mbti": "INTJ",
  "enneagram": "5w4",
  "variant": "sx/sp",
  "tritype": 514,
  "socionics": "ILI",
  "sloan": "RCOAN",
  "psyche": "ITVL",
  "image": "https://play-lh.googleusercontent.com/p6xC7ByyRWZjSAV65HGSzwo0_20UTtaHekhwuZentpVIZGKwWn-FQ8Dz42Ua68Nwj0pg=w240-h480-rw"
}' http://localhost:3000/profiles/create

```
## Get Profile by id
you can pass following parameters as filter
- all
- mbti
- enneagram
- zodiac

you can pass following parameters as sort
- best (sorted based on comment likes)
- recent

```
curl -X GET -H "Accept: application/json" http://localhost:3000/profiles/[profile_id]?filter=mbti&sort=best
```
## Create New User
```
curl -X POST -H "Accept: application/json" -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "password": "abc123"
}' http://localhost:3000/users/create
```
## Get All Users
```
curl -X GET http://localhost:3000/users/
```
## Add a Comment to a Profile
add the correct [profile_id] and [user_id]
you can sent `mbti`, 'enneagram' or 'zodiac' as empty string or null
```
curl -X POST -H "Accept: application/json" -H "Content-Type: application/json" -d '{
  "title": "Sample Comment",
  "description": "This is a test comment description.",
  "mbti": "ENTJ",
  "enneagram": "1w2",
  "zodiac": "Leo",
  "userId": [user_id]
}' http://localhost:3000/comments/add/[profile_id]
```

## 'LIKE' a comment
```
curl -X POST http://localhost:3000/comments/like/[comment_id]
```
## 'UNLIKE' a comment
```
curl -X POST http://localhost:3000/comments/unlike/[comment_id]
```
